var express = require('express');
var router = express.Router();
const request = require('request');


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


// Functions to implement:
// builds => takes in a repo id, returns ordered list of builds for that repo (limit to 50?)

// Accepts list of repository ids, returns all rows from REPOSITORY matching those ids
router.get('/repository', function(req, res) {
    if (!req.query.repositories) {
        res.status(400).json({message: "Missing respository url parameters!"});
    } else {
        var ids = Object.values(req.query.repositories);

        var request = new sql.Request();
        request.query(`SELECT * FROM REPOSITORY WHERE ID IN (${ids.join(", ")})`, function (err, response) {
            if (err) {
                res.status(500).json({message: "Database unavailable."});
            } else {
                console.log(response.recordset);
                res.status(200).send({repositories: response.recordset});
            }
        });
    }
});

// Accepts a single repositry id, returns all associated builds from most recent -> least recent
router.get('/builds', function(req, res) {
    if (!req.query.repository) {
        res.status(400).json({message: "Missing respository url parameter!"});
    } else {
        var id = req.query.repository;

        var request = new sql.Request();
        request.query(`SELECT * FROM BUILD WHERE RepoID = ${id} ORDER BY BuildNum DESC`, function (err, response) {
            if (err) {
                res.status(500).json({message: "Database unavailable."});
            } else {
                console.log(response.recordset);
                res.status(200).send({builds: response.recordset});
            }
        });
    }
});


module.exports = router;
