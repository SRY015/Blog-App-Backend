var admin = require("firebase-admin");

var serviceAccount = require("../voting-app-ebb39-firebase-adminsdk-6cf2d-94a4562a2a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
