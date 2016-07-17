const fs = require('fs');
const debugAs = require('debug');
const mysql = require('promise-mysql');

require('dotenv').config();

const debug = debugAs('mysql2json');

const connProm = mysql.createConnection({
  host: '172.17.0.2',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PW,
  database: 'gtfs1',
});

const queryProm = connProm.then(
  conn => conn.query('select * from stops__train_stations')
).then(
  rows => {
    debug(`Writing ${rows.length} rows to JSON...`);
    return new Promise((resolve, reject) =>
      fs.writeFile('./stations.json', JSON.stringify(rows), (err, success) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(success);
      })
    );
  }
)
  .then(() => debug('File written.'))
  .catch(err => debug('File not written!', err));

Promise.all([connProm, queryProm])
  .then(([cP]) => {
    debug('Closing DB connection.');
    return cP.end();
  });
