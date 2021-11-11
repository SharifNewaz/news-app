const { Router } = require('express');
var express = require('express');
var router = express.Router();
let { getSignup, postSignup } = require('../controller/signupController')

/* GET users listing. */
router.route('/')
    .get(getSignup)
    .post(postSignup)

module.exports = router;
