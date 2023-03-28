const Comment = require("../../models/comment/Comment");
const User = require("../../models/user/User"); 
const Post = require("../../models/post/Post"); 
const appErr = require("../../utilis/appErr");
const createCommentCtrl = async (req, res , next) => {
    const {message} = req.body ; 
    try {
      const post = await Post.findById(req.params.id); 
      const comment = await Comment.create({
        user: req.session.userAuth , 
        message , 
        post: post._id 
      }); 
      post.comments.push(comment._id); 
      const user = await User.findById(req.session.userAuth); 
      user.comments.push(comment._id); 
      await post.save({validateBeforeSave: false }); 
      await comment.save({validateBeforeSave: false}); 

      res.redirect(`/api/v1/posts/${post._id}`); 
    } catch (error) {
      next(appErr(error.message)); 
    }
  }

const fetchCommentPost = async (req, res , next ) => {
    try { 
      const comment = await Comment.findById(req.params.id); 
      res.render("comments/updatecomment.ejs",{
        comment,
        error:""
      }); 
    } catch (error) {
      next(appErr(error.message)); 
    }
  }

const deleteCommentCtrl = async (req, res , next) => {
    try {
      const commentfound = await Comment.findById(req.params.id); 
      if(commentfound.user.toString()!=req.session.userAuth.toString())
      {
        return next(appErr("You are not Authorized to delete this comment")); 
      }
      await Comment.findByIdAndDelete(req.params.id); 
      res.redirect(`/api/v1/posts/${req.query.postid}`) ; 
    } catch (error) {
      next(appErr(error.message)); 
    }
  }

const updateCommentCtrl = async (req, res , next) => {
    const {message} = req.body ; 
    try {
      const comment = await Comment.findById(req.params.id); 
      if(comment.user.toString()!=req.session.userAuth.toString())
      {
        return next(appErr("You are not Authorized to update this Comment")); 
      }
      await Comment.findByIdAndUpdate(req.params.id,{
        message
      },
      {
        new: true 
      }); 
      res.redirect(`/api/v1/posts/${req.query.postid}`) ;
    } catch (error) {
      next(appErr(error.message)); 
    }
  }

module.exports = {
    createCommentCtrl , 
    fetchCommentPost , 
    deleteCommentCtrl , 
    updateCommentCtrl 
}