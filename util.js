const { createReadStream, writeFileSync, readFileSync } = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;



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

function writeCSV(path, data, header){

    const csvWriter = createCsvWriter({
        path,
        header
    });

    csvWriter.writeRecords(data);
}

function writeJSON(path, data){
    return writeFileSync(path, JSON.stringify(data, null, 2));
}

async function readJSON(path){
    const text = readFileSync(path, {encoding:'utf8', flag:'r'});
    return JSON.parse(text);
}


module.exports = {
    readCSV,
    writeCSV,
    writeJSON,
    readJSON
}