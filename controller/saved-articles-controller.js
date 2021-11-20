module.exports = {
    getSavedArticles: (req, res, next) => {
        res.render('saved-articles', {
            name: req.user.uname
        });
    }
}