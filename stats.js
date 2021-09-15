var admin = require("firebase-admin");


var serviceAccount = require("./sa.json");
const { cstopics, cssubdomains, csdomains } = require("./data/csmodule.js");
const fs = require('fs');
const { writeCSV } = require("./util.js");
const topicList = require("./data/cstopics.json");


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

        
    await writeCSV('./stats.csv', stats, [
        { id:'lecturer', title:'Lecturer' },
        { id:'course', title:'Course Code' },
        { id:'numTopics', title:'Number of Topics' },
    ]);

    console.log('stats.json dumped');
}

function getTopicId(string){
    return string.split(" - ")[0].trim();
}

async function getTopics(filename){
    
    const dump = require('./output/dump.json');

    for(let { courses } of dump){
        for(let course in courses){
            for( let text of courses[course]){
                let topicId = getTopicId(text);
                let topic = topicList[topicId];
                if(!topic)throw 'Topic ID not found Error';
                topic.courses ??= [];
                topic.courses.push(course)
            }
        }
    }

    
    await writeCSV(`./output/${filename}`, Object.values(topicList), [
        { id:'topicId', title:'Topic ID' },
        { id:'subdomainId', title:'SubDomain ID' },
        { id:'subdomain', title:'Sub Domain' },
        { id:'domain', title:'Domain' },
        { id:'domainId', title:'Domain ID' },
        { id:'courses', title:'Courses' },
        { id:'topic', title:'Topic'},
        { id:'courses', title:'Courses'}
    ]);

}

async function getTopicsDump(){
 
    let res = {};

    for (let domainId in cstopics){
        for(let subdomainId in cstopics[domainId]){
            for(let {topicId, topic} of cstopics[domainId][subdomainId]){
                res[topicId] = 
                    {
                        domainId,
                        subdomainId,
                        domain: csdomains[domainId],
                        subdomain: cssubdomains[subdomainId],
                        topic,
                        topicId,
                        
                    }
            }

        }
    }
    await fs.writeFileSync('./data/cstopics.json', JSON.stringify(res, null, 2));

}

async function backupData(){
    const snapshot = await db.collection('users').get();
    let res = [];
    snapshot.forEach(doc => {
        res.push(doc.data());
    });
    await fs.writeFileSync('./output/dump.json', JSON.stringify(res, null, 2));
    console.log('dump.json created');

}


module.exports = { getStats, getTopics, backupData }