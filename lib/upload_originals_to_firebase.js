const fs = require('fs');
const path = require('path');
const firebase = require('firebase');
const { futurize } = require('futurize');
const Either = require('data.either');
const Task = require('data.task');
const { __, apply, concat, map, compose, chain, liftN, transpose, sequence } = require('ramda');

const future = futurize(Task);

require('dotenv').config();

const fbConfig = {
  apiKey: process.env.FIREBASEAPIKEY,
  authDomain: 'udacity-nd802-p2-1deb9.firebaseapp.com',
  databaseURL: 'https://udacity-nd802-p2-1deb9.firebaseio.com',
  storageBucket: 'udacity-nd802-p2-1deb9.appspot.com',
};

firebase.initializeApp(fbConfig);

const sourcesPath = ['..', 'gtfs', 'greater_nsw', 'json'];


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
const getPath = filePath =>
  tryFunction(path.join.bind(path))(...filePath);


const eitherToTask = either => {

};


// readFile :: String → Task(error, string)
const readFile = future(fs.readFile);

// writeFile :: String → Task(error, string)
const writeFile = future(fs.writeFile);

// readdir :: String → Task(error, string)
const readdir = future(fs.readdir);

const filenames = sequence(Task.of, [getPath(sourcesPath)])
  .chain(([path]) => readdir(path));


filenames.fork(
  err => console.warn({ err }),
  data => console.log({ data })
);
