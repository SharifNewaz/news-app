const express = require('express');
const router = express.Router();

router.get('/', function (_req, res) {
    res.redirect('/auth/login');
});

module.exports = router;