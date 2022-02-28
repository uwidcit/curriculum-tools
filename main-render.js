const { render } = require('./render');
const {writeJSON} = require('./util');


async function main(){
    const res = await render('./data/cs.pdf');
    //writeJSON('data/parsed-topics.json', res);
    console.log(res);
}

main().catch(console.error);
