const express = require("express"); 
const storage = require("../../config/Cloudinary");
const multer = require("multer"); 
const userRoute = express.Router(); 
const {registerCtrl , 
  loginCtrl , 
  userDetailCtrl , 
  profileCtrl , 
  profilePhotoCtrl , 
  coverPhotoCtrl , 
  userPasswordUpdateCtrl , 
  userProfileUpdateCtrl , 
  logoutCtrl } = require("../../controllers/user/Users"); 

const protected = require("../../Middlewares/protected"); 
const upload = multer({storage}); 

//POST/api/v1/users/login
//forms
//login form 
userRoute.get("/login",(req,res)=>{
     res.render("users/login.ejs",{
      error:""
     }); 
}); 

//register form 
userRoute.get("/register",(req,res)=>{
  res.render("users/register.ejs",{
    error:""
  }); 
}); 

userRoute.get("/upload-profile-photo-form",(req,res)=>{
  res.render("users/uploadprofilephoto.ejs",{
    error:""
  }); 
}); 

userRoute.get("/upload-cover-photo-form",(req,res)=>{
  res.render("users/uploadcoverphoto.ejs",{
    error:""
  }); 
}); 

//userRoute.get("/update-user-form",(req,res)=>{
 // res.render("users/update.ejs"); 
//}); 



//API
//for user login api
userRoute.post("/login", loginCtrl);

//for user registration api
userRoute.post("/register" , registerCtrl); 


// to view the profile of a particular profile
userRoute.get("/profile-page", protected ,  profileCtrl); 

  //PUT/api/v1/users/profile-photo-upload/:id
userRoute.put("/profile-photo-upload", protected , upload.single('profile') , profilePhotoCtrl);

  
  //PUT/api/v1/users/cover-photo-upload/:id
  userRoute.put("/cover-photo-upload", protected , upload.single("cover") , coverPhotoCtrl);
  
  //PUT/api/v1/users/update-password/:id
  userRoute.put("/update-password/:id", userPasswordUpdateCtrl);

  // to update the user profile
  userRoute.put("/update", userProfileUpdateCtrl);

  //GET/api/v1/users/logout
  userRoute.get("/logout", logoutCtrl);

  userRoute.get("/:id", userDetailCtrl);
  
  module.exports = userRoute ; 