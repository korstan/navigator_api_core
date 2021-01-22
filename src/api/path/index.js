const Router = require('@koa/router');

const BASE_PATH = '/api/path';
const router = new Router({prefix: BASE_PATH});

const Query = {
  Locations: require('../../db/queries/locations'),
}


router.get('/', async (ctx, next) => {
  try {
    if(!ctx.request.query.from || !ctx.request.query.to) {
      ctx.status = 400;
      throw '400 BAD REQUEST';
    }
    ctx.status = 200;
    ctx.body = [
      {x: 69, y: 123},
      {x: 69, y: 43},
      {x: 404, y: 43},
      {x: 404, y: 98},
      {x: 438, y: 98},
    ];
    await next();
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
