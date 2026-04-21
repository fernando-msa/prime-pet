const admin = require('firebase-admin');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

admin.initializeApp();
const db = admin.firestore();

const OPS_WEBHOOK_DOC = 'ops_config/webhook';

function assertAdmin(request) {
  if (!request.auth || request.auth.token.admin !== true) {
    throw new HttpsError('permission-denied', 'Somente administradores podem executar esta operação.');
  }
}

function normalizeWebhookUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';

  let parsed;
  try {
    parsed = new URL(value);
  } catch (_) {
    throw new HttpsError('invalid-argument', 'Webhook inválido. Informe uma URL HTTPS válida.');
  }

  if (parsed.protocol !== 'https:') {
    throw new HttpsError('invalid-argument', 'Webhook inválido. Apenas URLs HTTPS são aceitas.');
  }

  return parsed.toString();
}

async function readOperationalWebhook() {
  const snap = await db.doc(OPS_WEBHOOK_DOC).get();
  if (!snap.exists) return null;
  const data = snap.data() || {};
  if (!data.url || data.enabled === false) return null;
  return {
    url: String(data.url),
    enabled: true,
  };
}

async function dispatchOperationalWebhook(eventType, payload) {
  const cfg = await readOperationalWebhook();
  if (!cfg?.url) {
    return { delivered: false, reason: 'not_configured' };
  }

  const body = {
    eventType,
    payload,
    at: Date.now(),
  };

  const response = await fetch(cfg.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    logger.error('Falha ao enviar webhook operacional', {
      status: response.status,
      body: text.slice(0, 500),
    });
    throw new HttpsError('internal', `Webhook retornou HTTP ${response.status}.`);
  }

  return { delivered: true };
}

exports.getOperationalWebhook = onCall({ region: 'us-central1' }, async (request) => {
  assertAdmin(request);

  const snap = await db.doc(OPS_WEBHOOK_DOC).get();
  if (!snap.exists) {
    return { configured: false, url: '' };
  }

  const data = snap.data() || {};
  return {
    configured: Boolean(data.url) && data.enabled !== false,
    url: String(data.url || ''),
    updatedBy: String(data.updatedBy || ''),
  };
});

exports.setOperationalWebhook = onCall({ region: 'us-central1' }, async (request) => {
  assertAdmin(request);

  const url = normalizeWebhookUrl(request.data?.url);
  const ref = db.doc(OPS_WEBHOOK_DOC);

  if (!url) {
    await ref.set(
      {
        url: '',
        enabled: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: request.auth.uid,
      },
      { merge: true }
    );
    return { ok: true, configured: false };
  }

  await ref.set(
    {
      url,
      enabled: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: request.auth.uid,
    },
    { merge: true }
  );

  return { ok: true, configured: true };
});

exports.testOperationalWebhook = onCall({ region: 'us-central1' }, async (request) => {
  assertAdmin(request);

  const result = await dispatchOperationalWebhook('teste_operacional', {
    message: 'Teste manual do painel admin Prime Pet',
    requestedBy: request.auth.uid,
  });

  return { ok: true, ...result };
});

exports.notifyOperationalEvent = onCall({ region: 'us-central1' }, async (request) => {
  assertAdmin(request);

  const eventType = String(request.data?.eventType || '').trim();
  const payload = request.data?.payload || {};

  if (!eventType) {
    throw new HttpsError('invalid-argument', 'eventType é obrigatório.');
  }

  const result = await dispatchOperationalWebhook(eventType, {
    ...payload,
    requestedBy: request.auth.uid,
  });

  return { ok: true, ...result };
});

exports.enqueueVaccineAlert = onCall({ region: 'us-central1' }, async (request) => {
  assertAdmin(request);

  const { customerId, petName, vaccineName, dueDate, channel = 'whatsapp' } = request.data || {};

  if (!customerId || !petName || !vaccineName || !dueDate) {
    throw new HttpsError('invalid-argument', 'Campos obrigatórios: customerId, petName, vaccineName, dueDate.');
  }

  const sendAt = new Date(dueDate);
  if (Number.isNaN(sendAt.getTime())) {
    throw new HttpsError('invalid-argument', 'dueDate inválido (use ISO-8601).');
  }

  const payload = {
    customerId,
    petName,
    vaccineName,
    dueDate,
    channel,
    status: 'queued',
    sendAt: admin.firestore.Timestamp.fromDate(sendAt),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: request.auth.uid
  };

  const ref = await db.collection('vaccine_alerts').add(payload);
  return { ok: true, id: ref.id };
});

exports.dispatchVaccineAlerts = onSchedule(
  { schedule: 'every 15 minutes', timeZone: 'America/Sao_Paulo', region: 'us-central1' },
  async () => {
    const now = admin.firestore.Timestamp.now();
    const snap = await db
      .collection('vaccine_alerts')
      .where('status', '==', 'queued')
      .where('sendAt', '<=', now)
      .limit(50)
      .get();

    if (snap.empty) {
      logger.info('Nenhum alerta de vacina pendente para envio.');
      return;
    }

    const batch = db.batch();

    snap.docs.forEach((doc) => {
      const data = doc.data();
      const message = `Lembrete de vacina: ${data.petName} deve receber ${data.vaccineName} em ${data.dueDate}.`;

      const outboxRef = db.collection('notification_outbox').doc();
      batch.set(outboxRef, {
        type: 'vaccine_alert',
        alertId: doc.id,
        customerId: data.customerId,
        channel: data.channel || 'whatsapp',
        message,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      batch.update(doc.ref, {
        status: 'dispatched',
        dispatchedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    logger.info(`Alertas despachados para fila: ${snap.size}.`);
  }
);
