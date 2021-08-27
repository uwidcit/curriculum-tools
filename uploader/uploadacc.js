var admin = require("firebase-admin");
const courses = require('./lecturers.json')

var serviceAccount = require("../sa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function formatData(){
    let res = {};


    for(let {course, email, fname, lname }  of courses){
        if (course.includes('INFO')) continue;
        if( email in res ){
            res[email].courses[course] = [];
        }else{
            res[email] = {
                'name': `${fname} ${lname}`,
                'courses': { },
                email
            };
            res[email].courses[course] = [];
        }
    }

    const promises = [];

    for(let [key, data] of Object.entries(res) ){
        promises.push(db.collection('users').doc(key).set(data));
    }

    await Promise.all(promises);
    console.log('done');
}

formatData();