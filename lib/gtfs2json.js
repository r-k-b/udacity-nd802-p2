const csv2json = require('csv2json');
const fs = require('fs');
const path = require('path');
const { __, apply, concat, map, compose, chain, liftN, transpose } = require('ramda');
const Either = require('data.either');

const gtfsPath = ['..', 'gtfs', 'greater-nsw'];
const outputPath = ['..', 'gtfs', 'greater-nsw', 'json'];

// tryFunction :: Function → ...a → Either(error, b)
// (how to write variadic type sig?)
const tryFunction = f => (...args) => {
  try {
    return Either.Right(f(...args));
  } catch (e) {
    return Either.Left(e);
  }
};

// getPath :: String[] → String → Either(error, string)
const getPath = filePath => fileName =>
  tryFunction(path.join.bind(path))(...filePath, fileName);


// nameToReadStream :: String → Either(error, stream)
const nameToReadStream = filePath =>
  tryFunction(fs.createReadStream.bind(fs), e => console.warn(e))(filePath);

// nameToWriteStream :: String → Either(error, stream)
const nameToWriteStream = filePath =>
  tryFunction(fs.createWriteStream.bind(fs), e => console.warn(e))(filePath);


// streamToJson :: (string → Either(error, readableStream) → Either(error, writeableStream)) → Either(error, void)
// ...OR?...
// streamToJson :: (string → readableStream → writeableStream) → Either(error, void)
const streamToJson = (fileName, streamIn, streamOut) => {
  console.log(`Starting csv2json stream for '${fileName}'...`);
  const diff1 = process.hrtime();

  try {
    streamOut.on('finish', () => {
      const diff2 = process.hrtime(diff1);
      console.log(`\nFinished stream for '${fileName}'. Took ${diff2[0] * 1e9 + diff2[1]} ns.`);
    });

    return Either.Right(
      streamIn
        .pipe(csv2json({ separator: ',' }))
        .pipe(streamOut)
    );
  } catch (e) {
    return Either.Left(e);
  }
};

const fileNames = [
  // 'NOPE',
  'agency',
  'calendar',
  'routes',
  'calendar_dates',
  'stops',
  'trips',
  'shapes',
  'stop_times',
];

// Array(Either(error, readableStream))
const streamsIn = fileNames.map(compose(
  chain(nameToReadStream),
  map(concat(__, '.txt')),
  getPath(gtfsPath)
));

// Array(Either(error, writableStream))
const streamsOut = fileNames.map(compose(
  chain(nameToWriteStream),
  map(concat(__, '.json')),
  getPath(outputPath)
));

// why do we get nested `Either`s back from this (in `x`)?
// todo: complete the analogy; map:chain :: lift:___
const streamsToJson = liftN(3, streamToJson);

const streamTriplets = transpose([map(x => Either.of(x), fileNames), streamsIn, streamsOut]);

const x = map(apply(streamsToJson), streamTriplets);

console.log(x);
