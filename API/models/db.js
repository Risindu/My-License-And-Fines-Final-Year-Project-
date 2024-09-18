const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my_license_and_fines'
});

module.exports = pool.promise();
