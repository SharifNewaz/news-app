const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/*localhost:3000/ redirect to -> /auth/login*/
router.get('/', function (_req, res) {
    res.redirect('/auth/login');
});

router.get('/developer', ensureAuthenticated, function (req, res) {
    res.render('about', {
        name: req.user.uname
    });
});

module.exports = router;
