const mysql = require('mysql2');

// Create a connection pool for the License database
const licensePool = mysql.createPool({
    host: 'localhost',      // Database host
    user: 'root',           // Your database username
    password: '',           // Your database password
    database: 'licensedatabase'  // The name of the License database
});

module.exports = licensePool.promise();
