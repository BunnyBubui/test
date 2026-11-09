const mysql = require('mysql2/promise');
const pool = mysql.createPool({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 100
});

pool.getConnection()
    .then(connection => {
        console.log("☀️ Connected to MySQL database pool: " + process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.error("🌑 Database connection failed:", err.message);
    });

module.exports = pool;