const config = require('../config');

let knex = require('knex')({
  client: 'pg',
  connection: {
    host : config.DB_HOST,
    user : config.DB_USER,
    password : config.DB_PASSWORD,
    database : config.DB_NAME
  }
});

module.exports = (tableName) => knex(tableName).withSchema('main');
