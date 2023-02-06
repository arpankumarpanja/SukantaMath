var dateTime = require('node-datetime');
const connection=require('../dbConfig');


// ----------------------------function to get local time --------------------------------
function getDateTime() {
    // create Date object for current location
    const city = 'Bombay';
    const offset = 5.5;
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000 * offset));

    // return time as a string
    return nd.toLocaleString();
}

// get all the pdfs
module.exports.getAllPdf_get = (req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM pdfTable";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        var rows1=rows;
        res.render('pdf_list', {
            title : 'MANAGE ALL PDFS',
            pdfs : rows
        });
    });
    // rows1=rows
    // console.log(rows1);
}


// get pdfs acording to condition SearchPdf_post
module.exports.SearchPdf_post = (req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM pdfTable";
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

    // checking if selected pdf_type
    if(req.body.searched_pdf_type !== "" && checker==0){
        condition+=` pdf_type='${req.body.searched_pdf_type}'`;
        checker=1;
    }
    else if(req.body.searched_pdf_type !== "" && checker==1){
        condition+=` and pdf_type='${req.body.searched_pdf_type}'`;
    }

    // checking if enterd any pdf_name
    if(req.body.searched_pdf_name !== "" && checker==0){
        condition+=` pdf_name LIKE '%${req.body.searched_pdf_name}%'`;
        checker=1;
    }
    else if(req.body.searched_pdf_name !== "" && checker==1){
        condition+=` and pdf_name LIKE '%${req.body.searched_pdf_name}%'`;
    }

    // checking if any comndition selected then only add the conditions
    if(checker==1){
        sql+=condition;
    }

    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        var rows1=rows;
        res.render('pdf_list', {
            title : 'MANAGE ALL PDFS',
            pdfs : rows
        });
    });
} 



// direct to add_pdf page to add a new pdf
module.exports.addPdf_get=(req, res) => {
    res.render('pdf_add', {
        title : 'ADD NEW PDF'
    });
}


// perfoming save/add operation to add new entry/record in database
module.exports.savePdf_post=(req, res) => { 
    // var dt = dateTime.create();
    // var dt_formatted = dt.format('d-m-Y H:M:S');
    var dt_formatted=getDateTime();
    let data = {education_level: req.body.education_level, 
                course_section: req.body.course_section,
                pdf_type: req.body.pdf_type,
                pdf_name: req.body.pdf_name,
                pdf_link: req.body.pdf_link,
                DateTime: dt_formatted,
                pdf_visibility: req.body.pdf_visibility
            };
    let sql = "INSERT INTO pdfTable SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/pdfList');
    });
    console.log(data);
}


// direct to update_pdf page to update an existing pdf through the pdf_id (by req.param.name method) by get method
module.exports.editPdfByID_get=(req, res) => {
    const Selected_pdfId = req.params.pdfId;
    let sql = `Select * from pdfTable where pdf_id = ${Selected_pdfId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('pdf_edit', {
            title : 'EDIT PDF',
            selected_pdf : result[0]
        });
    });
}


// direct to update_pdf page to update an existing pdf through the pdf_id (by req.body.name method) by post method
// ---------------testing purpose-------------------
module.exports.editPdfByID_post=(req, res) => {
    const Selected_pdfId = req.body.pdf_id;
    let sql = `Select * from pdfTable where pdf_id = ${Selected_pdfId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('pdf_edit', {
            title : 'EDIT PDF',
            selected_pdf : result[0]
        });
    });
}



// perfoming update operation to update an existing entry/record in database through the pdf_id
module.exports.updatePdfById_post=(req, res) => {
    const pdf_id = req.body.pdf_id;
    // var dt = dateTime.create();
    // var dt_formatted = dt.format('d-m-Y H:M:S');
    var dt_formatted=getDateTime();
    let sql = "update pdfTable SET education_level='"+req.body.education_level+
                "',  course_section='"+req.body.course_section+
                "',  pdf_type='"+req.body.pdf_type+
                "',  pdf_name='"+req.body.pdf_name+
                "',  pdf_link='"+req.body.pdf_link+
                "',  DateTime='"+dt_formatted+
                "',  pdf_visibility='"+req.body.pdf_visibility+
                "' where pdf_id ="+pdf_id;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/pdfList');
    });
}


// perfoming delete operation to update an existing entry/record in database through the pdf_id
module.exports.deletePdfById_get=(req, res) => {
    const Selected_pdfId = req.params.pdfId;
    let sql = `DELETE from pdfTable where pdf_id = ${Selected_pdfId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/pdfList');
        console.log("deleted successfully : "+Selected_pdfId);
    });
}




// performing rendering google drive pdf to iframe
module.exports.viewPdfByLink_post=(req, res) => {
    const Selected_pdfId = req.body.pdf_link;
    let sql = `Select pdf_link from pdfTable where pdf_id = ${Selected_pdfId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        // console.log("pdf link: "+result[0].pdf_link);
        res.render('pdf_viewer', {
            pdf_url : result[0].pdf_link
        });
    });
}