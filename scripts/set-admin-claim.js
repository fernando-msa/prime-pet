const admin = require('firebase-admin');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Defina a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS apontando para a service account JSON.');
  process.exit(1);
}

admin.initializeApp();
const db = admin.firestore();

async function setClaim(email, enable = true, createFallback = false) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const uid = user.uid;
    const claims = enable ? { admin: true } : {};
    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`Custom claim 'admin' ${enable ? 'definida' : 'removida'} para UID: ${uid}`);

    if (createFallback && enable) {
      const docRef = db.collection('admin_users').doc(uid);
      await docRef.set({ enabled: true, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: 'scripts/set-admin-claim' }, { merge: true });
      console.log('Documento admin_users/{uid} criado/atualizado como fallback.');
    }
  } catch (err) {
    console.error('Erro:', err.message || err);
    process.exitCode = 2;
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Uso: node scripts/set-admin-claim.js seu@exemplo.com [--disable] [--create-fallback]');
  process.exit(1);
}

const disable = process.argv.includes('--disable');
const createFallback = process.argv.includes('--create-fallback');

setClaim(email, !disable, createFallback).then(() => process.exit());
