const { readCSV, writeCSV, readJSON, writeJSON} = require('./util');

const domains = require('./data/CSdomains.json');
const subdomains = require('./data/CSsubdomains.json');
const topics = require('./data/parsed-topics.json');

const fs = require('fs');

function getDomainId(domain){
    for(let [key, value] of Object.entries(domains)){
        if(value.includes(domain.replace(',', '')))
            return key
    }
    throw `Domain ${domain} not found`;
}

function getSubDomainId(subdomain){
    for(let [key, value] of Object.entries(subdomains)){
        if(value.replace(',', '').includes(subdomain.trim()) )
            return key
    }
    throw `Subdomain "${subdomain}" not found`;
}

async function main(){
    const data = await readCSV('./data/topics.csv');
  
    let topicKey;

    for(let topic of data){
        topickey = Object.keys(topic)[0];
        let domainId = getDomainId(topic.domain);
        let subdomainId = getSubDomainId(topic.subdomain);
        console.log(topic.subdomain, subdomainId);
        // let offset = topic[topickey].split('-')[2];
        // let suboffset = topic[topickey].split('-')[1];
        
        // let domainId;

        // for(let [curId, domain] of Object.entries(csdomains)){
        //     if (domain == topic.domain)
        //         domainId = curId;
        // }
   
        // const subdomainId = `${domainId}-${suboffset}`;
        // topic['topicId'] = `${subdomainId}-${offset}`;
        // topic['subdomainId'] = `${subdomainId}`;
        if(!topic.domain)
            throw `topic domain not defined for ${topic[topicKey]}`;
       
    }

    // await writeCSV('./output/fixedtopics.csv', data, [
    //     {id:'topicId', title:'topicId'},
    //     {id:'topic', title:'topic'},
    //     {id:'domainId', title:'domainId'},
    //     {id:'subdomain', title:'subdomain'},
    //     {id:'subdomainId', title:'subdomainId'},
    //     {id:'domain', title:'domain'},
    //     {id:'Tier', title:'tier'},
    //     {id:'CS Courses', title:'courses'}
    // ]);

}

async function createTopicsNestedJSON(){
    const data = await readCSV('./output/fixedtopics.csv');
    let module = {
        'AL':{},
        'AR':{},
        'CN':{},
        'DS':{},
        'GV':{},
        'HCI':{},
        'IAS':{},
        'IM':{},
        'IS':{},
        'NC':{},
        'OS':{},
        'PD':{},
        'PBD':{},
        'PL':{},
        'SP':{},
        'SDF':{},
        'SE':{},
        'SF':{}
    };

    for(let topicRec of data){
        let {domainId, subdomainId, tier, topic, topicId} = topicRec;
        module[domainId][subdomainId] ??= [];
        module[domainId][subdomainId].push({
            tier,
            topic,
            topicId
        });
    }

    await fs.writeFileSync('./data/cstopics-nested.json', JSON.stringify(module, null, 2));


}

async function createTopicsJSON(){
    const data = await readCSV('./output/fixedtopics.csv');
     
    let res = {};

    for(let topicRec of data){
        let {domainId, domain, subdomain, subdomainId, tier, topic, topicId} = topicRec;

        res[topicId] = {
            domain,
            domainId,
            subdomain,
            subdomainId,
            topic,
            tier
        };
    }

    await fs.writeFileSync('./data/cstopics.json', JSON.stringify(res, null, 2));


}

async function createModule(){
    const domains = await readCSV('./data/CSsubdomains.csv');
    const res = {};

    console.log(domains);

    for(let domain of domains){
        res[domain.subdomainId] = domain.subdomain;
    }

    writeJSON('data/CSsubdomains.json', res);

}

async function createNestedTopics(){
    let res = {
        'AL':{},
        'AR':{},
        'CN':{},
        'DS':{},
        'GV':{},
        'HCI':{},
        'IAS':{},
        'IM':{},
        'IS':{},
        'NC':{},
        'OS':{},
        'PD':{},
        'PBD':{},
        'PL':{},
        'SP':{},
        'SDF':{},
        'SE':{},
        'SF':{}
    };;
    for(let topic of topics){
        let {domainId, subdomainId} = topic;
        res[domainId][subdomainId]??=[];
        res[domainId][subdomainId].push(topic);
    }

    writeJSON('./data/topics-nested.json', res);
}

async function fixTopics(){
    const topics = await readCSV('./data/fixedtopics.csv');
    let res = [];
    for(let topic of topics  ){
        // let offset = topic[Object.keys(topic)[0]].split('-')[2];
        if(!topic.domain)
            throw `Topic has undefined domain ${JSON.stringify(topic)}`;
        // const domainId = getDomainId(topic.domain);
        // const subdomainId = getSubDomainId(topic.subdomain.trim());
        // console.log(domainId, subdomainId, offset);
        console.log(topic.domain)
    }
    // writeJSON('./data/topics.json', topics);
}

// fixTopics().catch(console.error);

// main().catch(console.error);

createNestedTopics();