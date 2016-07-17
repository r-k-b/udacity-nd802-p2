const gulp = require('gulp');
const runSequence = require('run-sequence');
const plugins = require('gulp-load-plugins')(); // todo: remove this, replace with explicit imports
const handlebars = require('handlebars');
const del = require('del');
const merge = require('ramda').merge;
const mergeStream = require('merge-stream');
const through = require('through2');
const hbsfy = require('hbsfy');
const watchify = require('watchify');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');


function createBundle(srcIn) {
  const src = (!srcIn.push) ? [srcIn] : srcIn;

  const customOpts = {
    entries: src,
    debug: true,
  };

  const opts = merge(watchify.args, customOpts);
  const b = watchify(browserify(opts));

  b.transform(babelify.configure({}));

  b.transform(hbsfy);
  b.on('log', plugins.util.log); // `bind` not required, like in `bundle()`?
  return b;
}


const jsBundles = {
  // 'js/polyfills/promise.js': createBundle('./public/js/polyfills/promise.js'),
  // 'js/polyfills/url.js': createBundle('./public/js/polyfills/url.js'),
  'js/main.js': createBundle('./public/js/main/index.js'),
  'sw.js': createBundle('./public/js/sw/index.js'),
};


gulp.task('clean', done =>
  del(['build'], done)
);


gulp.task('css', () =>
  gulp.src('public/scss/*.scss')
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({ outputStyle: 'compressed' }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('build/public/css/'))
);


function bundle(b, outputPath) {
  const splitPath = outputPath.split('/');
  const outputFile = splitPath[splitPath.length - 1];
  const outputDir = splitPath.slice(0, -1).join('/');

  return b.bundle()
  // log errors if they happen
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))

    .pipe(source(outputFile))

    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())

    // optional, remove if you dont want sourcemaps
    .pipe(plugins.sourcemaps.init({ loadMaps: true })) // loads map from browserify file

    // Add transformation tasks to the pipeline here.
    .pipe(plugins.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(`build/public/${outputDir}`));
}


gulp.task('copy', () =>
  mergeStream(
    gulp.src('public/imgs/**/*')
      .pipe(gulp.dest('build/public/imgs/')),
    gulp.src('public/*.json')
      .pipe(gulp.dest('build/public/')),
    gulp.src('public/gtfs-data/*')
      .pipe(gulp.dest('build/public/gtfs-data/'))
  )
);

const createBundleFromKey = key => bundle(jsBundles[key], key);

gulp.task('js:browser', () =>
  mergeStream(...Object.keys(jsBundles).map(createBundleFromKey))
);


gulp.task('templates:server', () =>
  gulp.src('templates/*.hbs')
    .pipe(plugins.handlebars({ handlebars }))
    .on('error', plugins.util.log.bind(plugins.util))
    .pipe(through.obj((file, enc, callback) => {
      // Don't want the whole lib
      const fileOut = file;
      fileOut.defineModuleOptions.require = { Handlebars: 'handlebars/runtime' };
      callback(null, fileOut);
    }))
    .pipe(plugins.defineModule('commonjs'))
    .pipe(plugins.rename(path => {
      const pathOut = path;
      pathOut.extname = '.js';
      return pathOut;
    }))
    .pipe(gulp.dest('build/server/templates'))
);


gulp.task('js:server', () =>
  gulp.src('server/**/*.js')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({}))
    .on('error', plugins.util.log.bind(plugins.util))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('build/server'))
);


gulp.task('server', () => {
  // strip unwanted args:
  // [0] = `node` path
  // [1] = `gulp` path
  // [2] = `serve`
  const serverArgs = process.argv.slice(3);

  plugins.developServer.listen({
    path: './index.js',
    cwd: './build/server',
    args: serverArgs,
  });

  gulp.watch([
    'build/server/**/*.js',
  ], plugins.developServer.restart);
});


gulp.task('watch', () => {
  gulp.watch(
    ['public/scss/**/*.scss'],
    ['css']
  );
  gulp.watch(
    ['templates/*.hbs'],
    ['templates:server']
  );
  gulp.watch(
    ['server/**/*.js'],
    ['js:server']
  );
  gulp.watch(
    ['public/imgs/**/*', 'public/gtfs-data/**/*', 'server/*.txt', 'public/*.json'],
    ['copy']
  );

  Object.keys(jsBundles).forEach(key => {
    const b = jsBundles[key];
    b.on('update', () => bundle(b, key));
  });
});


gulp.task('serve', callback =>
  runSequence(
    'clean',
    ['css', 'js:browser', 'templates:server', 'js:server', 'copy'],
    ['server', 'watch'],
    callback
  )
);
