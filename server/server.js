import koa from 'koa';
import logger from 'koa-logger';
import koaRouter from 'koa-router';
import mount from 'koa-mount';
import serve from 'koa-static';
import send from 'koa-send';
// noinspection JSFileReferences
import indexTemplate from './templates/index'; // eslint-disable-line import/no-unresolved
import stationInfo from './station-info';


const router = koaRouter();

const app = koa();

app.use(logger());

function serveBuilt(x) {
  return koa().use(serve(`../public/${x}`));
}

app.use(mount('/js', serveBuilt('js')));
app.use(mount('/css', serveBuilt('css')));
app.use(mount('/imgs', serveBuilt('imgs')));
app.use(mount('/gtfs-data', serveBuilt('gtfs-data')));

router.get('/', function* root() {
  this.body = indexTemplate({
    scripts: '<script src="/js/main.js" defer></script>',
    content: stationInfo.routesHtml,
  });
});

function singleFile(file) {
  return function* singleFileGenerator() {
    yield send(this, file, { root: '../public' });
  };
}

router.get('/manifest.json', singleFile('manifest.json'));
router.get('/sw.js', singleFile('sw.js'));
router.get('/sw.js.map', singleFile('sw.js.map'));

app
  .use(router.routes())
  .use(router.allowedMethods());

const start = options => app.listen(options.port);

export default {
  start,
};
