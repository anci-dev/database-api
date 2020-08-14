var express = require('express');
var app = express();
require('dotenv').config();

var sql = require("mssql");

var config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    port: parseInt(process.env.DB_PORT),
};

sql.connect(config, function (err) {
    if (err) {
        console.log(err);
    } else {
        var request = new sql.Request();

        request.query('SELECT * FROM PROFILE', function (err, response) {
            if (err) console.log(err);

            console.log(response.recordset);
        });
    }
});

var server = app.listen(process.env.API_PORT, function () {
    console.log('Server is running...');
});
