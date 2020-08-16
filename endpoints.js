var express = require('express');
var router = express.Router();
const request = require('request');
const FREE_DAYS = 10;

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

// Didn't seem to be a date method that gave the proper sql format, so here's one
function dateToString(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// For now, it seems like these patterns will be used a lot, so I wrote a couple methods for them
// Can return to individual sql request handling if need be
function getData(query, res) {
    var request = new sql.Request();

    request.query(query, function (err, response) {
        if (err) {
            res.status(500).json(err);
        } else {
            console.log(response.recordset);
            res.status(200).send({repositories: response.recordset});
        }
    });
}

// What kinds of responses are good for posts? Just confirmation?
function updateData(query, res) {
    var request = new sql.Request();

    request.query(query, function (err, response) {
        if (err) {
            res.status(500).json(err);
        } else {
            console.log(response);
            res.status(200).send(response);
        }
    });
}


// REPOSITORY methods
router.post('/repo/:repoID/createRepo', function(req, res) {
    var repoID = req.params.repoID;
    var branch = req.body.branch || "master";
    var payment = req.body.paymentMethod;
    var expiryDate = new Date().addDays(FREE_DAYS);

    var query = `
        INSERT INTO Repository (ID, Branch, PaymentMethod, ExpiryDate)
        VALUES (${repoID}, '${branch}', ${payment}, '${dateToString(expiryDate)}')
        `;

    updateData(query, res);
});

router.post('/repo/:repoID/updatePayment', function(req, res) {
    var repoID = req.params.repoID;
    var payment = req.body.paymentMethod;

    if (!payment) {
        res.status(400).json({message: "Missing parameters!"});
    } else {
        var query = `
            UPDATE Repository
            SET PaymentMethod = ${payment}
            WHERE ID = ${repoID};
            `;
        updateData(query, res);
    }
});


// Adds a (currently empty) build and updates corresponding repo build count
router.post('/repo/:repoID/addBuild', function(req, res) {
    var repoID = req.params.repoID;
    var status = req.body.status || "";
    var output = req.body.output || "";
    var computeTime = req.body.computeTime || 0;

    var query = `
        DECLARE @new_build_num INT;
        SET @new_build_num = db_accessadmin.NextBuildNum(${repoID});

        UPDATE Repository
        SET BuildCount = @new_build_num
        WHERE ID = ${repoID};

        INSERT INTO Build (RepoID, BuildNum, Status, Output, ComputeTime)
        VALUES (${repoID}, @new_build_num, '${status}', '${output}', ${computeTime});
        `;
    updateData(query, res);
});

// Accepts list of repository ids, returns all rows from REPOSITORY matching those ids
router.get('/repo', function(req, res) {
    var repos = req.query.repositories;

    if (!repos) {
        res.status(400).json({message: "Missing respositories parameter(s)!"});
    } else {
        var ids = Object.values(repos);
        var query = `
            SELECT *
            FROM Repository
            WHERE ID IN (${ids.join(", ")});
            `;
        getData(query, res);
    }
});

// Accepts a single repositry id, returns all associated builds from most recent -> least recent
router.get('/repo/:repoID/builds', function(req, res) {
    var repoID = req.params.repoID;

    var query = `
        SELECT *
        FROM Build WHERE RepoID = ${repoID}
        ORDER BY BuildNum DESC;
        `;
    getData(query, res);
});


// PROFILE methods

// Returns relevant user profile, creating an empty one if needed
router.get('/user/:githubID', function(req, res) {
    var githubID = req.params.githubID;

    var query = `
        INSERT INTO Profile (ID)
        VALUES (${githubID});
        `;
    updateData(query, res);
});

module.exports = router;
