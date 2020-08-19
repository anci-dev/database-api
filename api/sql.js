// Setup and connect to sql server
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
        console.log("Unable to connect to SQL database.");
    }
});

// For now, it seems like these patterns will be used a lot, so I wrote a couple methods for them
// Can return to individual sql request handling if need be
function getData(query, res) {
    var request = new sql.Request();

    request.query(query, function (err, response) {
        if (err) {
            console.log(err);
            res.status(500).json({success: false, error: err});
        } else {
            res.status(200).send({success: true, found: response.recordset.length, records: response.recordset});
        }
    });
}

// What kinds of responses are good for posts? Just confirmation?
function updateData(query, res) {
    var request = new sql.Request();

    request.query(query, function (err, response) {
        if (err) {
            console.log(err);
            res.status(500).json({success: false, error: err});
        } else {
            // response.rowsAffected[0] only returns number of rows affected by the first query
            res.status(200).send({success: true, numAffected: response.rowsAffected[0]});
        }
    });
}

module.exports = {getData, updateData};
