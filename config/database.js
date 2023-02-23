const mysql = require("mysql2")
 
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'int3306'
})

module.exports = pool.promise()