const Post = require("../../models/post/Post"); 
const User = require("../../models/user/User"); 
const appErr = require("../../utilis/appErr");

const createPostCtrl = async (req,res,next)=>{
    const {title , description , category } = req.body ; 
    try {
      if(!title || !description || !category)
      {
         res.render("posts/createpostform.ejs",{error:"All fields are mandatory"}); 
      }
      const userId = req.session.userAuth ; 
      const userFound = await User.findById(userId); 
      const postCreated = await Post.create({
        title , 
        description , 
        category , 
        user: userId , 
        image: req.file.path 
      }); 
      await userFound.posts.push(postCreated._id); 
      userFound.save() ; 
      res.redirect("/api/v1/users/profile-page"); 
    } catch (error) {
        return next(appErr(error.message));  
    }
  } 

const fetchallPostCtrl = async (req,res,next)=>{
    try {
        const post = await Post.find().populate("comments").populate("user") ; 
        res.json(
            {
                status:"Success",
                data : post 
            }
        )
    } catch (error) {
        return next(appErr(error.message));  
    }
  }

const fetchSinglePostCtrl = async(req,res,next)=>{
    try {
        const post = await Post.findById(req.params.id).populate({
          path:"comments",
          populate:{
            path:"user"
          }
        }).populate("user"); 
        res.render("posts/postDetails.ejs",{error:"",post}); 
    } catch (error) {
        return next(appErr(error.message)); 
    }
}

const updatePostCtrl = async (req, res) => {
    const {title , description , category } = req.body ; 
    if(!title || !description || !category)
      {
        return next(appErr("All fields are mandatory")); 
      }
    try {
      const post = await Post.findById(req.params.id);  
      if(post.user.toString()!=req.session.userAuth.toString())
      {
        return next(appErr("You are not authorized to Update this Post..")); 
      }
      const postUpdated = await Post.findByIdAndUpdate(req.params.id,{
        title , 
        description , 
        category , 
        image: req.file.path , 
      }); 

      res.json({
        status: "success",
        msg: postUpdated,
      });
      
    } catch (error) {
      res.json(error);
    }
  }

const deletePostCtrl = async (req,res)=>{
    try {
      const post = await Post.findById(req.params.id); 
      if(post.user.toString()!==req.session.userAuth.toString())
      {
        return res.render("posts/postDetails.ejs",{
          error:"You are not Authorized to Delete this Post",
          post
        }); 
      }
      //const UserFound = await User.findById(post.user);
      await Post.findByIdAndDelete(req.params.id);
      /*for( var i = 0; i < UserFound.posts.length; i++){ 
    
        if ( UserFound.posts[i].toString() === req.params.id) { 
    
            UserFound.posts.splice(i, 1); 
        }
        
    } */ 
      res.redirect("/"); 
      } catch (error) {
        return res.render("posts/postDetails.ejs",{
          error:error.message,
          post
        }); 
      }
  }

module.exports = {
    createPostCtrl , 
    fetchallPostCtrl , 
    fetchSinglePostCtrl , 
    updatePostCtrl , 
    deletePostCtrl 
}