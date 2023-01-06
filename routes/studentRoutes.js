const express = require('express');
const Router = express();

const student_controller = require('../controllers/studentController');
const adminAuthMiddlware = require('../middlewares/adminAuthMiddlware');
const UserAuthMiddleware = require('../middlewares/userAuthMiddlware');


// get all the Student details
Router.get('/studentList', adminAuthMiddlware.requireAdminAuth, student_controller.getAllStudents_get);


// direct to update_student form page to update an existing student through the student_id (by req.param.name method)
Router.get('/EditStudent/:studentId', adminAuthMiddlware.requireAdminAuth, student_controller.editStudentByID_get);


// perfoming update operation to update an existing student details/record in database through the student_id
Router.post('/UpdateStudent', adminAuthMiddlware.requireAdminAuth, student_controller.updateStudentById_post);


// perfoming delete operation to update an existing entry/record in database through the pdf_id
Router.get('/DeleteStudent/:studentId', adminAuthMiddlware.requireAdminAuth, student_controller.deleteStudentById_get);



//----------------------------------------------- differen section for user ------------------------------------------
// direct to student profile page to see an existing student details through the student_id by post method
Router.post('/ViewStudentProfile', UserAuthMiddleware.requireAuth, student_controller.viewStudentProfile_post);


// perfoming update operation to update an existing student details/record in database through the student_id
Router.post('/UpdateStudentProfile', UserAuthMiddleware.requireAuth, student_controller.UpdateStudentProfile_post);


module.exports = Router;