var dateTime = require('node-datetime');
const bcrypt = require('bcrypt');
const connection=require('../dbConfig');


// get all the pdfs
module.exports.getAllStudents_get = (req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM studentTable";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('student_list', {
            title : 'MANAGE ALL STUDENTS',
            students : rows
        });
    });
    // rows1=rows
    // console.log(rows1);
}





// direct to update_sstudent form page to update an existing student details through the student_id (by req.param.name method)
module.exports.editStudentByID_get=(req, res) => {
    const Selected_studentId = req.params.studentId;
    let sql = `Select * from studentTable where student_id = ${Selected_studentId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('student_edit', {
            title : 'EDIT STUDENT',
            selected_student : result[0]
        });
    });
}



// perfoming update operation to update an existing student details/record in database through the student_id
module.exports.updateStudentById_post= async(req, res) => {
    const student_id = req.body.student_id;
    // var dt = dateTime.create();
    // var dt_formatted = dt.format('d-m-Y H:M:S');
    let sql = "update studentTable SET first_name='"+req.body.first_name+
                "',  last_name='"+req.body.last_name+
                "',  email='"+req.body.email+
                "',  ph_no='"+req.body.ph_no+
                "',  gurdian_name='"+req.body.gurdian_name+
                "',  gurdian_ph='"+req.body.gurdian_ph+
                "',  gender='"+req.body.gender+
                "',  education_level='"+req.body.education_level+
                "',  course_section='"+req.body.course_section+
                "',  institution='"+req.body.institution+
                "',  address='"+req.body.address+
                "',  permission='"+req.body.permission;
    if(req.body.password !== ""){
        //hashing password
        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(req.body.password, salt);
        sql+="',  password='"+hashed_password;
    }

    sql+= "' where student_id ="+student_id;
    // res.send(req.body.password+" : "+sql);
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/studentList');
    });
}



// perfoming delete operation to an existing entry/record in database through the student_id
module.exports.deleteStudentById_get=(req, res) => {
    const Selected_studentId = req.params.studentId;
    let sql = `DELETE from studentTable where student_id = ${Selected_studentId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/studentList');
        console.log("deleted successfully : "+Selected_studentId);
    });
}