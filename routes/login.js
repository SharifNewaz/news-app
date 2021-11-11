const express = require('express');
const router = express.Router();
let { getLogin } = require('../controller/loginController')


/* GET home page. */
router.get('/', getLogin);

module.exports = router;
