var dateTime = require('node-datetime');
const connection=require('../dbConfig');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');




// create json web token
const maxAge = 5 * 60 * 60;    //(5 hours set for now) for 3 days 3 * 24 * 60 * 60, for 5 minute 5*60  
const createToken = (id) => {
  return jwt.sign({ id }, 'user secret code - chatra', {
    expiresIn: maxAge
  });
};


  // ----------------------------function to get local time --------------------------------
  function getDateTime() {
    // create Date object for current location
    const city='Bombay';
    const offset=5.5;
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));

    // return time as a string
    return nd.toLocaleString();
}

//----------------- function to send registration success mail -----------------------------
function sendRegistrationSuccesMail(data, email, password) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mathsukanta2022@gmail.com',
            pass: 'aakshjrdowydxirt'
        }
    });

    var mailOptions = {
        from: 'mathsukanta2022@gmail.com',
        to: email,
        bcc: 'arpankumarpanja@gmail.com',
        subject: 'Registration to AlphaBitaGama',
        text: 'That was easy!',
        html: `<h1>Dear, ${data.first_name+" "+data.last_name}</h1>
                <h3>You have Successfully Registered with these Details:</h3>
                <p>Phone No: ${data.ph_no}</p>
                <p>Gurdian Name: ${data.gurdian_name}</p>
                <p>Gurdian Phone No: ${data.gurdian_ph}</p>
                <p>Gender: ${data.gender}</p>
                <p>Date of Birth: ${data.date_of_birth}</p>
                <p>Education Level: ${data.education_level}</p>
                <p>Course Section: ${data.course_section}</p>
                <p>Institution: ${data.institution}</p>
                <p>Address: ${data.address}</p>
                <p>Registration Time: ${data.reg_DateTime}</p>

                <div style="text-align: center; border: 2px solid black; padding:5px; background-color:LightGreen;">
                    </br></br><h3>This is Your Login Credentials:</h3>
                    <p>email: ${data.email}</p>
                    <p>password: ${password}</p>
                </div>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//----------------- function to send new password for forgot password mail -----------------------------
async function sendNewPasswordMail(data, email, password) {
    console.log('initiating send of forgot password mail....');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        secureConnection: true,
        auth: {
            user: process.env.email_id,
            pass: process.env.email_password
        },
        tls: {
            rejectUnauthorized : false
        }
    });

    var mailOptions = {
        from: 'mathsukanta2022@gmail.com',
        to: email,
        bcc: 'mathsukanta2022@gmail.com',
        subject: 'New Password Generated for AlphaBitaGama',
        text: 'That was easy!',
        html: `<h1>Dear, ${data.first_name+" "+data.last_name}</h1>
                <h3>You request for getting new password has Accepted:</h3>

                <div style="text-align: center; border: 2px solid black; padding:5px; background-color:LightGreen;">
                    </br></br><h3>This is Your Login Credentials With NEW PASSWORD:</h3>
                    <p>email: ${data.email}</p>
                    <p>password: ${password}</p>
                </div>`
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            console.log("mail not sent");
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}




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
                // var dt = dateTime.create();
                // var dt_formatted = dt.format('d-m-Y H:M:S');
                //------------ get local date time --------------------
                var local_date_time=getDateTime();

                // getting random 6 digit number password
                let random_password = Math.floor(100000 + Math.random() * 900000).toString();
                console.log("random_password for registration : "+random_password);
                //hashing password
                const salt = await bcrypt.genSalt();
                const hashed_password = await bcrypt.hash(random_password, salt);
                let data = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    ph_no: req.body.ph_no,
                    gurdian_name: req.body.gurdian_name,
                    gurdian_ph: req.body.gurdian_ph,
                    gender: req.body.gender,
                    date_of_birth: req.body.date_of_birth,
                    education_level: req.body.education_level,
                    course_section: req.body.course_section,
                    institution: req.body.institution,
                    address: req.body.address,
                    password: hashed_password,
                    reg_DateTime: local_date_time,
                    permission: "Decline"
                };
                let sql = "INSERT INTO studentTable SET ?";
                let query = connection.query(sql, data, (err, results) => {
                    if (err) throw err;
                    console.log(req.body.email+" registerd successfully.");
                    // res.send(req.body.email+" Registtered successfully.");
                    sendRegistrationSuccesMail(data,data.email,random_password);
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




// go to forgot password form page
module.exports.forgotPassword_get=(req, res) => {
    res.render('forgot_password');    
}


// login post check user with email and date of birth from database to get a new password
module.exports.ForgotPasswordPost=async (req, res) => { 
    let check_email_sql="SELECT * FROM studentTable WHERE email = '"+req.body.email+"'";
    let query1 = connection.query(check_email_sql, async(err, results1) => {
        if(err) throw err;
        else{
            if(results1.length>0){
                // compare given date-of-birth with the fetched date-of birth
                const date_of_birth=req.body.date_of_birth;
                if(date_of_birth===results1[0].date_of_birth){
                    console.log(results1[0].email+" Date of Birth Matched");
                    let random_password = Math.floor(100000 + Math.random() * 900000).toString();
                    console.log("New random_password for forgot password : " + random_password);
                    //hashing password
                    const salt = await bcrypt.genSalt();
                    const new_hashed_password = await bcrypt.hash(random_password, salt);
                    let forgot_password_sql = "update studentTable SET password='"+new_hashed_password+"' where student_id ="+results1[0].student_id;
                    let query = connection.query(forgot_password_sql, (err, results) => {
                        if (err) throw err;
                        sendNewPasswordMail(results1[0], results1[0].email, random_password);
                        console.log("redirect to login page");
                        res.redirect('/login');
                    });
                    
                    // res.send(results1[0].email+" loggged in successfully.");
                }
                else{
                    console.log(results1[0].email+" Date of Birth does not match.");
                    res.send(results1[0].email+" Date of Birth does not match.");
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