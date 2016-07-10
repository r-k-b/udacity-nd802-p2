const fs = require('fs');
const path = require('path');
const debugAs = require('debug');
const Task = require('data.task');
const Maybe = require('data.maybe');
const firebase = require('firebase');
const Either = require('data.either');
const { futurize } = require('futurize');
const { map, chain, compose, sequence } = require('ramda');

const debug = debugAs('uploadToFirebase');

require('dotenv').config();

const future = futurize(Task);
const just = Maybe.Just;

const fbConfig = {
  apiKey: process.env.FIREBASEAPIKEY,
  authDomain: 'udacity-nd802-p2-1deb9.firebaseapp.com',
  databaseURL: 'https://udacity-nd802-p2-1deb9.firebaseio.com',
  storageBucket: 'udacity-nd802-p2-1deb9.appspot.com',
};

firebase.initializeApp(fbConfig);

const sourcesPath = [__dirname, '..', 'gtfs', 'greater-nsw', 'json', '/'];

// tryFunction :: Function → ...a → Either(error, b)
// (how to write variadic type sig?)
const tryFunction = f => (...args) => {
  try {
    return Either.Right(f(...args)); // eslint-disable-line new-cap
  } catch (e) {
    return Either.Left(e); // eslint-disable-line new-cap
  }
};

// getPath :: String[] → String → Either(error, string)
const getPath = filePath =>
  tryFunction(path.join.bind(path))(...filePath);


// readFile :: String → Task(error, string)
// const readFile = future(fs.readFile);

// writeFile :: String → Task(error, string)
// const writeFile = future(fs.writeFile);

// readdir :: String → Task(error, string)
const readdir = future(fs.readdir);

const filePaths = compose(
  map(
    ([inputPath, filenames]) => map(filename => `${inputPath}${filename}`, filenames)
  ),
  chain(
    ([inputPath]) => sequence(Task.of, [just(inputPath), readdir(inputPath)])
  ),
  sequence(Task.of)
)([getPath(sourcesPath)]);


// ↑  pure  ↑
// ↓ impure ↓

filePaths.fork(
  err => {
    // eslint-disable-next-line no-console
    console.warn(`Upload of JSON files to firebase failed! ${err.toString()}`);
    debug({ err });
  },
  data => {
    // eslint-disable-next-line no-console
    console.log('Upload of JSON files to firebase succeeded.');
    debug(data);
  }
);
