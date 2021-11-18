module.exports = {
    //if the req is authenticated then we return next to
    //continue rendeering the expencted page bcz the user is authenticated
    //if the req is not authenticated then we redirect to the login page
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            console.log("ensureAuthenticated: Authenticated")
            return next();
        }
        console.log("ensureAuthenticated: Not Authenticated")
        req.flash('error_msg', 'Please log in to view the article boards');
        res.redirect('/auth/login');
    },

    //if the req is not authenticated then we return next to
    //continue rendering the expencted pages(login or signup)
    //if the req is authenticated then we redirect to the article page
    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            console.log("forwardAuthenticated: Not Authenticated")
            return next();
        }
        console.log("forwardAuthenticated: Authenticated")
        res.redirect('/articles/api');
    }
};
