const admin = require('firebase-admin');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

admin.initializeApp();
const db = admin.firestore();

exports.enqueueVaccineAlert = onCall({ region: 'us-central1' }, async (request) => {
  if (!request.auth || request.auth.token.admin !== true) {
    throw new HttpsError('permission-denied', 'Somente administradores podem agendar alertas.');
  }

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
