const commentsRouter = require("express").Router();
const express = require("express");
commentsRouter.use(express.urlencoded({extended:true}));

const CommentController = require("../controllers/CommentController");

const authorisation = require("../middlewares/authorisation").comment_authorisation;

commentsRouter.get('/',(req,res,next) => {
    res.send('Comment list');
    //CommentController.showAllComments(req,res,next);
});

commentsRouter.get('/:id',(req,res,next) => {
    res.send('Comment detail');
    //CommentController.showCommentById(req,res,next);
});

commentsRouter.post('/', (req,res,next) => {
    res.send('add Comment');
    //CommentController.addComment(req,res,next);
});

commentsRouter.put('/:id', authorisation, (req,res,next) => {
    res.send('update Comment');
    //CommentController.updateComment(req,res,next);
});

commentsRouter.patch('/:id', authorisation, (req,res,next) => {
    res.send('update Comment');
    //CommentController.updateComment(req,res,next);
});

commentsRouter.delete('/:id', authorisation, (req,res,next) => {
    res.send('delete Comment');
    //CommentController.deleteComment(req,res,next);
});

module.exports = commentsRouter;