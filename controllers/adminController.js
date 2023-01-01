const connection=require('../dbConfig');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// create json web token for admin
const maxAge = 30 * 60;    //(30 minutes set for now) for 3 days 3 * 24 * 60 * 60, for 5 minute 5*60  
const createAdminToken = (id) => {
  return jwt.sign({ id }, 'admin secret code - shikshak', {
    expiresIn: maxAge
  });
};


// go to admin pannel page for all admin access
module.exports.admin_panel_get=(req, res) => {
    res.render('admin_pannel');    
}


// go to admin login form page
module.exports.admin_login_get=(req, res) => {
    res.render('admin_Login');    
}


// admin login post check user with email/username and password from database
module.exports.admin_login_post=async (req, res) => { 
    let check_admin_sql="SELECT * FROM adminTable WHERE user_name = '"+req.body.user_name+"'";
    let query1 = connection.query(check_admin_sql, async(err, results1) => {
        if(err) throw err;
        else{
            if(results1.length>0){
                // compare given password with hashed password
                const passwordCorrect = await bcrypt.compare(req.body.password, results1[0].password);
                if(passwordCorrect){
                    console.log(results1[0].user_name+" admin loggged in successfully. "+results1[0].admin_id);
                    
                    // create token and generate cookie if logged in successfully
                    const token = createAdminToken(results1[0].admin_id);
                    res.cookie('admin_jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    console.log("created token: "+token);
                    console.log(results1[0].user_name+" loggged in successfully.");
                    res.redirect('/adminPannel');
                }
                else{
                    console.log(results1[0].user_name+" Wrong Password.");
                    res.send(results1[0].user_name+" Wrong Password.");
                }
            }
            else{
                console.log(req.body.user_name+" Not Registered.(Not an Admin)");
                res.send(req.body.user_name+" Not Registered.(Not an Admin)");
            }
        }
      });
    // console.log(req.body.email, req.body.password);
}



// go to admin logout directory
module.exports.admin_logout_get=(req, res) => {
    res.cookie('admin_jwt', '', { maxAge: 1 });
    res.redirect('/adminLogin');    
}