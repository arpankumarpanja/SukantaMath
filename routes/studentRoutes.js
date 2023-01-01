const express = require('express');
const Router = express();

const student_controller = require('../controllers/studentController');
const adminAuthMiddlware = require('../middlewares/adminAuthMiddlware');


// get all the Student details
Router.get('/studentList', adminAuthMiddlware.requireAdminAuth, student_controller.getAllStudents_get);


// direct to update_student form page to update an existing student through the student_id (by req.param.name method)
Router.get('/EditStudent/:studentId', adminAuthMiddlware.requireAdminAuth, student_controller.editStudentByID_get);


// perfoming update operation to update an existing student details/record in database through the student_id
Router.post('/UpdateStudent', adminAuthMiddlware.requireAdminAuth, student_controller.updateStudentById_post);


// perfoming delete operation to update an existing entry/record in database through the pdf_id
Router.get('/DeleteStudent/:studentId', adminAuthMiddlware.requireAdminAuth, student_controller.deleteStudentById_get);


module.exports = Router;