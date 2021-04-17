const fs = require('fs').promises;
const { readFileSync, writeFileSync, createReadStream } = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let topics = require('./output.json');


function readCSV(path){
    return new Promise((resolve)=>{
      const results = [];
  
      createReadStream(path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results);
        });
  
    });
}

async function writeFile(data){
   await writeFileSync('report.json', JSON.stringify(data, null, 2));
}

function getSubDomain(code){
    const [domain, num, ...rest] = code.split('-');
    return domain+'-'+num;
}


function getTopicMap(){
    return topics.reduce((acc, cur) => {
        const { topicId } = cur;
        acc[topicId] = cur; 
        return acc 
    }, {})
}

function formatSubDomainsNested(data){
    let report = {};
    topics = getTopicMap();
    for(let rec of data){
        if(rec['CS Topics'] !== ''){
            let topicList = rec['CS Topics'].split(',');
            let code = rec[Object.keys(rec)[0]];
            for (let topic of topicList){
                const { tier, subdomainId } = topics[topic];
                if( ! (subdomainId in report)){
                    report[subdomainId] = {};
                    report[subdomainId][code] = {};
                    report[subdomainId][code][tier] = 1;
                }else{
                    if( !(code in report[subdomainId])){
                        report[subdomainId][code] = {}
                    }else if( tier in report[subdomainId][code] ){
                        report[subdomainId][code][tier]++;
                    }else {
                        report[subdomainId][code][tier] = 1;
                    }
                }
            }
        }
    }
    return report;
}

function formatSubDomainsTable(data){
    let report = {};
    topics = getTopicMap();
    for(let rec of data){
        if(rec['CS Topics'] !== ''){
            let topicList = rec['CS Topics'].split(',');
            let code = rec[Object.keys(rec)[0]];
            for (let topic of topicList){
                const { tier, subdomainId } = topics[topic];
                if( ! (subdomainId in report)){
                    report[subdomainId] = {};
                    report[subdomainId][`${code}-${tier}`] = 1;
                }else{
                    if( !(`${code}-${tier}` in report[subdomainId])){
                        report[subdomainId][`${code}-${tier}`] = 1
                    }else {
                        report[subdomainId][`${code}-${tier}`]++;
                    }
                }
            }
        }
    }
    return report;
}

//generate report similar to page 495 of cs doc
async function main(){
    const data = await readCSV('courses.csv');
    let report = formatSubDomainsTable(data);
    await writeFile(report);
    console.log('done');
}

main();