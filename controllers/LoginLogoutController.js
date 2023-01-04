var dateTime = require('node-datetime');
const connection=require('../dbConfig');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





// create json web token
const maxAge = 5 * 60 * 60;    //(5 hours set for now) for 3 days 3 * 24 * 60 * 60, for 5 minute 5*60  
const createToken = (id) => {
  return jwt.sign({ id }, 'user secret code - chatra', {
    expiresIn: maxAge
  });
};



// go to register form page
module.exports.register_get=(req, res) => {
    res.render('register');
}

// go to login form page
module.exports.login_get=(req, res) => {
    res.render('login');    
}


// add or register student details to database
module.exports.register_post=async (req, res) => { 
    let check_email_sql="SELECT * FROM studentTable WHERE email = '"+req.body.email+"'";
    let query1 = connection.query(check_email_sql, async(err, results1) => {
        if(err) throw err;
        else{
            if(results1.length>0){
                console.log(results1[0].email+" already registerd.");
                res.send(results1[0].email+" already registerd.");
            }
            else {
                var dt = dateTime.create();
                var dt_formatted = dt.format('d-m-Y H:M:S');
                //hashing password
                const salt = await bcrypt.genSalt();
                const hashed_password = await bcrypt.hash(req.body.password, salt);
                let data = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    ph_no: req.body.ph_no,
                    gurdian_name: req.body.gurdian_name,
                    gurdian_ph: req.body.gurdian_ph,
                    gender: req.body.gender,
                    education_level: req.body.education_level,
                    course_section: req.body.course_section,
                    institution: req.body.institution,
                    address: req.body.address,
                    password: hashed_password,
                    reg_DateTime: dt_formatted,
                    permission: "Decline"
                };
                let sql = "INSERT INTO studentTable SET ?";
                let query = connection.query(sql, data, (err, results) => {
                    if (err) throw err;
                    console.log(req.body.email+" registerd successfully.");
                    // res.send(req.body.email+" Registtered successfully.");
                    res.redirect('/login');
                });
                console.log(data);
            }
        }
      });
}


// login post check user with email and password from database
module.exports.login_post=async (req, res) => { 
    let check_email_sql="SELECT * FROM studentTable WHERE email = '"+req.body.email+"'";
    let query1 = connection.query(check_email_sql, async(err, results1) => {
        if(err) throw err;
        else{
            if(results1.length>0){
                // compare given password with hashed password
                const passwordCorrect = await bcrypt.compare(req.body.password, results1[0].password);
                if(passwordCorrect){
                    console.log(results1[0].email+" loggged in successfully. "+results1[0].student_id);
                    
                    // create token and generate cookie if logged in successfully
                    const token = createToken(results1[0].student_id);
                    res.cookie('student_jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    console.log("created student_token: "+token);
                    res.redirect('/');
                    // res.send(results1[0].email+" loggged in successfully.");
                }
                else{
                    console.log(results1[0].email+" Wrong Password.");
                    res.send(results1[0].email+" Wrong Password.");
                }
            }
            else{
                console.log(req.body.email+" Not Registered.");
                res.send(req.body.email+" Not Registered.");
            }
        }
      });
    // console.log(req.body.email, req.body.password);
}



// go to logout directory
module.exports.logout_get=(req, res) => {
    res.cookie('student_jwt', '', { maxAge: 1 });
    res.redirect('/');    
}