const { createReadStream } = require('fs');
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



module.exports = {
    readCSV,
    writeCSV
}