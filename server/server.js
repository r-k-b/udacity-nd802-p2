import koa from 'koa';

const app = koa();

app.use(function* helloBody() {
  this.body = 'Hello World';
});

const start = options => app.listen(options.port);

export default {
  start,
};
