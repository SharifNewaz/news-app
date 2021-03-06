const express = require('express');
const router = express.Router();
let { getLogin, postLogin } = require('../controller/login-controller');
let { getSignup, postSignup } = require('../controller/signup-controller');
let { getLogout } = require('../controller/logout-controller');
const { forwardAuthenticated } = require('../config/auth');

/* login router */
router.route('/login')
    .get(forwardAuthenticated, getLogin)
    .post(postLogin);

/* signup router */
router.route('/signup')
    .get(forwardAuthenticated, getSignup)
    .post(postSignup);

/* handle logout */
router.route('/logout')
    .get(getLogout);

module.exports = router;
