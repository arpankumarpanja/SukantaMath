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
module.exports.getAllAnnouncement_get = (req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM announcementTable";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        var rows1=rows;
        res.render('announcement_list', {
            title : 'MANAGE ALL ANNOUNCEMENTS',
            announcements : rows
        });
    });
    // rows1=rows
    // console.log(rows1);
}



// direct to add_pdf page to add a new pdf
module.exports.addAnnouncement_get=(req, res) => {
    res.render('announcement_add', {
        title : 'ADD NEW ANNOUNCEMENT'
    });
}


// perfoming save/add operation to add new entry/record in database
module.exports.saveAnnouncement_post=(req, res) => { 
    // var dt = dateTime.create();
    // var dt_formatted = dt.format('d-m-Y H:M:S');
    var dt_formatted=getDateTime();
    let data = {announcement_title: req.body.announcement_title,
                DateTime: dt_formatted,
            };
    let sql = "INSERT INTO announcementTable SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/announcementList');
    });
    console.log(data);
}


// direct to update_pdf page to update an existing pdf through the pdf_id (by req.param.name method) by get method
module.exports.editAnnouncementByID_get=(req, res) => {
    const Selected_announcementId = req.params.announcementId;
    let sql = `Select * from announcementTable where announcement_id = ${Selected_announcementId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('announcement_edit', {
            title : 'EDIT ANNOUNCEMENT',
            selected_announcement : result[0]
        });
    });
}



// perfoming update operation to update an existing entry/record in database through the pdf_id
module.exports.updateAnnouncementById_post=(req, res) => {
    const announcement_id = req.body.announcement_id;
    var dt = dateTime.create();
    var dt_formatted = dt.format('d-m-Y H:M:S');
    // var dt_formatted=getDateTime();
    let sql = "update announcementTable SET announcement_title='"+req.body.announcement_title+
                "',  DateTime='"+dt_formatted+
                "' where announcement_id ="+announcement_id;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/announcementList');
    });
}


// perfoming delete operation to update an existing entry/record in database through the pdf_id
module.exports.deleteAnnouncementById_get=(req, res) => {
    const Selected_announcementId = req.params.announcementId;
    let sql = `DELETE from announcementTable where announcement_id = ${Selected_announcementId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/announcementList');
        console.log("deleted successfully : "+Selected_announcementId);
    });
}


