const BuildingRoute = require('./building');
const LevelRoute = require('./level');
const PathRoute = require('./path');

module.exports = (app) => {
  app.use(BuildingRoute.routes());
  app.use(LevelRoute.routes());
  app.use(PathRoute.routes());
}
