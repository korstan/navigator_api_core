const Router = require('@koa/router');

const BASE_PATH = '/api/building'
const router = new Router({prefix: BASE_PATH});

const Query = {
  Buildings: require('../../db/queries/buildings'),
}


router.get('/all', async (ctx, next) => {
  try {
    const buildings = await Query.Buildings.getAll();
    ctx.status = 200;
    ctx.body = buildings;
    await next();
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
