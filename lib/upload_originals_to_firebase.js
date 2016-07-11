const fs = require('fs');
const path = require('path');
const debugAs = require('debug');
const Task = require('data.task');
const controlAsync = require('control.async');
const Maybe = require('data.maybe');
const firebase = require('firebase');
const untildify = require('untildify');
const Either = require('data.either');
const { futurize } = require('futurize');
const { filter, curry, join, init, split, map, chain, compose, sequence } = require('ramda');

const debug = debugAs('uploadToFirebase');

require('dotenv').config();

const future = futurize(Task);
const async = controlAsync(Task);
const just = Maybe.Just;

firebase.initializeApp({
  serviceAccount: untildify('~/udacity-nd802-p2-2ba8de8a0c06.json'),
  databaseURL: 'https://udacity-nd802-p2-1deb9.firebaseio.com',
});

const db = firebase.database();
const dbRef = db.ref('gtfs/greater_nsw/original');

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

/**
 * sansExtension :: String → String
 * E.g.: `foo.bar.json` → `foo.bar`
 */
const sansExtension = compose(
  join('.'),
  init,
  split('.')
);

// readFile :: String → Task(error, string)
const readFile = future(fs.readFile);

// writeFile :: String → Task(error, string)
// const writeFile = future(fs.writeFile);

// readdir :: String → Task(error, string)
const readdir = future(fs.readdir);

// stat :: String → Task(error, string)
const stat = future(fs.stat);

// onlyFiles :: String filePath → Array(String fileName) → Task(γ, Array(String fileName))
const onlyFiles = curry((filePath, fileNames) => {
  // todo: use `getPath()` for join
  const justFiles = map(
    fileName => stat(`${filePath}/${fileName}`).map(stats => (stats.isFile() ? fileName : false)),
    fileNames
  );

  return async.parallel(justFiles).map(filter(x => !!x));
});


// getFilePaths :: m(string) → Task(Array(`[shortName, path]` tuples))
// (e.g., `['foo', '/baz/bar/foo.json']`)
const getFilePaths = compose(
  map(
    ([inputPath, filenames]) => map(
      filename => [sansExtension(filename), `${inputPath}${filename}`],
      filenames
    )
  ),
  chain(
    ([inputPath]) => sequence(
      Task.of,
      [just(inputPath), readdir(inputPath).chain(onlyFiles(inputPath))]
    )
  ),
  sequence(Task.of)
);

const filePaths = getFilePaths([getPath(sourcesPath)]);


// eslint-disable-next-line max-len
// getFilesData :: Task(Array([string shortName, string filePath])) → Task(Array([string shortName, object fileData]))
const getFilesData = compose(
  chain(async.parallel),
  map(map(([shortName, filePath]) =>
    readFile(filePath)
    // todo: handle parse failure?
      .map(JSON.parse)
      .map(data => [shortName, data])
  ))
);

const filesData = getFilesData(filePaths);

const uploadFile = ([name, data]) => async.fromPromise(
  dbRef.child(name).set(data)
);

// ↑  pure  ↑
// ↓ impure ↓

filesData.fork(
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
