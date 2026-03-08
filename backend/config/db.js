const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "internship_tracker",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;