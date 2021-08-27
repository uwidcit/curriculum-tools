const {getStats} = require('./stats.js');
const { writeCSV } = require("../util.js");


async function main(){

    const stats = await getStats();
    
    await writeCSV('./stats.csv', stats, [
        { id:'lecturer', title:'Lecturer' },
        { id:'course', title:'Course Code' },
        { id:'numTopics', title:'Number of Topics' },
    ]);
}

main();