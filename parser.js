const PDFParser = require("pdf2json"); //https://www.npmjs.com/package/pdf2json
const decode = require("urldecode");
const subdomains = require("./data/CSsubdomains.json");
const domains = require("./data/CSdomains.json");
const { createReadStream, writeFileSync, readFileSync } = require('fs');

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

function getTopicsCS(texts){
    const topics = [];
       
    let i = 0;
    let cursub = null;
    let lastsub = null;
    let subcounter = 0;
    let curdomain = null;
    let lastdomain = null;


    while(i < texts.length){
        while(!isSubdomain(texts[i]))i++;
        
        lastsub = cursub;
        cursub = texts[i];
     
        const [domainId, subdomain] = cursub.text.split('/');
        lastdomain = curdomain;
        curdomain = domainId;

        if(lastdomain !== curdomain)
            subcounter = 0;

        topics[cursub.text] = [];
        let counter = 1;

        if(lastsub !== cursub)
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
                    // console.log(texts[i].text);
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
                    subdomain: subdomain.trim(),
                    subdomainId,
                    topicId,
                    tier: tier,
                });

                console.log(topicId, domains[domainId], subdomain);
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


async function parse(file){
    const buffer = await readFileSync(file);
    const text = await getPDFText(buffer);
    return getTopicsCS(text)
}


module.exports = {parse}