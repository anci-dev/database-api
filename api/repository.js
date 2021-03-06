var express = require('express');
var router = express.Router();
const request = require('request');
const sql = require('./sql');

// Didn't seem to be a date method that gave the proper sql format, so here's one
function dateToString(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
const FREE_DAYS = 10;

// REPOSITORY methods
router.post('/:repoID/createRepository', function(req, res) {
    var repoID = req.params.repoID;
    var branch = req.body.branch || "master";
    var payment = req.body.paymentMethod;
    var expiryDate = new Date().addDays(FREE_DAYS);

    var query = `
        INSERT INTO REPOSITORY (id, branch, paymentMethod, expiryDate)
        VALUES (${repoID}, '${branch}', ${payment}, '${dateToString(expiryDate)}')
        `;

    sql.updateData(query, res);
});

router.post('/:repoID/updatePayment', function(req, res) {
    var repoID = req.params.repoID;
    var payment = req.body.paymentMethod;

    if (!payment) {
        res.status(400).json({success: false, error: "Missing [payment] parameter!"});
    } else {
        var query = `
            UPDATE REPOSITORY
            SET paymentMethod = ${payment}
            WHERE id = ${repoID};
            `;
        sql.updateData(query, res);
    }
});

// Accepts list of repository ids, returns all rows from REPOSITORY matching those ids
router.get('/', function(req, res) {
    var repos = req.query.repositories;

    if (!repos) {
        res.status(400).json({success: false, error: "Missing [respositories] parameter(s)!"});
    } else {
        var ids = Object.values(repos);
        var query = `
            SELECT REPOSITORY.*, (
                                    SELECT COUNT(*)
                                    FROM BUILD
                                    WHERE BUILD.repoID = REPOSITORY.id
                                ) AS buildCount
            FROM REPOSITORY
            WHERE id IN (${ids.join(", ")});
            `;
        sql.getData(query, res);
    }
});

// Alternative method for getting all rows from a single REPOSITORY
router.get('/:repoID', function(req, res) {
    var repo = req.params.repoID;

    var query = `
        SELECT REPOSITORY.*, (
                                SELECT COUNT(*)
                                FROM BUILD
                                WHERE BUILD.repoID = REPOSITORY.id
                            ) AS buildCount
        FROM REPOSITORY
        WHERE REPOSITORY.id = ${repo}
        `;
    sql.getData(query, res);
});

// Accepts a single repositry id, returns all associated builds from most recent -> least recent
router.get('/:repoID/builds', function(req, res) {
    var repoID = req.params.repoID;

    var query = `
        SELECT *
        FROM BUILD WHERE repoID = ${repoID}
        ORDER BY buildNum DESC;
        `;
    sql.getData(query, res);
});

module.exports = router;
