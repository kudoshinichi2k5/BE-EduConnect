const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // File bạn vừa tải về

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;