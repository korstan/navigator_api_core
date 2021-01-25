const Router = require('@koa/router');
const _ = require('lodash');

const BASE_PATH = '/api/path';
const router = new Router({prefix: BASE_PATH});

const Query = {
  Locations: require('../../db/queries/locations'),
  PathPoints: require('../../db/queries/pathPoints'),
}

const CheckoutNeighbor = function(pathHistory, pointToHandle, destinationPointId, allPoints) {
  let newPathHistory = {...pathHistory, [pointToHandle.id]: pointToHandle};
  if(pointToHandle.id == destinationPointId) return newPathHistory;
  let unvisitedNeighbors = pointToHandle.links.filter(n => !pathHistory[n]);
  if(!unvisitedNeighbors.length) return false;
  for(let neighbor of unvisitedNeighbors) {
    console.log('unvisitedNeighbors', unvisitedNeighbors);
    console.log('neighbor', neighbor);
    let result = CheckoutNeighbor(newPathHistory, allPoints[neighbor], destinationPointId, allPoints);
    if(result) return result;
  }
  return false
}

router.get('/', async (ctx, next) => {
  try {
    if(!ctx.request.query.from || !ctx.request.query.to) {
      ctx.throw(404, 'Bad Request');
    }

    const { from, to } = ctx.request.query;

    const [fromLocation] = await Query.Locations.findById(from);
    if (!fromLocation) ctx.throw(404, 'Не найдена начальная точка маршрута');
    const [toLocation] = await Query.Locations.findById(to);
    if (!toLocation) ctx.throw(404, 'Не найдена конечная точка маршрута');
    if(!fromLocation.pathPointId) ctx.throw(404, 'Для начальной точки не указана связанная точка маршрута');
    if(!toLocation.pathPointId) ctx.throw(404, 'Для конечной точки не указана связанная точка маршрута');
    if(fromLocation.buildingId !== toLocation.buildingId) ctx.throw(404, 'Точки маршрута находятся в разных зданиях');

    let allPoints = await Query.PathPoints.getAllByBuildingIdAndLevel(fromLocation.buildingId, fromLocation.level);
    
    allPoints = await Promise.all(
      allPoints.map(async point => {
        let links = [
          ...(await Query.PathPoints.getPointLinksFrom(point.id)).map(a=>a.toPointId),
          ...(await Query.PathPoints.getPointLinksTo(point.id)).map(a=>a.fromPointId)
        ];
        return {...point, links}
      }),
    );
    
    allPoints = _.keyBy(allPoints, 'id');
    // console.log(allPoints);
    const entryPoint = allPoints[fromLocation.pathPointId];
    
    // console.log(entryPoint);
    const result = CheckoutNeighbor({}, entryPoint, toLocation.pathPointId, allPoints);
    if(result) {
      ctx.status = 200;
      ctx.body = Object.values(result).map(p=>({x: p.x, y: p.y }));
    } else {
      ctx.throw(404, 'Не удалось построить маршрут');
    }
  } catch (err) {
    console.log(err)
    ctx.status = err.status || 500;
    ctx.body = { error: err.message || 'Internal Server Error'}
  }
  await next();
})

router.get('/points', async (ctx, next) => {
  try {
    if(!ctx.request.query.buildingId) {
      ctx.status = 400;
      throw '400 BAD REQUEST';
    } else {
      let points;
      if(ctx.request.query.level)
        points = await Query.PathPoints.getAllByBuildingIdAndLevel(ctx.request.query.buildingId, ctx.request.query.level)
      else
        points = await Query.PathPoints.getAllByBuildingId(ctx.request.query.buildingId);
      ctx.body = points;
      ctx.status = 200;
    }
  } catch (err) {
    console.log(err);
  }
})

router.get('/links', async (ctx, next) => {
  try {
    if(!ctx.request.query.pointId) {
      ctx.status = 400;
      throw '400 BAD REQUEST';
    } else {

      let links = [
        ...(await Query.PathPoints.getPointLinksFrom(ctx.request.query.pointId)).map(a=>a.toPointId),
        ...(await Query.PathPoints.getPointLinksTo(ctx.request.query.pointId)).map(a=>a.fromPointId)
      ];
      ctx.body = links;
      ctx.status = 200;
    }
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
