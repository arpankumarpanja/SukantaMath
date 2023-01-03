var dateTime = require('node-datetime');
const connection=require('../dbConfig');


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


// direct to add_pdf page to add a new pdf
module.exports.addPdf_get=(req, res) => {
    res.render('pdf_add', {
        title : 'ADD NEW PDF'
    });
}


// perfoming save/add operation to add new entry/record in database
module.exports.savePdf_post=(req, res) => { 
    var dt = dateTime.create();
    var dt_formatted = dt.format('d-m-Y H:M:S');
    let data = {education_level: req.body.education_level, 
                course_section: req.body.course_section,
                pdf_type: req.body.pdf_type,
                pdf_name: req.body.pdf_name,
                pdf_link: req.body.pdf_link,
                DateTime: dt_formatted
            };
    let sql = "INSERT INTO pdfTable SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/pdfList');
    });
    console.log(data);
}


// direct to update_pdf page to update an existing pdf through the pdf_id (by req.param.name method)
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


// direct to update_pdf page to update an existing pdf through the pdf_id (by req.body.name method)
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
    var dt = dateTime.create();
    var dt_formatted = dt.format('d-m-Y H:M:S');
    let sql = "update pdfTable SET education_level='"+req.body.education_level+
                "',  course_section='"+req.body.course_section+
                "',  pdf_type='"+req.body.pdf_type+
                "',  pdf_name='"+req.body.pdf_name+
                "',  pdf_link='"+req.body.pdf_link+
                "',  DateTime='"+dt_formatted+
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
    const pdf_link = req.body.pdf_link;
    res.render('pdf_viewer', {
        pdf_url:pdf_link
    });
}