const passport = require('passport');

module.exports = {
    getLogin: async (_req, res, _next) => {
        res.render('logIn');
    },

    postLogin: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/articles/api',
            failureRedirect: '/auth/login',
            failureFlash: true
        })(req, res, next);
    }
}
