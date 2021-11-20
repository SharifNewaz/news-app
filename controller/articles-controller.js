const articlesModel = require("../models/articles-model");
const usersModel = require('../models/users-model');
const newsFetch = require('../api/news');
let data = null;
let articlesQueryText = null;

module.exports = {
    /* Handle GET article request*/
    getAllArticles: async (req, res, _next) => {
        articlesQueryText = "domains=wsj.com";
        try {
            data = await newsFetch(articlesQueryText);
            res.render('articles', {
                articles: data.articles,
                name: req.user.uname,
                successMsg: '',
                errorMsg: ''
            })
        } catch (err) {
            console.log("error with querying docs using find()" + err)
        }
    },

    /* Handle POST article request*/
    postUserArticles: async (req, res, _next) => {
        // In POST req 1, req.body will only contain one key value pair i.e searchtext
        // However , In POST req 2 it has mutiple key value pairs in req.body 
        // such as usersNames, userArticleTitle etc.
        if (Object.keys(req.body).length === 1) {
            articlesQueryText = 'q=' + (req.body).articleTypes;
            try {
                data = await newsFetch(articlesQueryText);
                res.render('articles', {
                    articles: data.articles,
                    name: req.user.uname,
                    successMsg: '',
                    errorMsg: ''
                })
            } catch (err) {
                console.log(err);
            }
        } else {

            let articleFromArticleDB = null;
            let userFromDB = null;
            let articleTitle = req.body.articleTitle;

            //check if the article exist in the article db by querying into the article DB
            try {
                articleFromArticleDB = await articlesModel.findOne({ title: articleTitle });
                userFromDB = await usersModel.findOne({ _id: req.user._id });
            } catch (err) {
                console.log(err)
            }

            if (!articleFromArticleDB) {
                //if we are here, then the article is not in article DB 
                //so put the newly created article in the article DB
                createNewArticleInDB(articlesQueryText, userFromDB, req, res);
                return;
            }
            else {
                //if we are here, then the article is in the article DB
                //and first user is alredy in there as well
                //if the user not in the users array of the article, then push the user
                //by default we also know that
                //the article is not in the articles array of the user, then push the article
                if (!articleFromArticleDB.users.includes(req.user._id)) {
                    articleFromArticleDB.users.push(req.user._id);
                    userFromDB.uarticles.push(articleFromArticleDB._id);
                    try {
                        await articleFromArticleDB.save();
                        await userFromDB.save();
                        let successMsg = `Article, "${articleFromArticleDB.title}" is Saved`;
                        renderSuccessMessages(articlesQueryText, articleFromArticleDB, successMsg, req, res);
                        return;
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    let errorMsg = `You have already saved the article, "${articleFromArticleDB.title}"`;
                    renderErrorMessages(articlesQueryText, articleFromArticleDB, errorMsg, req, res);
                    return;
                }
            }
        }
    }
}

/*Helper functions to handle the POST article requests*/
async function createNewArticleInDB(articlesQueryText, userFromDB, req, res) {
    let { articleAuthor, articleTitle,
        articleContent, articleDescription,
        articleUrl, articlePublished } = req.body;

    let newArticle = new articlesModel({
        author: articleAuthor,
        title: articleTitle,
        description: articleDescription,
        url: articleUrl,
        publishedDate: articlePublished,
        content: articleContent
    });
    //Push the user (req.user._id) to the users array of the article
    //and Push the newly created article into the articles array of the user
    newArticle.users.push(req.user._id);
    userFromDB.uarticles.push(newArticle._id);

    try {
        await newArticle.save();
        await userFromDB.save();
        let successMsg = `Article, "${newArticle.title}" is Saved`;
        renderSuccessMessages(articlesQueryText, newArticle, successMsg, req, res);
    } catch (err) {
        console.log(err)
    }
}

function renderSuccessMessages(articlesQueryText, article, successMsg, req, res) {
    if (!articlesQueryText.includes('q')) {
        req.flash('success_msg', `Article, "${article.title}" is Saved`);
        res.redirect('/articles/api');
    } else {
        res.render('articles', {
            articles: data.articles,
            name: req.user.uname,
            successMsg: successMsg,
            errorMsg: ''
        })
    }
}

function renderErrorMessages(articlesQueryText, article, errorMsg, req, res) {
    if (!articlesQueryText.includes('q')) {
        req.flash('error_msg', `You have already saved the article, "${article.title}"`);
        res.redirect('/articles/api');
    } else {
        res.render('articles', {
            articles: data.articles,
            name: req.user.uname,
            successMsg: '',
            errorMsg: errorMsg
        })
    }
}
