const jwt = require('jsonwebtoken');

const connection=require('../dbConfig');


const requireAuth = (req, res, next) => {
    const token = req.cookies.student_jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'user secret code - chatra', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log("decoded token verified: " + decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};



// check wheather a user got the permission or approval to use the website or not
// then checking wheather the student belongs to this education level and course section or not
const requireAdminPermission = (req, res, next) => {
  const token = req.cookies.student_jwt;
  let Education_Level=req.params.EducationLevel;
  let course_section=req.params.courseSection;
  if (token) {
    jwt.verify(token, 'user secret code - chatra', async (err, decodedToken) => {
      if (err) {
        console.log("requireAdminPermission Error: "+err);
        res.redirect('/');
      } else {
          console.log("decodedToken: "+decodedToken.id);
          let permission_sql="SELECT * FROM studentTable WHERE student_id = "+decodedToken.id+"";
          let query1 = connection.query(permission_sql, async(err, result) => {
              if(err) throw err;
              else{
                // checking admin permission
                if(result[0].permission==="Approve"){
                    console.log("Permission status: "+result[0].permission);
                    // checking course the student belongs to
                    if(Education_Level===result[0].education_level && course_section===result[0].course_section){
                      console.log(result[0].first_name+" "+result[0].last_name+" is a student of "+result[0].education_level+"-"+result[0].course_section);
                      next();
                    }
                    else{
                      res.send(result[0].first_name+" "+result[0].last_name+" is NOT a student of "+Education_Level+"->"+course_section);
                    }
                  }
                else{
                  res.send("Permission status: "+result[0].permission+"\nAsk your Teacher to get permission........");
                }
              }
            });
      }
    });
  } else {
    res.redirect('/login');
    // next();
  }
};






// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.student_jwt;
    if (token) {
      jwt.verify(token, 'user secret code - chatra', async (err, decodedToken) => {
        if (err) {
          res.locals.student_user = null;
          next();
        } else {
            console.log("decodedToken: "+decodedToken.id);
            let firstName_sql="SELECT * FROM studentTable WHERE student_id = "+decodedToken.id+"";
            let query1 = connection.query(firstName_sql, async(err, result) => {
                if(err) throw err;
                else{
                    res.locals.user = result.first_name;
                    console.log("First Name: "+result[0].first_name);
                    res.locals.student_user = result[0];
                    next();
                }
              });
        //   let user = await User.findById(decodedToken.id);
        //   res.locals.user = user;
        }
      });
    } else {
      res.locals.student_user = null;
      next();
    }
  };
  




module.exports = { requireAuth, checkUser, requireAdminPermission };