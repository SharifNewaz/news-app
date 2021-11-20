const express = require('express');
const router = express.Router();

/*localhost:3000/ redirect to -> /auth/login*/
router.get('/', function (_req, res) {
    res.redirect('/auth/login');
});

module.exports = router;
