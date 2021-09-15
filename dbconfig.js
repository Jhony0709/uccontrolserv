const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ucc_control',
  password: 'toor',
  port: 5432,
});

module.exports = { pool }