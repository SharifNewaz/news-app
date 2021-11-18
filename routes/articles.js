const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { getAllArticles } = require('../controller/articlesController');
/* GET home page. */
router.route('/api')
    .get(ensureAuthenticated, getAllArticles);
module.exports = router;
