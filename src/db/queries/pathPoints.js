const _ = require('lodash');
const knex = require('../connection');

module.exports = {
  getAllByBuildingId(buildingId) {
    return knex('pathPoints')
      .where({ buildingId })
      .orderBy('title')
      .select()
      .then((points) => {
        let entries = Object.entries(
          _.groupBy(points, (point) => point.level),
        );
        return Promise.all(entries.map(async([key, value]) => ({
          level: key,
          points: await Promise.all(value.map(async(point) => ({
            id: point.id,
            title: point.title,
            x: point.x,
            y: point.y,
            textToSpeech: point.textToSpeech,
            isStairs: point.isStairs,
            links: [
              ...(await this.getPointLinksFrom(point.id)).map(a=>a.toPointId),
              ...(await this.getPointLinksTo(point.id)).map(a=>a.fromPointId)
            ]
          }))),
        })));
      });
  },

  getAllByBuildingIdAndLevel(buildingId, level) {
    return knex('pathPoints')
      .where({ buildingId, level })
      .orderBy('title')
      .select()
  },

  getPointLinksFrom(fromPointId) {
    return knex('pathLinks')
      .where({fromPointId})
      .select('toPointId')
  },

  getPointLinksTo(toPointId) {
    return knex('pathLinks')
      .where({toPointId})
      .select('fromPointId')
  }
};
