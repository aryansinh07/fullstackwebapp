const User = require("../../models/user/User");
const bcrypt = require("bcryptjs"); 
const appErr = require("../../utilis/appErr");

const registerCtrl = async (req,res,next)=>{
    const {fullname , email , password , about } = req.body ; 
    console.log(req.body); 
    if(!fullname || !email || !password ||!about)
    {
      return res.render("users/register.ejs",{
        error:"All fields are mandatory"
      }); 
    }
    try {
        const userfound = await User.findOne({email}); 
        if(userfound)
        {
          return res.render("users/register.ejs",{
            error:"Email Already Exist"
          }); 
        }
        const salt = await bcrypt.genSalt(10); 
        const passwordHashed = await bcrypt.hash(password,salt); 
        const userCreated = await User.create({
          fullname ,
          email , 
          password: passwordHashed, 
          about
        }); 
        res.redirect("/api/v1/users/login"); 
    } catch (error) {
        res.json(error); 
    }
}

const loginCtrl = async (req, res , next) => {
    const {email , password} = req.body ;
    console.log(req.body); 
    if(!email || !password)
    {
      return res.render("users/login.ejs",{
        error:"All fields are madatory"
      }); 
    } 
    try {
      const userFound = await User.findOne({email}); 
      if(!userFound)
      {
        return res.render("users/login.ejs",{
          error:"Invalid Login Credentials"
        }); 
      }
      const passCorrect = await bcrypt.compare(password,userFound.password);
      if(!passCorrect)
      {
        return res.render("users/login.ejs",{
          error:"Invalid Login Credentials"
        }); 
      } 
      req.session.userAuth = userFound._id ; 
      res.redirect("/api/v1/users/profile-page"); 

    } catch (error) {
      res.json(error);
    }
}

const userDetailCtrl = async (req, res) => {
    try {
      const userId = req.params.id ; 
      const user = await User.findById(userId); 
      res.render("users/update.ejs", {
        error:"",
        user,
      });
    } catch (error) {
      res.json(error);
    }
}

const profileCtrl = async(req,res)=>{
    try {
       const userId = req.session.userAuth ; 
       const user = await  User.findById(userId).populate("posts").populate("comments"); 

        res.render("users/profile.ejs",{user}); 
    } catch (error) {
        
    }
  }

const profilePhotoCtrl = async (req, res) => {
    
    if(!req.file)
    {
      return res.render("users/uploadprofilephoto.ejs",{
          error:"Please upload the Image"
      }); 
    }
    try {
      const userId = req.session.userAuth ; 
      await User.findByIdAndUpdate(userId,{
        profileImage: req.file.path 
      },{
        new: true 
      }); 
      res.redirect("/api/v1/users/profile-page"); 
    } catch (error) {
      return next(appErr(error.message)); 
    }
  }

const coverPhotoCtrl = async (req, res) => {
  if(!req.file)
    {
      return res.render("users/uploadcoverphoto.ejs",{
          error:"Please upload the Image"
      }); 
    }
    try {
      const UserId = req.session.userAuth ;  
      await User.findByIdAndUpdate(UserId,{
        coverImage: req.file.path 
      },{
        new: true 
      }); 
      res.redirect("/api/v1/users/profile-page"); 
    } catch (error) {
      return next(appErr(error.message)); 
    }
  }

const userPasswordUpdateCtrl = async (req, res , next) => {
    const {password} = req.body ; 
    try {
      if(password)
      {
         const salt = await bcrypt.genSalt(10); 
         const passwordHashed = await bcrypt.hash(password,salt); 
         await User.findByIdAndUpdate(req.params.id,{
          password: passwordHashed
         },{
          new: true 
         }); 
         res.json({
          status: "success",
          msg: "User password updated Successfully",
        });
        res.redirect("/api/v1/users/profile-page");
      }
      
    } catch (error) {
      return next(appErr(error.message)); 
    }
  }

const userProfileUpdateCtrl = async (req, res , next) => {
  const {fullname , email} = req.body ; 
    try {
      if (!fullname || !email) {
        return res.render("users/update.ejs", {
          error: "Please provide details",
          user: "",
        });
      }
      const userfound = await User.findById(req.session.userAuth); 
      const curremail = userfound.email ; 
      if(email!=curremail)
      {
        const emailTaken = await User.findOne({email}); 
        if(emailTaken)
        {
          return res.render("users/update.ejs", {
            error: "Email is taken",
            user: "",
          });
        }
      }
      const user = await User.findByIdAndUpdate(req.session.userAuth,{
        fullname , 
        email 
      },{
        new: true 
      }); 
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
      return res.render("users/update.ejs", {
        error: error.message,
        user: "",
      });
    }
  }

  const logoutCtrl = async (req, res) => {
    
      req.session.destroy(()=>{
           res.redirect("/api/v1/users/login"); 
      }); 
    
  }

module.exports = {
    registerCtrl , 
    loginCtrl , 
    userDetailCtrl , 
    profileCtrl , 
    profilePhotoCtrl , 
    coverPhotoCtrl , 
    userPasswordUpdateCtrl , 
    userProfileUpdateCtrl , 
    logoutCtrl 
}