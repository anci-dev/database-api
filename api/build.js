var express = require('express');
var router = express.Router();
const request = require('request');
const sql = require('./sql');

const PAGE_SIZE = 50;

router.get('/getBuilds', function(req, res) {
    var repoID = req.query.repoID;
    var page = req.query.page || 0;
    var offset = page * PAGE_SIZE;

    if (!repoID) {
        res.status(400).json({success: false, error: "Missing [repoID] parameter(s)!"});
    } else {
        var query = `
        SELECT *
        FROM BUILD
        WHERE repoID = ${repoID}
        ORDER BY buildNum DESC
        LIMIT ${PAGE_SIZE}
        OFFSET ${offset};
        `;
        sql.getData(query, res);
    }
});

// Adds a (currently empty) build
router.post('/addBuild', function(req, res) {
    var repoID = req.body.repoID;
    var status = req.body.status || "";
    var output = req.body.output || "";
    var computeTime = req.body.computeTime || 0;

    if (!repoID) {
        res.status(400).json({success: false, error: "Missing [repoID] parameter!"});
    } else {
        var query = `
        INSERT INTO BUILD (repoID, buildNum, status, output, computeTime)
        VALUES (${repoID}, db_accessadmin.NextBuildNum(${repoID}), '${status}', '${output}', ${computeTime});
        `;
        sql.updateData(query, res);
    }
});

module.exports = router;
