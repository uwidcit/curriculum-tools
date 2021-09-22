

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
    obj['domain'] = string.substring(7, string.length);
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
    let newTopic = null;

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
                newTopic = {
                    domain: curDomain,
                    domainId: curDomainId,
                    subdomain: curSubDomain,
                    subdomainId: curSubDomainId,
                    domain: curDomain,
                    topicId: `${curSubDomainId}-${(topicCount+"").padStart(2, '0')}`,
                    topic: text.text.substring(2, text.text.length),
                    type: curType
                };
                topics.push(newTopic);
                lastTopic = newTopic;
                topicCount++;
            }else if(topics.length >0 && !text.text.startsWith("IT")){
                // topics[topics.length].topic+=text.text;
                lastTopic.topic+= " "+text.text;
            } 
        }

    }
   
    return topics;
}