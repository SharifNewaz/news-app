const express = require('express');
const router = express.Router();
let { getLogin } = require('../controller/loginController')
let { getSignup, postSignup } = require('../controller/signupController')

/* GET users listing. */

/* GET home page. */
router.get('/login', getLogin);

router.route('/signup')
    .get(getSignup)
    .post(postSignup)


module.exports = router;
