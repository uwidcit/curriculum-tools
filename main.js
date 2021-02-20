const fs = require('fs');

const {parse} = require('./parser');

async function main(){
    const file = await fs.readFileSync('file.pdf');
    const text = await parse(file);
    await fs.writeFileSync('output.json', JSON.stringify(text, null, 2));
    console.log('dumped');
}   


main();