
/*const { Router } = require('express');
const router=Router();*/
const express = require('express');
const Router = express();

const announcement_controller = require('../controllers/announcemantController');
const adminAuthMiddlware = require('../middlewares/adminAuthMiddlware');
const requireUserAuth = require('../middlewares/userAuthMiddlware');





// ------------ added admin_auth middewares to all the path to secure the routes only for admin.
// get all pdf
Router.get('/announcementList', adminAuthMiddlware.requireAdminAuth, announcement_controller.getAllAnnouncement_get);


// direct to add_pdf page to add a new pdf
Router.get('/AddAnnouncement', adminAuthMiddlware.requireAdminAuth, announcement_controller.addAnnouncement_get);



// perfoming save/add operation to add new entry/record in database
Router.post('/SaveAnnouncement', adminAuthMiddlware.requireAdminAuth, announcement_controller.saveAnnouncement_post);


// direct to update_pdf page to update an existing pdf through the pdf_id (by req.param.name method)
Router.get('/EditAnnouncement/:announcementId', adminAuthMiddlware.requireAdminAuth, announcement_controller.editAnnouncementByID_get);


// perfoming update operation to update an existing entry/record in database through the pdf_id
Router.post('/UpdateAnnouncement', adminAuthMiddlware.requireAdminAuth, announcement_controller.updateAnnouncementById_post);


// perfoming delete operation to update an existing entry/record in database through the pdf_id
Router.get('/DeleteAnnouncement/:announcementId', adminAuthMiddlware.requireAdminAuth, announcement_controller.deleteAnnouncementById_get);



module.exports = Router;
