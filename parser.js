const PDFParser = require("pdf2json"); //https://www.npmjs.com/package/pdf2json
const decode = require("urldecode");
const subdomains = require("./subdomains.json");


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

const ITdomains = {
    "CSP": "Cybersecurity Principles",
    "GPP": "Global Professional Practice",
    "IMA": "Information Management",
    "IST": "Integrated Systems Technology",
    "NET": "Networking",
    "PFT": "Platform Technologies",
    "SPA": "System Paradigms",
    "SWF": "Software Fundamentals",
    "UXD": "User Experience Design",
    "WMS": "Web and Mobile Systems",
    "ANE": "Applied Networks",
    "CCO": "Cloud Computing",
    "CEC": "Cybersecurity Emerging Challenges",
    "DSA": "Data Scalability and Analytics",
    "IOT": "Internet of Things",
    "MAP": "Mobile Application",
    "SDM": "Software Development and Management",
    "SRE": "Social Responsibility",
    "VSS": "Virtual Systems and Services"
  };


const HEADINGSIZE = 18.04;
const TOPICSIZE1 = 12.96;
const TOPICSIZE2 = 14.04;
const TIERSIZE = 12.96;
const CATSIZE = 17.04;

function getTier(text){
    if(text.includes('[Elective]'))return 'Elective';
    if(text.includes('[Electives]'))return 'Elective';
    const tier1 = text.includes('Core-Tier1') || text.includes('C ore-Tier1');
    const tier2 = text.includes('Core-Tier2') || text.includes('C ore-Tier2');
    if(tier1 && tier2)return 'Both';
    if(tier1) return 'Tier 1';
    if(tier2) return 'Tier 2';
    return 'Both';
}

function getObj(text, run){
    return {
        y: text.y,
        x: text.x,
        text: decode(run["T"]).trim(),
        size: run["TS"][1],
        bold: run["TS"][2] === 1,
        italic: run["TS"][3] === 1
    };
}

function isITDomain(string){
    return ((string.startsWith("ITE") || string.startsWith("ITS")) && string.split('-').length === 2 )
}

function isITSubDomain(string){
    return ((string.startsWith("ITE") || string.startsWith("ITS")) && string.split('-').length === 3 )
}

function isITTopic(string){
    return !(string.startsWith("ITE") || string.startsWith("ITS"))
}

function getItDomain(string){
    let obj = {};
    obj['domainId'] = string.substring(4, 7);
    obj['domain'] = string.substring(4, 7) +' '+string.substring(7, string.length);
    obj['type'] = string.startsWith("ITE") ? "Essential" : "Supplementary";
    return obj;
}

function getITSubDomain(string){
    let obj = {};
    obj['subdomainId'] = string.substring(4, 10);
    obj['subdomain'] = string.substring(10, string.length);
    obj['domainId'] = string.substring(4, 7);
    obj['type'] = string.startsWith("ITE") ? "Essential" : "Supplementary";
    return obj;
}

function getITDomains(texts){
    return texts.filter(item=>isITDomain(item.text))
    .map(item=>{
        return getItDomain(item.text);
    }).reduce((acc, cur)=>{
        const key = Object.keys(cur)[0];
        acc[key] = cur[key];
        return acc;
    }, {});
}

/**
 * @description receives the location of a pdf file and returns a promise which resolves with the parsed json data 
 * @param {String} fileBuffer the file stored in memory 
 */
async function getPDFText(fileBuffer){
    let json = await new Promise((resolve, reject) => {
        let pdfParser = new PDFParser();
        pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfData));
        pdfParser.on("pdfParser_dataError", errData => reject(errData));
        pdfParser.parseBuffer(fileBuffer);
    });
    
    let pdfText = [];

    for(let page of json['formImage']['Pages']){
        for(let text of page['Texts']){
            const runs = text["R"].map(item => getObj(text, item));
            pdfText.push(runs[0]);
        }
    }

    let [prev, ...rest] = pdfText;
    let merged = [];

    for(let text of rest){
        if(text.y === prev.y){
            prev.text+=text.text;
        }else{
            merged.push(prev);
            prev=text;
        }

    }
    return merged;
}

function isSubdomain(text){
    if(text === undefined) return false;
    return text.size === HEADINGSIZE && text.text.includes('/');
}

function getSubDomainsIT(texts){
    const subDomains = [];
    let curDomain = null;
    let curDomainId = null;
    let curType = null;

    for(let text of texts){
        
        if(isITDomain(text.text)){
            const { type, domainId, domain} = getItDomain(text.text);
            curDomain = domain;
            curDomainId = domainId;
            curType = type;
        }

        if(isITSubDomain(text.text)){
            const { subdomainId, subdomain } = getITSubDomain(text.text);
          
            subDomains.push({
                domain: curDomain,
                domainId: curDomainId,
                subdomain,
                subdomainId,
                type: curType
            })
        }

        
    }
   
    return subDomains;
}

function getTopicsIT(texts){
  
    const topics = [];
    let curDomain = null;
    let curDomainId = null;
    let curSubDomain = null;
    let curSubDomainId = null;
    let curType = null;
    let topicCount = 1;
    let lastTopic = null;

    for(let text of texts){
        
        if(isITDomain(text.text)){
            const { type, domainId, domain} = getItDomain(text.text);
            curDomain = domain;
            curDomainId = domainId;
            curType = type;
        }

        if(isITSubDomain(text.text)){
            const { subdomainId, subdomain } = getITSubDomain(text.text);
            topicCount = 1;
            curSubDomain = subdomain;
            curSubDomainId = subdomainId;
        }

        if(text.size === 11.04){
            
            if(text.text.match(/^[a-n]{1}.*/)){
                topics.push({
                    domain: curDomain,
                    domainId: curDomainId,
                    subdomain: curSubDomain,
                    subdomainId: curSubDomainId,
                    domain: curDomain,
                    topicId: `${curSubDomainId}-${topicCount}`,
                    topic: text.text.substring(2, text.text.length),
                    type: curType
                });
                topicCount++;
            }else if(topics.length >0){
                // topics[topics.length].topic+=text.text;
                console.log(topics[topicCount-1], text.text)
            } 
        }

    }
   
    return topics;
}


function getTopicsCS(texts){
    const topics = [];
       
    let i = 0;
    let cursub = null;
    let subcounter = 0;


    while(i < texts.length){
        while(!isSubdomain(texts[i]))i++;
  
        cursub = texts[i];
        const [domainId, subdomain] = cursub.text.split('/');
        topics[cursub.text] = [];
        let counter = 1;
        subcounter++;

        i++;

        let tier="N/A";
        let breakdown = null;
        
        while(i < texts.length && !isSubdomain(texts[i]) ){

            if(texts[i].size === CATSIZE )
                breakdown = texts[i].text; 
            
            if(texts[i].size === TIERSIZE && texts[i].x > 4 && texts[i].x < 4.5){
                tier = getTier(texts[i].text)
                if(tier === "Both"){
                    console.log(texts[i].text);
                    tier = 'N/A';
                }
            }
                 
            if( texts[i].text[0] === "•" && i < texts.length && (texts[i].size === TOPICSIZE1 || texts[i].size === TOPICSIZE2 )){
                text = texts[i].text.replace("•", "");
                const subdomainId = `${domainId}-${subcounter.toString().padStart(2, '0')}`;
                const topicId = `${subdomainId}-${counter.toString().padStart(2, '0')}`;
                if(tier === "N/A")tier = getTier(breakdown);
                topics.push({
                    breakdown,
                    topic: text,
                    domainId,
                    domain: domains[domainId],
                    subdomain,
                    subdomainId,
                    topicId,
                    tier: tier,
                });
                counter++;
            }
            i++;
        }

    }

    return topics;
}

function getSubdomains(){
    const subs = [];
    for(let sub of subdomains){
        subs.push(`${sub.Code.split('-')[0]}/${sub.Subdomain}`);
    }
    return subs;
}


async function parse(file, prog){
    const text = await getPDFText(file);
    // return (prog === "CS") ? getTopicsCS(text) : getTopicsIT(text);
    return getSubDomainsIT(text);
    // return topics;
    // return getITDomains(text);
    // return text;
}


module.exports = {parse}