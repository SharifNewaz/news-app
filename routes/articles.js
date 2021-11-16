const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.route('/api')
    .get(ensureAuthenticated, (req, res) => {
        res.render('articles', {
            name: req.user.uname
        });
    });

module.exports = router;
