const articlesModel = require("../models/articlesModel");
const usersModel = require('../models/usersModel');
const newsFetch = require('../api/news');
let data = null;
let articlesQueryText = null;

module.exports = {
    getAllArticles: async (req, res, _next) => {
        articlesQueryText = "domains=wsj.com";
        try {
            // now render the 'article' file and show articles in the cards 
            // and we send the array of all the documents to be rendered in the fieldset
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

    postUserArticles: async (req, res, next) => {
        // In POST req 1, req.body will only contain one key value pair i.e searchtext
        // However , In POST req 2 it has mutiple key value pairs in req.body 
        // such as usersNames, userArticleTitle etc.
        // Thus, check if length of key in req.body is 1, 
        // then  search the title with API call+etc. 
        // else we just insert user + article info in db
        // console.log(linkedList);
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
            //initialize newArticle
            let newArticle = null;
            let articleFromArticleDB = null;
            let userFromDB = null;
            let { articleAuthor, articleTitle,
                articleContent, articleDescription,
                articleUrl, articlePublished } = req.body;

            //check if the article exist in the article db by querying into the article DB
            try {
                articleFromArticleDB = await articlesModel.findOne({ title: articleTitle });
                userFromDB = await usersModel.findOne({ _id: req.user._id });
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
                    console.log(`Article "${newArticle.title}" is Saved in the article DB`);
                    console.log(`Pushed ${req.user.uname} into the article "${newArticle.title}".`);
                    console.log(`${req.user.uname} Saved the article "${newArticle.title}".`);

                    if (!articlesQueryText.includes('q')) {
                        req.flash('success_msg', `Article, "${newArticle.title}" is Saved`);
                        console.log("I'm here -1")
                        return res.redirect('/articles/api');
                    } else {
                        let successMsg = `Article, "${newArticle.title}" is Saved`;
                        console.log("I'm here 0");
                        return res.render('articles', {
                            articles: data.articles,
                            name: req.user.uname,
                            successMsg: successMsg,
                            errorMsg: ''
                        })
                    }
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
                        console.log(data);
                        console.log(articlesQueryText);
                        if (!articlesQueryText.includes('q')) {
                            req.flash('success_msg', `Article, "${articleFromArticleDB.title}" is Saved`);
                            console.log("I'm here 1");
                            return res.redirect('/articles/api');
                        } else {
                            let successMsg = `Article, "${newArticle.title}" is Saved`;
                            console.log("I'm here 2");
                            return res.render('articles', {
                                articles: data.articles,
                                name: req.user.uname,
                                successMsg: successMsg,
                                errorMsg: ''
                            })
                        }
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    console.log(`${req.user.uname} is already saved into the article "${articleFromArticleDB.title}".`);
                    console.log(data);
                    console.log(articlesQueryText);
                    if (!articlesQueryText.includes('q')) {
                        req.flash('error_msg', `You have already saved the article, "${articleFromArticleDB.title}"`);
                        console.log("I'm here 3");
                        return res.redirect('/articles/api');
                    } else {
                        let errorMsg = `You have already saved the article, "${articleFromArticleDB.title}"`;
                        console.log("I'm here 4");
                        return res.render('articles', {
                            articles: data.articles,
                            name: req.user.uname,
                            successMsg: '',
                            errorMsg: errorMsg
                        })
                    }
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
                    // if (linkedList.length == 0) {
                    console.log(data);
                    console.log(articlesQueryText);
                    if (!articlesQueryText.includes('q')) {
                        req.flash('error_msg', `You have already saved the article "${articleFromArticleDB.title}".`);
                        return res.redirect('/articles/api');
                    } else {
                        let errorMsg = `You have already saved the article, "${articleFromArticleDB.title}"`;
                        return res.render('articles', {
                            articles: data.articles,
                            name: req.user.uname,
                            successMsg: '',
                            errorMsg: errorMsg
                        })
                    }
                }
            }
        }
    }
}
