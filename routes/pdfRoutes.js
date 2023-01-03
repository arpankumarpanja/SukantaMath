
/*const { Router } = require('express');
const router=Router();*/
const express = require('express');
const Router = express();

const pdf_controller = require('../controllers/pdfController');
const adminAuthMiddlware = require('../middlewares/adminAuthMiddlware');



// get all the pdfs
Router.get('/pdfList', adminAuthMiddlware.requireAdminAuth, pdf_controller.getAllPdf_get);



// ------------ added admin_auth middewares to all the path to secure the routes only for admin.

// direct to add_pdf page to add a new pdf
Router.get('/AddPdf', adminAuthMiddlware.requireAdminAuth, pdf_controller.addPdf_get);



// perfoming save/add operation to add new entry/record in database
Router.post('/SavePdf', adminAuthMiddlware.requireAdminAuth, pdf_controller.savePdf_post);


// direct to update_pdf page to update an existing pdf through the pdf_id (by req.param.name method)
Router.get('/EditPdf/:pdfId', adminAuthMiddlware.requireAdminAuth, pdf_controller.editPdfByID_get);

// direct to update_pdf page to update an existing pdf through the pdf_id (by req.body.name method)
// ---------------testing purpose-------------------
Router.post('/EditPdf', adminAuthMiddlware.requireAdminAuth, pdf_controller.editPdfByID_post);


// perfoming update operation to update an existing entry/record in database through the pdf_id
Router.post('/UpdatePdf', adminAuthMiddlware.requireAdminAuth, pdf_controller.updatePdfById_post);


// perfoming delete operation to update an existing entry/record in database through the pdf_id
Router.get('/DeletePdf/:pdfId', adminAuthMiddlware.requireAdminAuth, pdf_controller.deletePdfById_get);







// performing rendering google drive pdf to iframe to hide the google drive link
Router.post('/ViewPdf', pdf_controller.viewPdfByLink_post);


module.exports = Router;
