const _ = require('lodash');
const knex = require('../connection');

module.exports = {
  getAllByBuildingId(buildingId) {
    return knex('locations')
      .join('points', 'locations.id', 'points.locationId')
      .where({ buildingId })
      .orderBy('title')
      .select()
      .then((locations) => {
        let entries = Object.entries(
          _.groupBy(locations, (location) => location.level),
        );
        return entries.map(([key, value]) => ({
          level: key,
          locations: value.map((location) => ({
            id: location.id,
            title: location.title,
            points: { x1: location.x1, y1: location.y1 },
            entryPoints: { x: location.x_entry, y: location.y_entry }
          })),
        }));
      });
  },
};
