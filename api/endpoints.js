var express = require('express');
var router = express.Router();
const request = require('request');

router.use('/repository', require('./repository'));
router.use('/profile', require('./profile'));
router.use('/build', require('./build'));

module.exports = router;
