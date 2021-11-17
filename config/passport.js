const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const usersModel = require('../model/usersModel');

module.exports = function (passport) {
    let userNameOrEmailFromDB = null;
    passport.use(
        new LocalStrategy({ usernameField: 'userNameOrEmail' }, async (userNameOrEmail, password, done) => {
            // since we want to login with either username or email
            // we need to check if the post login value is either username or email
            // if userNameOrEmail does not have @, then criteria is an username else it is an email
            let criteria = (userNameOrEmail.indexOf('@') === -1) ? { uname: userNameOrEmail } : { uemail: userNameOrEmail.toLowerCase() };

            //Match User
            try {
                userNameOrEmailFromDB = await usersModel.findOne(criteria);
            } catch (err) {
                console.log(`Coundn't query ${err}`);
            }

            //if the userNameOrEmaill is not found in the DB, it means the user didn't register
            //we want to return an error message so that the code does not continue running
            if (!userNameOrEmailFromDB) {
                return done(null, false, { message: 'That email/username is not registered' });
            }

            //Match paassword
            //if we are here that means username or the email is found in the database
            //so we check if the posteed password  matches with the DB encrypted password
            try {
                await bcrypt.compare(password, userNameOrEmailFromDB.upassword, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, userNameOrEmailFromDB);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                });
            } catch (err) {
                console.log(`Coudn't bcrypt ${err}`);
            }
        })
    );

    passport.serializeUser((userNameOrEmailFromDB, done) => {
        done(null, userNameOrEmailFromDB.id);
    });

    passport.deserializeUser((id, done) => {
        usersModel.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
