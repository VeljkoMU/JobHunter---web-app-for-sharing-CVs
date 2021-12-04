const mysql = require('mysql');

// Promenite ovo kako vama odgovara za vas komp
const connectionDB = mysql.createConnection({
    host: '127.0.0.1',
    port: 3360,
    user: 'root',
    password: 'crusider23',
    database: 'cv_projekat'
});

connectionDB.ping((err)=>console.log("Connected to db!"));

connectionDB.query("select * from users;", (e, r, f)=> {
    console.log(e);
    console.log(r);
});

module.exports = connectionDB;