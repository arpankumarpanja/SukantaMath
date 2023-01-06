
/*const { Router } = require('express');
const router=Router();*/
const express = require('express');
const studentRouter = express();

const student_controller = require('../controllers/LoginLogoutController');


// going to Register form page
studentRouter.get('/register',student_controller.register_get);



// perfoming save/add operation to add new entry/record in database
studentRouter.post('/registerPost',student_controller.register_post);


// going to Login page
studentRouter.get('/login',student_controller.login_get);



// checking email and password from database already registered
studentRouter.post('/loginPost',student_controller.login_post);


// going to forgot password page
studentRouter.get('/ForgotPasswordGet',student_controller.forgotPassword_get);

// checking email and date of birth from database already registered to reset password
studentRouter.post('/ForgotPasswordPost',student_controller.ForgotPasswordPost);


studentRouter.get('/logout',student_controller.logout_get);


module.exports = studentRouter;
