const mysql = require("mysql");
require('dotenv').config();

class Connection{
    constructor() {
        this.con = mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASS,
            database: process.env.DBNAME,
        });
    }

    connect() {
        this.con.connect((err) => {
            if (err) {
                console.log('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + this.con.threadId);
        });
    }
}

module.exports = new Connection();