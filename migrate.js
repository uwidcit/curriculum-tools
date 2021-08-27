const { readCSV, writeCSV } = require("./util");


function addToTopic(topics, topicKey, courses){
    for(let topic of topics){
        const key = Object.keys(topic)[0];
        topic['topicId'] = topic[key];
        if(topic[key] === topicKey ){
            let arr = topic['CS Courses'].split(',');
            arr.concat(courses);
            topic['CS Courses'] = arr.join(',');
        }
    }

}


async function main(){
    const topics = await readCSV('./topics.csv');
    const mappings = await readCSV('./mappings.csv');
    let topicMap= await readCSV('./topicsMigration.csv');
    topicMap = topicMap.reduce( (acc, cur)=>{
        acc[cur['topicId']] = cur['New Topic'];
        return acc;
    }, {});

    const key = Object.keys(mappings[0])[0];
    
    for(let rec of mappings){
        let newTopic = topicMap[rec[key]];
        addToTopic(topics, newTopic, rec['CS Courses'].split(','));
    }

    await writeCSV('./mergedOutput.csv', topics, [
        { id:'topicId', title:'topicId' },
        { id:'topic', title:'topic' },
        { id:'domainId', title:'domainId' },
        { id:'domain', title:'domain' },
        { id:'subdomain', title:'subdomain' },
        { id:'subdomainId', title:'subdomainId' },
        { id:'Tier', title:'Tier' },
        { id:'CS Courses', title:'CS Courses' }
    ]);

}

main();