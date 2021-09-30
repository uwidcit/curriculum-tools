var admin = require("firebase-admin");
var serviceAccount = require("./sa.json");
const fs = require('fs');
const { writeCSV, readCSV } = require("./util.js");
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

/**
 * Adds the specified course to the courses array of the specified topic in the topics array
 * @param {Object[]} topics 
 * @param {String} topics[].topic - textual representation of the topic
 * @param {String} topics[].topicId - the id of the topic
 * @param {String[]} topics[].courses - the array of course codes that are mapped to the topic
 * @param {String} course - the course id
 * @param {String} topicText - textual representation of the topic
 * @param {String} topicId - the id of the topic
 */
function addCourse(topics, course, topicText, topicId){
    let topicIdFound = false;
    for(let rec of topics){
        if(rec.topicId === topicId){
            topicIdFound = true;
            rec.courses.push(course);
        }
    }
    if(!topicIdFound){
        topics.push({
            topic: topicText,
            topicId,
            courses: [course]
        });
    }
}

/**
 * Converts topics dumped from app to csv file
 */
async function appTopicsToCSV(){
    
    const dump = await pullAppMappingsV1()

    let res = [];

    for(let { courses } of dump){
        for(let course in courses){
            for( let text of courses[course]){
                let topicId = text.split(' - ')[0];
                let topic = text.split(' - ')[1];

                addCourse(res, course, topic, topicId);
            }
        }
    }
    
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

/**
 * Downloads the topics mappings from the app (version 1 database)
 */
async function pullAppMappingsV1(){
    const snapshot = await db.collection('users').get();
    let res = [];
    snapshot.forEach(doc => {
        res.push(doc.data());
    });
}

/**
 * Downloads the topping mapping from the app (version 1) and dumps it to dump.json
 */
async function backupData(){
    let res = await pullAppMappingsV1();
    await fs.writeFileSync('./output/dump.json', JSON.stringify(res, null, 2));
    console.log('dump.json created');
}

function groupByCourse(topics){
    let courses = {};

    for(let topic of topics){
  
        for(let course of topic.courses){
            courses[course] ??= [];
            courses[course].push(topic.topicId);
        }
    }

    return courses;
}


async function migrateTopicsToApp(){
    const topics = await readCSV('./output/merged-topics.csv');
    const promises = [];
    
    for (let topic of topics){
        topic.courses = topic.courses.split(',');
        if(topic.courses[0] == [""])
            topic.courses = [];
        promises.push(db.collection('topics').doc(topic.topicId).set(topic));
    }

    const courses = groupByCourse(topics);
    for( let [course, topics] of Object.entries(courses)){
        promises.push(db.collection('courses').doc(course).set({topics}));
    }   
    
    Promise.all(promises);
    console.log('Database Updated');
}


// backupData()
// getTopics();
// migrateTopicsToApp()