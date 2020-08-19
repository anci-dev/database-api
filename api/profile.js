var express = require('express');
var router = express.Router();
const request = require('request');
const sql = require('./sql');

// Creates new, blank user profile with given github ID
router.post('/:githubID/createUser', function(req, res) {
    var githubID = req.params.githubID;

    var query = `
        INSERT INTO Profile (ID)
        VALUES (${githubID});
        `;
    sql.updateData(query, res);
});

// Returns relevant user profile
router.get('/:githubID', function(req, res) {
    var githubID = req.params.githubID;

    var query = `
        SELECT *
        FROM Profile
        WHERE ID = ${githubID};
        `;
    sql.getData(query, res);
});

module.exports = router;
