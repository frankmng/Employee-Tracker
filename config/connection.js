const mysql = require('mysql2/promise')
const fs = require("fs")

// load .env variables
require('dotenv').config();

// read sql seed query
const seedQuery = fs.readFileSync('./db/seeds.sql', {
  encoding: "utf-8",
})

// connect to database
const db = mysql.createConnection(
  {
    user: process.env.DB_USER,
    database: process.env.DB_DB,
    password:process.env.DB_PASS,
    host: process.env.DB_HOST,
  },
    console.log(`Connected to the employee_db database.`)
);


db.connect();
console.log("Running SQL seed...")

db.query(seedQuery, err => {
  if(err) {
    throw err
  }
  console.log("SQL seed completed")
  db.end();
})

module.exports = connection;