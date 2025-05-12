const dotenv = require('dotenv');
const config = require('./config');

const mysql = require('mysql2');

// Load environment variables


dotenv.config();
const {
    database_host,
    database_user,
    database_password,
    database,
    database_port,
} = config;

const db = mysql.createConnection({
    host: database_host,
    user: database_user,
    password: database_password,
    database: database,
    port: database_port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQ database.');
    console.log('db')
});

module.exports = db;
