
const articlesModel = require("../models/articles-model");
const usersModel = require('../models/users-model');

module.exports = {

    getSavedArticles: async (req, res, next) => {
        //get the current user ID from this session
        let currentUserId = req.user._id;
        let userArticlesInDB = null;

        try {
            //find all the articles that has the following user
            userArticlesInDB = await articlesModel.find({
                "users": currentUserId
            });
        } catch (error) {
            console.log(error);
        }

        //render those articles saved by that specific user
        res.render('saved-articles', {
            articles: userArticlesInDB,
            name: req.user.uname
        });
    },

    deleteSavedArticle: async (req, res, next) => {
        //get the article id fro, req.params
        let articleToBeDeletedID = req.params.id;
        let currentUserId = req.user._id;
        let numsOfArticles = req.body.articleLength;

        try {
            //query the specific article that needs to be deleted using id
            //then use $pull to get that user out of the "users" array
            let articleTobeDeleted = await articlesModel.findOneAndUpdate(
                { "_id": articleToBeDeletedID },
                { $pull: { "users": currentUserId } }
            );

            //query the specific user who is deleting the arrticle,
            //then use $pull to get that article out of the "uarticles" array
            await usersModel.findOneAndUpdate(
                { "_id": currentUserId },
                { $pull: { "uarticles": articleToBeDeletedID } }
            );

            //if the article does not have any users, then just delete the article
            //from the db. The length === 1 means the last user id has just been pulled ($pull)
            //from the "users" array
            if (articleTobeDeleted.users.length === 1) {
                let x = await articlesModel.findOneAndDelete(
                    { "_id": articleToBeDeletedID }
                );
                console.log(x, "has been deleted")
            }

            console.log(`${articleToBeDeletedID} is deleted`);
        } catch (err) {
            console.log(err);
        }

        // if the last article is deleted then redirect to the
        // news page so that they can chose new articles again
        if (numsOfArticles == 1) {
            res.redirect('/articles/api');
            return;
        }

        //successfull deletion redirects to the same page
        //so that remaining saved article can be seen
        res.redirect('/articles/saved-articles')
    },

    //the following function is more like getting the edit page
    //however, we make it post because we need the articleID
    //so that we can render the new poage with filled information
    getEditArticle: async (req, res, next) => {
        let articleID = req.body.articleID;
        try {
            let article = await articlesModel.findOne({ _id: articleID })
            res.render('edit-article', {
                article: article,
                name: req.user.uname
            })

        } catch (err) {
            console.log(err)
        }
    },

    putEditArticle: async (req, res) => {
        let articleID = req.params.id
        let updatedTitle = null;
        let updatedContent = null;

        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            updatedTitle = req.body._method[0];
            updatedContent = req.body._method[1];
        }

        try {
            let article = await articlesModel.updateOne(
                { _id: articleID },
                {
                    $set: {
                        title: updatedTitle,
                        content: updatedContent
                    },
                    $currentDate: { lastModified: true }
                })

            res.redirect('/articles/saved-articles');
        } catch (err) {
            console.log(err)
        }
    }
}
