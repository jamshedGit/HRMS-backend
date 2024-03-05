const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../../eams-test-7f4a7-firebase-adminsdk-hfara-9c9ec246a0.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: "gs://eams-test-7f4a7.appspot.com/ibFormImages"
});

module.exports = { firebaseAdmin };
