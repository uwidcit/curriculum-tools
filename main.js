const fs = require('fs');

const {parse} = require('./parser');

async function main(){
    const file = await fs.readFileSync('it-topics.pdf');
    const text = await parse(file, 'IT');
    await fs.writeFileSync('it-output.json', JSON.stringify(text, null, 2));
    console.log('dumped');
}   


main();