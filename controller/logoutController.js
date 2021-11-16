module.exports = {
    getLogout: (req, res, next) => {
        //passport middleware gives us the logout funtion
        req.logout();
        req.flash({ 'success_msg': 'You are logged out' });
        res.redirect('/auth/login');
    }
}

