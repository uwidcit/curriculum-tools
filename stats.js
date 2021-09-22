var admin = require("firebase-admin");
var serviceAccount = require("./sa.json");
const fs = require('fs');
const { writeCSV } = require("./util.js");
const topicList = require("./data/parsed-topics.json");


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


function addCourse(res, course, topic, topicId){
    let flag = false;
    for(let rec of res){
        if(rec.topicId === topicId){
            flag = true;
            rec.courses.push(course);
        }
    }
    if(!flag){
        res.push({
            topic,
            topicId,
            courses: [course]
        });
    }
}



async function getTopics(){
    
    const dump = require('./output/dump.json');

    let res = [];

    for(let { courses } of dump){
        for(let course in courses){
            for( let text of courses[course]){
                let topicId = text.split(' - ')[0];
                let topic = text.split(' - ')[1];

                addCourse(res, course, topic, topicId);

                // let topicId = getTopicId(text);
                // let topic = topicList[topicId];
                // if(topic === undefined)`Topic for Topic ID ${topicId} not found Error`;
                // console.log(topic);
                // if(! ('courses' in topic))
                //     topic.courses = [];
                // topic.courses.push(course)
                // console.log(course, topicId, topic);
            }
        }
    }
    // console.log(res);
    
    await writeCSV(`./output/app-topics.csv`, res, [
        { id:'topicId', title:'Topic ID' },
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


// backupData()
getTopics();