var express = require('express');
var router = express.Router();
const request = require('request');
const sql = require('./sql');

// Creates new, blank user profile with given github ID
router.post('/:githubID/createUser', function(req, res) {
    var githubID = req.params.githubID;

    var query = `
        INSERT INTO PROFILE (id)
        VALUES (${githubID});
        `;
    sql.updateData(query, res);
});

// intended to update any user profile params
// at the moment, stripeCustomerId is the only relavant
// data to update
router.post('/:githubID/updateUser', function(req, res) {
    var githubID = req.params.githubID;
    var stripeCustomerId = req.body.stripeCustomerId;

    if (!stripeCustomerId) {
        res.status(400).json({success: false, error: "Missing any relavant parameters to update the user with"});
    } else {
        var query = `
            UPDATE PROFILE
            SET stripeCustomerId = '${stripeCustomerId}'
            WHERE id = ${githubID};
            `;
        sql.updateData(query, res);
    }
});

// Returns relevant user profile
router.get('/:githubID', function(req, res) {
    var githubID = req.params.githubID;

    var query = `
        SELECT *
        FROM PROFILE
        WHERE id = ${githubID};
        `;
    sql.getData(query, res);
});

module.exports = router;
