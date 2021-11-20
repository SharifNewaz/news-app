const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { getAllArticles, postUserArticles } = require('../controller/articles-controller');
const { getSavedArticles } = require('../controller/saved-articles-controller');

/* GET and POST news page. */
router.route('/api')
    .get(ensureAuthenticated, getAllArticles)
    .post(ensureAuthenticated, postUserArticles);

/* GET and POST saved-article page. */
router.route('/saved-articles')
    .get(ensureAuthenticated, getSavedArticles);

module.exports = router;