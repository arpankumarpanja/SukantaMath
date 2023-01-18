var dateTime = require('node-datetime');
const bcrypt = require('bcrypt');
const connection=require('../dbConfig');


// get all the students
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



// get the students acording to conditions
module.exports.SearchStudent_post = (req, res) => {
    let sql = "SELECT * FROM studentTable";
    let condition=" WHERE";
    let checker=0;
    // checking if selected education_level
    if(req.body.searched_education_level !== ""){
        condition+=` education_level='${req.body.searched_education_level}'`;
        checker=1;
    }

    // checking if selected course_section
    if(req.body.searched_course_section !== "" && checker==0){
        condition+=` course_section='${req.body.searched_course_section}'`;
        checker=1;
    }
    else if(req.body.searched_course_section !== "" && checker==1){
        condition+=` and course_section='${req.body.searched_course_section}'`;
    }

    // checking if entered student  ID
    if(req.body.searched_student_id !== "" && checker==0){
        condition+=` student_id='${req.body.searched_student_id}'`;
        checker=1;
    }
    else if(req.body.searched_student_id !== "" && checker==1){
        condition+=` and student_id='${req.body.searched_student_id}'`;
    }

    // checking if enterd any pdf_name
    if(req.body.searched_first_name !== "" && checker==0){
        condition+=` first_name LIKE '%${req.body.searched_first_name}%'`;
        checker=1;
    }
    else if(req.body.searched_first_name !== "" && checker==1){
        condition+=` and first_name LIKE '%${req.body.searched_first_name}%'`;
    }

    // checking if any comndition selected then only add the conditions
    if(checker==1){
        sql+=condition;
    }

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
            selected_student : result[0],
            payment : JSON.parse(result[0].payment)
        });
    });
}



// perfoming update operation to update an existing student details/record in database through the student_id
module.exports.updateStudentById_post= async(req, res) => {
    const student_id = req.body.student_id;
    // var dt = dateTime.create();
    // var dt_formatted = dt.format('d-m-Y H:M:S');

    var payment=`{"january":"${req.body.january}","february":"${req.body.february}","march":"${req.body.march}","april":"${req.body.april}","may":"${req.body.may}","june":"${req.body.june}","july":"${req.body.july}","august":"${req.body.august}","september":"${req.body.september}","october":"${req.body.october}","november":"${req.body.november}","december":"${req.body.december}"}`;
    // console.log("payment: "+payment);
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
                "',  permission='"+req.body.permission+
                "',  payment='"+payment;
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




//---------------------------------------- different section for users ----------------------------------------------------
// direct to student profile page to see an existing student details through the student_id by post method (req.body._)
module.exports.viewStudentProfile_post=(req, res) => {
    const Selected_studentId = req.body.student_id;
    let sql = `Select * from studentTable where student_id = ${Selected_studentId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('student_profile', {
            title : 'YOUR PROFILE',
            selected_student : result[0],
            payment : JSON.parse(result[0].payment)
        });
    });
}



// perfoming update operation to update an existing student details/record in database through the student_id
module.exports.UpdateStudentProfile_post= async(req, res) => {
    const student_id = req.body.student_id;
    //hashing password
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(req.body.password, salt);
    update_password_sql = "update studentTable SET password='" + hashed_password + "' where student_id =" + student_id;
    // res.send(req.body.password+" : "+sql);
    let query = connection.query(update_password_sql,(err, results) => {
      if(err) throw err;
      res.redirect('/logout');
    });
}