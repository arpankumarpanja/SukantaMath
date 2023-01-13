const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
// const mysql = require('mysql');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv= require('dotenv').config();


const pdf_routes = require('./routes/pdfRoutes');
const student_routes = require('./routes/studentRoutes');
const Login_Logout_routes = require('./routes/LoginLogoutRoutes');
const admin_routes = require('./routes/adminRouter');
const { requireAuth, checkUser, requireAdminPermission} = require('./middlewares/userAuthMiddlware');


app.use(cookieParser());
//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));




// database connection
// const connection=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'root',
//     database:'node_curd'
// });

// connection.connect(function (error) {
//     if (!!error) console.log(error);
//     else console.log('Database Connected!');
// }); 
const connection=require('./dbConfig');



app.get('*', checkUser);
// Default load page home
app.get('/',(req, res) => {
    res.render('Home',{
        home_mssg: ""
    });    
});





app.use(pdf_routes);
app.use(student_routes);
app.use(Login_Logout_routes);
app.use(admin_routes);


// render courses from database as per education Level and course section
app.get('/course/:EducationLevel/:courseSection', requireAuth, requireAdminPermission, (req, res) => {
    let Education_Level=req.params.EducationLevel;
    let course_section=req.params.courseSection;
    // query execute
    let syllabus_sql = "SELECT * FROM pdfTable where education_level = '"+Education_Level+"' and course_section = '"+course_section+"' and pdf_type = '"+"Syllabus' and pdf_visibility = 'show' order by DateTime DESC";
    let ImportantNotes_sql = "SELECT * FROM pdfTable where education_level = '"+Education_Level+"' and course_section = '"+course_section+"' and pdf_type = '"+"Important Notes' and pdf_visibility = 'show' order by DateTime DESC";
    let SampleQuestion_sql = "SELECT * FROM pdfTable where education_level = '"+Education_Level+"' and course_section = '"+course_section+"' and pdf_type = '"+"Sample Question' and pdf_visibility = 'show' order by DateTime DESC";
    let PreviousYearQuestion_sql = "SELECT * FROM pdfTable where education_level = '"+Education_Level+"' and course_section = '"+course_section+"' and pdf_type = '"+"Previous Year Questions' and pdf_visibility = 'show' order by DateTime DESC";
    let OtherMaterials_sql = "SELECT * FROM pdfTable where education_level = '"+Education_Level+"' and course_section = '"+course_section+"' and pdf_type = '"+"Other Materials' and pdf_visibility = 'show' order by DateTime DESC";

    let query = connection.query(syllabus_sql, (err, syllabus_rows) => {
        if(err) throw err;
        var syllabuses=syllabus_rows;
        let query = connection.query(ImportantNotes_sql, (err, ImportantNotes_rows) => {
            if(err) throw err;
            var ImportantNotes=ImportantNotes_rows;
            let query = connection.query(SampleQuestion_sql, (err, SampleQuestion_rows) => {
                if(err) throw err;
                var SampleQuestions=SampleQuestion_rows;
                let query = connection.query(PreviousYearQuestion_sql, (err, PreviousYearQuestion_rows) => {
                    if(err) throw err;
                    var PreviousYearQuestions=PreviousYearQuestion_rows;
                    let query = connection.query(OtherMaterials_sql, (err, OtherMaterials_rows) => {
                        if(err) throw err;
                        var OtherMaterials=OtherMaterials_rows;
                        res.render('course', {
                            education_level : Education_Level,
                            course_section : course_section,
                            pdfs1 : syllabus_rows,
                            pdfs2 : ImportantNotes_rows,
                            pdfs3 : SampleQuestion_rows,
                            pdfs4 : PreviousYearQuestion_rows,
                            pdfs5 : OtherMaterials_rows
                        });
                    });
                });
            });
        });
    });

    console.log(Education_Level+"   "+course_section);   
});




// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});