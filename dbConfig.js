const mysql = require('mysql');


// database connection
// const connection=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'root',
//     database:'node_curd'
// });



const connection=mysql.createConnection({
    host:'sql6.freesqldatabase.com',
    user:'sql6587558',
    password:'mS5PZ1zzcN',
    database:'sql6587558'
});

connection.connect(function (error) {
    if (!!error) console.log(error);
    else console.log('Database Connected!');
}); 


// module.exports = connection;
module.exports = connection;