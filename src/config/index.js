const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(process.cwd(), `${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 8000,
  DEBUG_PORT: process.env.DEBUG_PORT || 9229,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_NAME: process.env.DB_NAME || 'postgres',
}
