const { Pool } = require("pg");
const path = require("path");

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})
//require("dotenv").config({path: path.join(__dirname, `../.env.${ENV}`),});
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

console.log("Connecting to:", ENV === "production" ? process.env.DATABASE_URL : process.env.PGDATABASE);


const pool = new Pool(config);
module.exports = pool;