const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { getAllArticles, postUserArticles } = require('../controller/articles-controller');
const { getSavedArticles, deleteSavedArticle, getEditArticle, putEditArticle } = require('../controller/saved-articles-controller');

/* GET and POST news page. */
router.route('/api')
    .get(ensureAuthenticated, getAllArticles)
    .post(ensureAuthenticated, postUserArticles);

/* GET and DELETE saved-article page. */
router.get('/saved-articles', ensureAuthenticated, getSavedArticles);
router.delete('/saved-articles/:id', deleteSavedArticle);

router.post('/edit-article', ensureAuthenticated, getEditArticle);
router.put('/edit-article/:id', putEditArticle);


module.exports = router;