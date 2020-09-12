// Setup and connect to sql server
var mysql = require("mysql");


var connection = mysql.createConnection({
    host: process.env.SERVER,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

connection.connect();

// For now, it seems like these patterns will be used a lot, so I wrote a couple methods for them
// Can return to individual sql request handling if need be
function getData(query, res) {
    console.log(query);
    connection.query(query, function (err, response) {
        if (err) {
            console.log(err);
            res.status(500).json({success: false, error: err});
        } else {
            console.log(response);
            res.status(200).send({success: true, found: response.length, records: response});
        }
    });
}

// What kinds of responses are good for posts? Just confirmation?
function updateData(query, res) {
    console.log(query);
    connection.query(query, function (err, response) {
        if (err) {
            console.log(err);
            res.status(500).json({success: false, error: err});
        } else {
            // response.rowsAffected[0] only returns number of rows affected by the first query
            console.log(response);
            res.status(200).send({success: true, numAffected: response.length});
        }
    });
}

module.exports = {getData, updateData};
