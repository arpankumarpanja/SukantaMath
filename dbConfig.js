const mysql = require('mysql');
// const dotenv= require('dotenv').config();


// database connection
// const connectionPool=mysql.createPool({
//     connectionLimit : 20,
//     host:'localhost',
//     user:'root',
//     password:'root',
//     database:'node_curd'
// });


/*
const connection=mysql.createConnection({
    // connectionLimit : process.env.db_conn_limit,
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});
try {
    connection.connect(function (error) {
        if (!!error) console.log(error);
        else console.log('Database Connected!');
    }); 
} catch (error) {
    console.log("database error: ",error);
}
*/


// actual online database
const connectionPool=mysql.createPool({
    connectionLimit : process.env.db_conn_limit,
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});



// module.exports = connection;
module.exports = connectionPool;