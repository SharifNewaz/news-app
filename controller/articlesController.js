const articlesModel = require("../models/articlesModel")
const usersModel = require('../models/usersModel')
const newsFetch = require('../api/news')

module.exports = {
    getAllArticles: async (req, res, _next) => {
        let articleTitle = "domains=wsj.com";
        let data = await newsFetch(articleTitle);

        try {
            // now render the 'article' file and show articles in the cards 
            // and we send the array of all the documents to be rendered in the fieldset
            res.render('articles', {
                articles: data.articles,
                name: req.user.uname,
            })
        } catch (err) {
            console.log("error with querying docs using find()" + err)
        }
    }
}
