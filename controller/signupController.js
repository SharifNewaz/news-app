const usersModel = require('../model/usersModel')
const articlesModel = require('../model/articlesModel')
const bcrypt = require('bcrypt');
let flash = require('connect-flash');

let getSignup = async (req, res, _next) => {

    let data = req.flash('formData');
    let userName = null;
    let userEmail = null;
    let userPassword = null;
    let userConfirmedPassword = null;

    if (data.length > 0) {
        userName = data[0].userName;
        userEmail = data[0].userEmail;
        userPassword = data[0].userPassword;
        userConfirmedPassword = data[0].userConfirmedPassword;
    }

    res.render('signUp', {
        message: req.flash('errorMessage'),
        userName: userName,
        userEmail: userEmail,
        userPassword: userPassword,
        userConfirmedPassword: userConfirmedPassword
    });
}

let postSignup = async (req, res, _next) => {

    let { userName, userEmail,
        userPassword: plainTextPassword,
        userConfirmedPassword: plainTextConfirmedPassword } = req.body;

    //the follwing encrypts my password and stores it in DB
    let userPassword = await bcrypt.hash(plainTextPassword, 10);
    let userEmailFromDB = null;
    let userNameFromDB = null;

    //if the validation is true, then do a query
    if (validateEmail(userEmail)) {

        //Query in the db to see if the userEmail exist
        try {
            userEmail = userEmail.toLowerCase()
            userEmailFromDB = await usersModel.findOne({ uemail: userEmail });
            // console.log(userEmailFromDB);
        } catch (error) {
            console.log(error);
        }

        //Query in the db to see if the userName exist
        try {
            userName = userName.toLowerCase()
            userNameFromDB = await usersModel.findOne({ uname: userName });
            // console.log(userEmailFromDB);
        } catch (error) {
            console.log(error);
        }

        if (!userEmailFromDB && !userNameFromDB
            && (plainTextPassword === plainTextConfirmedPassword)) {

            let newUser = new usersModel(
                {
                    uname: userName,
                    uemail: userEmail,
                    upassword: userPassword
                });

            try {
                await newUser.save();
                req.flash('errorMessage', 'Thank You! Account successfully created!');
                res.redirect('/auth/signup');
            } catch (error) {
                console.log(`Couldn't save the user in DB ${error}`);
            }

        } else {
            if (userNameFromDB) {
                req.flash('errorMessage', 'Username alredy exist')
                req.flash('formData', req.body)
                res.redirect('/auth/signup')
            } else if (userEmailFromDB) {
                req.flash('errorMessage', 'Email already exist')
                req.flash('formData', req.body)
                res.redirect('/auth/signup')
            }
            else if ((plainTextPassword !== plainTextConfirmedPassword)) {
                req.flash('errorMessage', 'Password don\'t match')
                req.flash('formData', req.body)
                res.redirect('/auth/signup')
            }
        }

    } else {
        req.flash('errorMessage', "Incorrect email format")
        req.flash('formData', req.body)
        res.redirect('/auth/signup')
    }
}

function validateEmail(userEmail) {
    let regExEmail = /(^[a-zA-Z]{1,})((\d){1,}|[\_|\.|\-][a-zA-Z]{1,})?\@([a-zA-Z]{1,})\-?([a-zA-Z]{1,})?\.([a-zA-Z]{2,3})$/;
    return regExEmail.test(userEmail);
}

module.exports = { getSignup, postSignup };
