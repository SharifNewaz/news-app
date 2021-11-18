const usersModel = require('../models/usersModel')
const articlesModel = require('../models/articlesModel')
const bcrypt = require('bcrypt');

module.exports = {
    getSignup: async (_req, res, _next) => {
        res.render('signUp');
    },

    postSignup: async (req, res, _next) => {
        let { userName, userEmail, userPassword, confirmPassword } = req.body;
        let errors = [];
        let userNameFromDB = null;
        let userEmailFromDB = null;

        //user does not enter all the form input
        if (!userName || !userEmail || !userPassword || !confirmPassword) {
            errors.push({ msg: 'Please fill out all fields' });
        }

        //validate the userName later and add the error message accordingly
        // if (!validateUserName(userName)) {
        //     errors.push({ msg: 'Invalid userName format' });
        // }

        //Query in the db to see if the userName exist
        try {
            userNameFromDB = await usersModel.findOne({ uname: userName });
            if (userNameFromDB) {
                errors.push({ msg: "Username already exist" });
            }
        } catch (err) {
            console.log(err);
        }

        //validate the email
        if (!validateEmail(userEmail)) {
            errors.push({ msg: 'Invalid email format' })
        }

        //Query in the db to see if the userEmail exist
        try {
            userEmail = userEmail.toLowerCase()
            userEmailFromDB = await usersModel.findOne({ uemail: userEmail });
            if (userEmailFromDB) {
                errors.push({ msg: "Email already exist" });
            }
        } catch (err) {
            console.log(err);
        }

        //password has to be minimum 8 charecter long
        if (userPassword.length < 8) {
            errors.push({ msg: 'Password must be at least 8 charecters' });
        }

        //userPassword does not match with confirmPassword
        if (userPassword.length >= 8 && userPassword != confirmPassword) {
            errors.push({ msg: 'Passwords do not match' });
        }

        //if there is errors in the array, then render the signUp page
        //and flash the errors
        if (errors.length > 0) {
            res.render('signup', {
                errors,
                userName,
                userEmail,
                userPassword,
                confirmPassword
            });

        } else {

            let newUser = null;
            //if both username and email are not found in the db
            //then, create a new user(i.e make an instance of userSchema)
            //NOTE: WE DON'T SAVE THE THE INSTANCE IN THE DB YET 
            if (!userNameFromDB && !userEmailFromDB) {
                newUser = new usersModel(
                    {
                        uname: userName,
                        uemail: userEmail,
                        upassword: userPassword
                    });
            }

            //encrypt the password before saving the instance
            userPassword = await bcrypt.hash(userPassword, 10);

            //save the instance after adding the encrypted password
            //and redirect to login
            try {
                newUser.upassword = userPassword;
                await newUser.save();
                req.flash('success_msg', 'Account created, and you can log in now');
                res.redirect('/auth/login');
            } catch (error) {
                console.log(`Couldn't save the user in DB ${error}`);
            }
        }
    }
}

let validateEmail = (userEmail) => {
    let regExEmail = /(^[a-zA-Z]{1,})((\d){1,}|[\_|\.|\-][a-zA-Z]{1,})?\@([a-zA-Z]{1,})\-?([a-zA-Z]{1,})?\.([a-zA-Z]{2,3})$/;
    return regExEmail.test(userEmail);
}
