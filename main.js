const fs = require('fs');

const { parse } = require('./parser');
const { readCSV, writeCSV } = require('./util');

async function main(){
    const file = await fs.readFileSync('it-topics.pdf');
    const data = await parse(file, 'IT');
    // await fs.writeFileSync('it-output.json', JSON.stringify(text, null, 2));
    await writeCSV('newITtopics.csv', data, [
        {id:'topicId', title:'topicId'},
        {id:'topic', title:'topic'},
        {id:'domainId', title:'domainId'},
        {id:'subdomain', title:'subdomain'},
        {id:'subdomainId', title:'subdomainId'},
        {id:'domain', title:'domain'},
        {id:'type', title:'type'}
    ]);

    console.log('dumped');
}   


async function correctIDs(){
    const data = await readCSV('./cstopics.csv');
   
    let subcount = 0;
    let lastDomain = null;

    for(let topic of data){
        const key = Object.keys(topic)[0];
        let topicId = topic[key];

        let domain = topicId.substring(0, 2);
        let topicNum = topicId.split('-')[2];

        if(lastDomain != domain){
            subcount = 0;
            lastDomain = domain;
        }


        if(topicNum === '01'){
            subcount++;
        }

        const subdomainId = (subcount+"").padStart(2, "0");


        topicId = `${domain}-${subdomainId}-${topicNum}`;
        topic[key] = topicId;
        topic['topicId']= topicId;
        topic['subdomainId'] = domain+'-'+subdomainId;
    }

    await writeCSV('newtopics.csv', data, [
        {id:'topicId', title:'topicId'},
        {id:'topic', title:'topic'},
        {id:'domainId', title:'domainId'},
        {id:'domain', title:'domain'},
        {id:'subdomain', title:'subdomain'},
        {id:'subdomainId', title:'subdomainId'},
        {id:'Tier', title:'Tier'},
        {id:'CS Courses', title:'CS Courses'}
    ]);
    console.log('done');
}

main();

// correctIDs();