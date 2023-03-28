const express = require("express"); 
const protected = require("../../Middlewares/protected"); 
const commentsRoute = express.Router(); 
const {
  createCommentCtrl , 
    fetchCommentPost , 
    deleteCommentCtrl , 
    updateCommentCtrl 
} = require("../../controllers/comments/Comments"); 
commentsRoute.post("/:id", protected , createCommentCtrl);
  
  // to fetch comments on a post 
commentsRoute.get("/:id", fetchCommentPost);

  // to delete a comment
commentsRoute.delete("/:id", protected , deleteCommentCtrl);
  
  //to update a comment
commentsRoute.put("/:id", protected ,  updateCommentCtrl);

  module.exports = commentsRoute ; 