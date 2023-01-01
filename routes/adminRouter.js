const express = require('express');
const adminRouter = express();
const cookieParser = require('cookie-parser');

const admin_controller = require('../controllers/adminController');
const adminAuthMiddlware = require('../middlewares/adminAuthMiddlware');

adminRouter.use(cookieParser());


// going to admin pannel page
adminRouter.get('/adminPannel', adminAuthMiddlware.requireAdminAuth, admin_controller.admin_panel_get);


// going to Login page
adminRouter.get('/adminLogin',admin_controller.admin_login_get);

// admin login post check user with email/username and password from database
adminRouter.post('/AdminLoginPost', admin_controller.admin_login_post);


//go to admin logout directory
adminRouter.get('/adminLogout', admin_controller.admin_logout_get);


module.exports = adminRouter;