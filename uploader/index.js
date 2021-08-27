const csv = require('csv-parser');
const { readFileSync, writeFileSync, createReadStream } = require('fs');

const domains = {
    'AL':'Algorithms and Complexity',
    'AR':'Architecture and Organization',
    'CN':'Computational Science',
    'DS':'Discrete Structures',
    'GV':'Graphics and Visualization',
    'HCI':'Human-Computer Interaction',
    'IAS':'Information Assurance and Security',
    'IM':'Information Management',
    'IS':'Intelligent Systems',
    'NC':'Net Centric Computing',
    'OS':'Operating System',
    'PBD':'Parallel and Distributed Computing',
    'PD':'Platform-based Development',
    'PL':'Programming Languages',
    'SP':'Social Issues and Professional Practice',
    'SDF':'Software Development Fundamentals',
    'SE':'Software Engineering',
    'SF':'System Fundamentals'
};


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


async function writeFile(data, name){
    await writeFileSync(name, JSON.stringify(data, null, 2));
 }

async function dumpTopics(){
    const data = await readCSV('topics.csv');
    const result = {
        'AL': {},
        'AR': {},
        'CN': {},
        'DS': {},
        'GV': {},
        'HCI':{},
        'IAS':{},
        'IM': {},
        'IS': {},
        'NC': {},
        'OS': {},
        'PBD': {},
        'PD': {},
        'PL': {},
        'SP': {},
        'SDF':{},
        'SE': {},
        'SF': {}
    };

    for(let rec of data){
        let {domainId, subdomainId, topic} = rec;
        let topicId = rec[Object.keys(rec)[0]];
        if(! domainId in result )
            throw `${domainId} not found!`
        
        if(!result[domainId][subdomainId]){
            result[domainId][subdomainId] = [ { topicId, topic } ]; 
        }else{
            result[domainId][subdomainId].push({ topicId, topic });
        }
    }

    writeFile(result);
}

async function dumpSubdomains(){
	const data = await readCSV('topics.csv');
	let result = {};
	for(let { subdomainId, subdomain  } of data){
		result[subdomainId] = subdomain;
	}
	writeFile(result, 'subdomains.json')
}
dumpSubdomains();