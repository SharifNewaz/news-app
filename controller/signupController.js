const usersModel = require('../model/usersModel')
const articlesModel = require('../model/articlesModel')

let getSignup = async (_req, res, _next) => {
    res.render('signUp');
}

let postSignup = async (req, res, _next) => {

    let { userEmail, userName, userPassword, userConfirmedPassword } = req.body;
    let userEmailFromDB = null;

    console.log(req.body);

    //if the validation is true, then do a query in the db to see if the user
    if (validateEmail(userEmail)) {

        //Query in the db to see if the userEmail exist
        try {
            userEmailFromDB = await usersModel.findOne({ email: userEmail });
            console.log(userEmailFromDB);
        } catch (error) {
            console.log(error);
        }

        //Query in the db to see if the userName exist
        try {
            userNameFromDB = await usersModel.findOne({ uname: userName });
            console.log(userEmailFromDB);
        } catch (error) {
            console.log(error);
        }

        // if the user exist in the DB
        // then userEmailFromDB won't be null
        if (!userEmailFromDB && (userPassword == userConfirmedPassword) && !userNameFromDB) {
            let newUser = new usersModel(
                {
                    uname: userName,
                    uemail: userEmail,
                    upassword: userPassword
                });

            try {
                await newUser.save();
                res.redirect('/auth/login');
            } catch (error) {
                console.log(`Couldn't save the user in DB ${error}`);
            }

        } else {
            res.render('signUp', {
                message: "User Already Exist"
            });
        }

    } else {
        //render a message saying Incorrect email format
        res.render('signUp', {
            message: "Incorrect email format"
        });
    }
}

function validateEmail(userEmail) {
    let regExEmail = /(^[a-zA-Z]{1,})((\d){1,}|[\_|\.|\-][a-zA-Z]{1,})?\@([a-zA-Z]{1,})\-?([a-zA-Z]{1,})?\.([a-zA-Z]{2,3})$/;
    return regExEmail.test(userEmail);
}

module.exports = { getSignup, postSignup };
