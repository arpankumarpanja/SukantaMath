const jwt = require('jsonwebtoken');

const connection=require('../dbConfig');


const requireAdminAuth = (req, res, next) => {
    const token = req.cookies.admin_jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.admin_token_secret, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/adminLogin');
            } else {
                console.log("decoded admin token verified: " + decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/adminLogin');
    }
};


module.exports = { requireAdminAuth };