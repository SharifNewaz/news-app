const express = require('express');
const router = express.Router();
let { getLogin, postLogin } = require('../controller/loginController');
let { getSignup, postSignup } = require('../controller/signupController');
let { getLogout } = require('../controller/logoutController');
const { forwardAuthenticated } = require('../config/auth');

/* signup router */
router.route('/signup')
    .get(forwardAuthenticated, getSignup)
    .post(postSignup);

/* login router */
router.route('/login')
    .get(forwardAuthenticated, getLogin)
    .post(postLogin);

/* handle logout */
router.route('/logout')
    .get(getLogout);

module.exports = router;
