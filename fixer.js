const { readCSV, writeCSV} = require('./util');
const { csdomains } = require('./data/csmodule'); 
const fs = require('fs');

async function main(){
    const data = await readCSV('./input/topics.csv');
  
    let topicKey;

    for(let topic of data){
        topickey = Object.keys(topic)[0];
        let offset = topic[topickey].split('-')[2];
        let suboffset = topic[topickey].split('-')[1];
        
        let domainId;

        for(let [curId, domain] of Object.entries(csdomains)){
            if (domain == topic.domain)
                domainId = curId;
        }
   
        const subdomainId = `${domainId}-${suboffset}`;
        topic['topicId'] = `${subdomainId}-${offset}`;
        topic['subdomainId'] = `${subdomainId}`;
    }

    await writeCSV('./output/fixedtopics.csv', data, [
        {id:'topicId', title:'topicId'},
        {id:'topic', title:'topic'},
        {id:'domainId', title:'domainId'},
        {id:'subdomain', title:'subdomain'},
        {id:'subdomainId', title:'subdomainId'},
        {id:'domain', title:'domain'},
        {id:'Tier', title:'tier'},
        {id:'CS Courses', title:'courses'}
    ]);

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



// createTopicsNestedJSON();
createTopicsJSON();