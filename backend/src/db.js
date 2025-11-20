require('dotenv').config(); // loads .env into process.env

const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:superuser@localhost:5432/drugsdb';

const pool = new Pool({
  connectionString,
});

module.exports = pool;
