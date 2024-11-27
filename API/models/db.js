const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', // Use the correct IP address of the database host
    user: 'root',
    password: '',
    database: 'license_and_fines'
});

module.exports = pool.promise();
