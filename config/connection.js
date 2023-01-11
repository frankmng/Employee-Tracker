const mysql = require('mysql2')
require('dotenv').config();
const db = mysql.createConnection(
  {
    user: process.env.DB_DB,
    database: process.env.DB_USER,
    password:process.env.DB_PASS,
    host: process.env.DB_HOST,
  },
    console.log(`Connected to the employee_db database.`)
);

module.exports = db;