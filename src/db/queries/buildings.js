const knex = require('../connection');

module.exports = {
  getAll() {
    return knex('buildings')
      .select();
  }
}