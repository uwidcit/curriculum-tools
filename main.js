const { parse } = require('./parser');
const {writeJSON} = require('./util');


async function main(){
    const res = await parse('./data/cs.pdf');
    writeJSON('data/parsed-topics.json', res);
}

main().catch(console.error);
