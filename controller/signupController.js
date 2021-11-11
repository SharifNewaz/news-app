
let getSignup = async (_req, res, _next) => {
    res.render('signUp');
}

let postSignup = async (req, res, _next) => {

    // make a query to db to see if a user exist
    // if does than we say it alredy exists
    // otherwise put the information in db
    // and redirect to the login page
    console.log(req.body)
    res.send(`Registered as ${req.body.userName}`)
}

module.exports = { getSignup, postSignup };
