module.exports = {
    getLogout: (req, res, next) => {
        //passport middleware gives us the logout() funtion
        //req.logout() only deletes the database users' info from session
        //it does not remove thge session from the database
        //On the other hand destroy functions destrys the sessions
        //and removes it from the DB.
        req.logout();
        req.session.destroy((err) => {
            if (err) throw err;
            //clear coockies from the browser
            res.clearCookie('connect.sid');
            //send logout page instead of redirecting to a new page
            //bcz redirection will make a new session insteantly
            //right after destroying the session
            res.render('logout');
        });
    }
}
