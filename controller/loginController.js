
let getLogin = async (req, res, _next) => {

    let success_msg = req.flash('success_msg');
    console.log(success_msg[0])
    res.render('logIn', {
        success_msg: success_msg[0]
    });
}
module.exports = { getLogin };
