const { render } = require('./render');
const fs = require('fs')

const {writeJSON} = require('./util');



async function main(){
    

    const res = await render();
    //writeJSON('data/parsed-topics.json', res);
    //console.log(res);
    try {
        fs.writeFileSync('./render_output/table.txt', res)
        //file written successfully
    } catch (err) {
        console.error(err)
    }
    
}

main().catch(console.error);
