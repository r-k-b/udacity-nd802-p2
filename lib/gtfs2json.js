const csv2json = require('csv2json');
const fs = require('fs');
const singleLineLog = require('single-line-log');


const filePaths = {
  in: '../gtfs/greater-nsw/agency.txt',
  out: '../gtfs/stop_times.json',
};

const streamIn = fs.createReadStream(filePaths.in);
const streamOut = fs.createWriteStream(filePaths.out);

var c = 0;
const log = singleLineLog.stdout;

streamIn.on('data', data => {
  log(`Read chunk: #${c++}`);
});

console.log('Starting csv2json stream...');

const diff = process.hrtime();

streamOut.on('finish', () => {
  log.clear();
  console.log(`\nFinished stream. Took ${diff[0] * 1e9 + diff[1]} ns.`);
});


streamIn
  .pipe(csv2json({
    // Defaults to comma.
    separator: ',',
  }))
  .pipe(streamOut);
