const admin = require('firebase-admin');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Defina a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS apontando para a service account JSON.');
  process.exit(1);
}

admin.initializeApp();

async function checkByEmail(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log('UID:', user.uid);
    console.log('Email:', user.email);
    console.log('Custom claims:', JSON.stringify(user.customClaims || {}, null, 2));
  } catch (err) {
    console.error('Erro:', err.message || err);
    process.exitCode = 2;
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Uso: node scripts/check-claims.js seu@exemplo.com');
  process.exit(1);
}

checkByEmail(email).then(() => process.exit());
