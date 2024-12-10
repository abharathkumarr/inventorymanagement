const mysql = require('mysql2'); 

let connection
function conn() {
    try {
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '18091999',
            database: 'inventory_management',
        }).promise()
        console.log("db connected successfully")
    } catch (err) {
        console.log(err)
    }
}
conn()
module.exports = connection
