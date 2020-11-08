const Router = require('@koa/router');

const BASE_PATH = '/api/level';
const router = new Router({prefix: BASE_PATH});

const Query = {
  Locations: require('../../db/queries/locations'),
}


router.get('/', async (ctx, next) => {
  try {
    if(!ctx.request.query.buildingId) {
      ctx.status = 400;
      throw '400 BAD REQUEST';
    }
    const locations = await Query.Locations.getAllByBuildingId(ctx.request.query.buildingId);
    ctx.status = 200;
    ctx.body = locations;
    await next();
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
