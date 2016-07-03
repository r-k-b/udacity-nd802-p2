const koa = require('koa');
const app = koa();

app.use(function* helloBody() {
  this.body = 'Hello World';
});

app.listen(3000);