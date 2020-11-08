const Koa = require('koa');
const logger = require('koa-logger')
const Router = require('@koa/router');
const ApplicationRouter = require ('./src/api/router.js');
const config = require('./src/config');

const app = new Koa();
const rootRouter = new Router();

rootRouter.get('/', async (ctx) => {
  ctx.body = 'Hello, World!\n';
});

app.use(rootRouter.routes());
ApplicationRouter(app);

app.use(logger());
// Слушаем порт, запускаем сервер
app.listen(config.PORT, () => {
  console.log(`Server running on port http://${config.HOST}:${config.PORT}`);
});
