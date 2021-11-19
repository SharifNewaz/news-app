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
            //initialize newArticle
            let newArticle = null;
            let articleFromArticleDB = null;
            let userFromDB = null;
            let {
                articleAuthor, articleTitle,
                articleContent, articleDescription,
                articleUrl, articlePublished } = req.body;

            //check if the article exist in the article db by querying into the article DB
            console.log(req.user._id);
            try {
                articleFromArticleDB = await articlesModel.findOne({ title: articleTitle });
                userFromDB = await usersModel.findOne({ _id: req.user._id });
                console.log(articleFromArticleDB);
                console.log(userFromDB);
            } catch (err) {
                console.log(err)
            }

            if (!articleFromArticleDB) {
                //if we are here the article is not in article DB so put it in the article DB
                newArticle = new articlesModel({
                    author: articleAuthor,
                    title: articleTitle,
                    description: articleDescription,
                    url: articleUrl,
                    publishedDate: articlePublished,
                    content: articleContent
                });
                //Push the user (req.user._id) to the users array of the article
                newArticle.users.push(req.user._id);
                userFromDB.uarticles.push(newArticle._id);

                try {
                    await newArticle.save();
                    await userFromDB.save();
                    console.log(`Article "${newArticle.title}" is Saved in the article DB`)
                    console.log(`Pushed ${req.user.uname} into the article "${newArticle.title}".`);
                    console.log(`${req.user.uname} Saved the article "${newArticle.title}".`);
                    req.flash('success_msg', `Article, "${newArticle.title}" is Saved`);
                    return res.redirect('/articles/api');
                } catch (err) {
                    console.log(err)
                }
            }
            else {
                //if the user not in the users array of the article, then push the user 
                if (!articleFromArticleDB.users.includes(req.user._id)) {
                    articleFromArticleDB.users.push(req.user._id);
                    try {
                        await articleFromArticleDB.save();
                        console.log(`Pushed ${req.user.uname} into the article "${articleFromArticleDB.title}".`);
                        req.flash('success_msg', `Article, "${articleFromArticleDB.title}" is Saved`);
                        return res.redirect('/articles/api');
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    console.log(`${req.user.uname} is already saved into the article "${articleFromArticleDB.title}".`);
                    req.flash('error_msg', `You have already saved the article, "${articleFromArticleDB.title}"`);
                    return res.redirect('/articles/api');
                }

                //if we are here that means the article is alredy in article DB,
                //so we do the follwoings:
                // 1--> Check if the article is in the user's uarticle array
                if (!userFromDB.uarticles.includes(articleFromArticleDB._id)) {
                    // 3--> if the article is not saved in user's uarticle array,
                    //      then we need to insert the _id of the article in the array
                    userFromDB.uarticles.push(newArticle._id);
                    try {
                        await userFromDB.save();
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    // 1.2--> if the article is already saved in user's  uarticle array,
                    //      then we can send an alart that the article
                    //      has alredy been saved
                    console.log(`You have already saved the article "${articleFromArticleDB.title}".`);
                    req.flash('error_msg', `You have already saved the article "${articleFromArticleDB.title}".`);
                    res.redirect('/articles/api');
                }
            }
        }
    }
}
