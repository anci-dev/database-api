var express = require('express');
var router = express.Router();
const request = require('request');
const sql = require('./sql');

// Adds a (currently empty) build
router.post('/addBuild', function(req, res) {
    var repoID = req.body.repoID;
    var status = req.body.status || "";
    var output = req.body.output || "";
    var computeTime = req.body.computeTime || 0;

    if (!repoID) {
        res.status(400).json({success: false, error: "Missing respositories parameter(s)!"});
    } else {
        var query = `
        INSERT INTO Build (RepoID, BuildNum, Status, Output, ComputeTime)
        VALUES (${repoID}, db_accessadmin.NextBuildNum(${repoID}), '${status}', '${output}', ${computeTime});
        `;
        sql.updateData(query, res);
    }

});

module.exports = router;
