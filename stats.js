let admin = require("firebase-admin");
const serviceAccount = require("./sa.json");
const fs = require('fs');
const { writeCSV, readCSV, readJSON, writeJSON } = require("./util.js");
const topicList = require("./data/parsed-topics.json");
const courseDetails = require('./data/courses.json');
let createHTML = require('create-html');
let htmlToRtf = require('html-to-rtf');


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

async function uploadDomains(){
    const domains = await readJSON('./data/topics-nested.json');
    let promises = [];
    for(let [key, value] of Object.entries(domains)){
        promises.push(db.collection('domains').doc(key).set(value));
    }
    Promise.all(promises);
}

async function createStatObj(){
    let res = {};
    const nested = await readJSON('./data/topics-nested.json');
    for(let domainId in nested){
        res[domainId]=0;
        for(let subdomainId in nested[domainId]){
            res[subdomainId] = 0;
        }
    }
    writeJSON('./data/course-stats.json', res);
}


function updateStats(db, doc){
    const stats = {
        "total":0,
        "AL": 0,
        "AL-01": 0,
        "AL-02": 0,
        "AL-03": 0,
        "AL-04": 0,
        "AL-05": 0,
        "AL-06": 0,
        "AL-07": 0,
        "AR": 0,
        "AR-01": 0,
        "AR-02": 0,
        "AR-03": 0,
        "AR-04": 0,
        "AR-05": 0,
        "AR-06": 0,
        "AR-07": 0,
        "AR-08": 0,
        "CN": 0,
        "CN-01": 0,
        "CN-02": 0,
        "CN-03": 0,
        "CN-04": 0,
        "CN-05": 0,
        "CN-06": 0,
        "DS": 0,
        "DS-01": 0,
        "DS-02": 0,
        "DS-03": 0,
        "DS-04": 0,
        "DS-05": 0,
        "DS-06": 0,
        "GV": 0,
        "GV-01": 0,
        "GV-02": 0,
        "GV-03": 0,
        "GV-04": 0,
        "GV-05": 0,
        "GV-06": 0,
        "HCI": 0,
        "HCI-01": 0,
        "HCI-02": 0,
        "HCI-03": 0,
        "HCI-04": 0,
        "HCI-05": 0,
        "HCI-06": 0,
        "HCI-07": 0,
        "HCI-08": 0,
        "HCI-09": 0,
        "HCI-10": 0,
        "IAS": 0,
        "IAS-01": 0,
        "IAS-02": 0,
        "IAS-03": 0,
        "IAS-04": 0,
        "IAS-05": 0,
        "IAS-06": 0,
        "IAS-07": 0,
        "IAS-08": 0,
        "IAS-09": 0,
        "IAS-10": 0,
        "IM": 0,
        "IM-01": 0,
        "IM-02": 0,
        "IM-03": 0,
        "IM-04": 0,
        "IM-05": 0,
        "IM-06": 0,
        "IM-07": 0,
        "IM-08": 0,
        "IM-09": 0,
        "IM-10": 0,
        "IM-11": 0,
        "IM-12": 0,
        "IS": 0,
        "IS-01": 0,
        "IS-02": 0,
        "IS-03": 0,
        "IS-04": 0,
        "IS-05": 0,
        "IS-06": 0,
        "IS-07": 0,
        "IS-08": 0,
        "IS-09": 0,
        "IS-10": 0,
        "IS-11": 0,
        "IS-12": 0,
        "NC": 0,
        "NC-01": 0,
        "NC-02": 0,
        "NC-03": 0,
        "NC-04": 0,
        "NC-05": 0,
        "NC-06": 0,
        "NC-07": 0,
        "OS": 0,
        "OS-01": 0,
        "OS-02": 0,
        "OS-03": 0,
        "OS-04": 0,
        "OS-05": 0,
        "OS-06": 0,
        "OS-07": 0,
        "OS-08": 0,
        "OS-09": 0,
        "OS-10": 0,
        "OS-11": 0,
        "OS-12": 0,
        "PD": 0,
        "PD-01": 0,
        "PD-02": 0,
        "PD-03": 0,
        "PD-04": 0,
        "PD-05": 0,
        "PD-06": 0,
        "PD-07": 0,
        "PD-08": 0,
        "PD-09": 0,
        "PBD": 0,
        "PBD-01": 0,
        "PBD-02": 0,
        "PBD-03": 0,
        "PBD-04": 0,
        "PBD-05": 0,
        "PL": 0,
        "PL-01": 0,
        "PL-02": 0,
        "PL-03": 0,
        "PL-04": 0,
        "PL-05": 0,
        "PL-06": 0,
        "PL-07": 0,
        "PL-08": 0,
        "PL-09": 0,
        "PL-10": 0,
        "PL-11": 0,
        "PL-12": 0,
        "PL-13": 0,
        "PL-14": 0,
        "PL-15": 0,
        "PL-16": 0,
        "PL-17": 0,
        "SP": 0,
        "SP-01": 0,
        "SP-02": 0,
        "SP-03": 0,
        "SP-04": 0,
        "SP-05": 0,
        "SP-06": 0,
        "SP-07": 0,
        "SP-08": 0,
        "SP-09": 0,
        "SP-10": 0,
        "SDF": 0,
        "SDF-01": 0,
        "SDF-02": 0,
        "SDF-03": 0,
        "SDF-04": 0,
        "SE": 0,
        "SE-01": 0,
        "SE-02": 0,
        "SE-03": 0,
        "SE-04": 0,
        "SE-05": 0,
        "SE-06": 0,
        "SE-07": 0,
        "SE-08": 0,
        "SE-09": 0,
        "SE-10": 0,
        "SF": 0,
        "SF-01": 0,
        "SF-02": 0,
        "SF-03": 0,
        "SF-04": 0,
        "SF-05": 0,
        "SF-06": 0,
        "SF-07": 0,
        "SF-08": 0,
        "SF-09": 0,
        "SF-10": 0
    };

    const {mapping} = doc.data();

    for(let [topic, status] of Object.entries(mapping)){
        const domainId = topic.split('-')[0];
        const subdomainId = domainId+"-"+topic.split('-')[1];

        if(status === 'taught'){
            stats[domainId]++;
            stats[subdomainId]++;
            stats['total']++;
        }
            
    }

    return db.collection('courses').doc(doc.id).update({mapping, stats});
}

function parseCourses(courseString){
    if (courseString === '')return [];
    return courseString.split(',').map(ele=>ele.trim()).filter(ele => ele!== '');
}

function groupMappingsByCourse(mappings){
    let courseMap = {};
    for(let topic of mappings){
        
        const courses = parseCourses(topic.courses);
        for(let course of courses){   
           
            const { title } = courseDetails[course];
            courseMap[course] ??= { course, title, topics: []};
            courseMap[course].topics.push(topic.topicId);

        }
    }
    return courseMap;
}

async function syncDBtoFile(file){
    const mappings = await readCSV(file);
    const courseMap = groupMappingsByCourse(mappings);

    // console.log(courseMap);
    // console.log(mappings);
}

async function updateCourseStats(){
    const courses = await db.collection('courses').get();
    let promises = [];
    courses.forEach(doc => promises.push(updateStats(db, doc) ));
    Promise.all(promises);
}

async function writeCourseReport(file, output){
    const mappings = await readCSV(file);
    const courses = await groupMappingsByCourse(mappings);

    const recs = Object.values(courses);

    // console.log(recs);
    writeCSV(output, recs, [
        {id:'course', title:'course'},
        {id:'title', title:'title'},
        {id:'topics', title:'topics'}
    ]);
}

// syncDBtoFile('./data/final-topics.csv').then(_=>console.log('done'));
// updateCourseStats().then(_=>console.log('done'));

// uploadDomains().then(()=>console.log('done'));
// updateCourseStats().then(()=>console.log('done'));
// backupData()
// getTopics();
// migrateTopicsToApp()

function saveToDoc(file, html){
    htmlToRtf.saveRtfInFile(file, htmlToRtf.convertHtmlToRtf(html))
}

async function writeReport(file){
    let body = ``;

    const recs = await readCSV(file);
    const topicMap = topicList.reduce((acc, cur)=>{
        acc[cur.topicId] = cur;
        return acc;
    }, {});

    for(let {course, title, topics} of recs){

        const topicsList = parseCourses(topics).reduce( (acc, cur)=>{ acc+=`\t\t\t\t<li>${cur} - ${topicMap[cur].topic }</li>\n`; return acc; }, '');

        body+=`
        <div style="page-break-after: always">
            <h1 style="font-size: x-large;font-weight: bold;">${course} - ${title}</h1>

            <h2 style="font-size: 32pt;font-weight: 700;">Content</h2>
            
            <h2 style="font-size: 26pt;font-weight: 700;">Learning Outcomes</h2>
            <ol>
                <li>Outcome</li>
            </ol>

            <h2 style="font-size: 26pt;font-weight: 700;">Assessments</h2>

            <h2 style="font-size: 26pt;font-weight: 700;">Topics</h2>

            <ol>
                ${topicsList}
            </ol>

            <h2 style="font-size: 26pt;font-weight: 700;">Calendar</h2>


        </div>
        `;
    }

    // let html = `<!DOCTYPE html>
    // <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>DCIT COurses</title>
    //     </head>
    //     <body>
    //         ${body}
    //     </body>
    // </html>`;

    // const html = createHTML({
    //     title: 'DCIT Courses',
    //     lang: 'en',
    //     head: '<meta name="description" content="example">',
    //     body
    // })

    // return fs.writeFileSync('./output/report.html', html);
        
    saveToDoc('./output/report.rtf', body);
}

// writeCourseReport('./data/final-topics.csv', './output/course-topics.csv').then(_=>{console.log('done')});
writeReport('./output/course-topics.csv').then(_=>{console.log('done')});