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
    },

    postUserArticles: async (req, res, next) => {
        // In POST req 1, req.body will only contain one key value pair i.e searchtext
        // However , In POST req 2 it has mutiple key value pairs in req.body 
        // such as usersNames, userArticleTitle etc.
        // Thus, check if length of key in req.body is 1, 
        // then  search the title with API call+etc. 
        // else we just insert user + article info in db
        if (Object.keys(req.body).length === 1) {
            let articleTitle = 'q=' + (req.body).articleTypes;
            try {
                let data = await newsFetch(articleTitle);
                res.render('articles', {
                    articles: data.articles,
                    name: req.user.uname,
                })
            } catch (err) {
                console.log(err);
            }
        } else {
            // -initialize newArticle
            // -a single string name is converted 
            // to array element(we do this bcz if the name is single string)
            // then later array goes through each charecter rather
            // than treating is as single string array
            console.log("I'm in here", req.body)
        }
    }
}
