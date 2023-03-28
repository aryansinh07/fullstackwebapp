const express = require("express"); 
const postRoute = express.Router(); 
const protected = require("../../Middlewares/protected"); 
const storage = require("../../config/Cloudinary"); 
const multer = require("multer"); 
const {createPostCtrl , 
  fetchallPostCtrl , 
  fetchSinglePostCtrl , 
  updatePostCtrl , 
  deletePostCtrl } = require("../../controllers/posts/Posts"); 

const upload = multer({
  storage
}); 

postRoute.get("/create",(req,res)=>{
  res.render("posts/createpostform.ejs",{error:""}); 
})

postRoute.post("/" , protected , upload.single("postImage") , createPostCtrl); 

  //to fetch all posts
postRoute.get("/" , fetchallPostCtrl); 

  //to view a post
postRoute.get("/:id", fetchSinglePostCtrl); 

  //to update a post

postRoute.put("/:id", protected , upload.single("postImage"), updatePostCtrl);

  // to delete a post 
postRoute.delete("/:id", protected ,  deletePostCtrl); 

module.exports = postRoute ; 
