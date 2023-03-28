const appErr = require("../utilis/appErr");

const protected =  (req,res,next) => {
      
    if(req.session.userAuth )
    {
        next() ; 
    }
    else
    {
         res.render("users/Unauthorized.ejs"); 
    }

}

module.exports = protected ;  