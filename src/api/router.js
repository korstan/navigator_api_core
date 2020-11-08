const BuildingRoute = require('./building');
const LevelRoute = require('./level');

module.exports = (app) => {
  app.use(BuildingRoute.routes());
  app.use(LevelRoute.routes());
}
