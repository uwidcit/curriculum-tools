var admin = require("firebase-admin");
var serviceAccount = require("../sa.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function getStats(){
    const snapshot = await db.collection('users').get();
    const stats = [];
    snapshot.forEach(doc => {
        const data = doc.data();

        for( let [key, value] of Object.entries(data.courses) ){
            const rec = {};
            rec.lecturer = data.name;
            rec.course = key;
            rec.numTopics = value.length;
            stats.push(rec);    
        }

    });

    return stats;
}

module.exports = { getStats }