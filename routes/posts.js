const postsRouter = require("express").Router();
const express = require("express");
postsRouter.use(express.urlencoded({extended:true}));

//const authorisation = require("../middlewares/authorisation");

postsRouter.get('/',(req,res) => {
    res.send('Post list');
    //PostController.showAllPosts(req,res);
});

postsRouter.get('/:id' /*,authorisation*/ ,(req,res) => {
    res.send('Post detail');
    //PostController.showPostById(req,res);
});

postsRouter.post('/',(req,res) => {
    res.send('add Post');
    //PostController.addPost(req,res);
});

postsRouter.put('/:id' /*,authorisation*/ ,(req,res) => {
    res.send('update Post');
    //PostController.updatePost(req,res);
});

postsRouter.patch('/:id' /*,authorisation*/ ,(req,res) => {
    res.send('update Post');
    //PostController.updatePost(req,res);
});

postsRouter.delete('/:id' /*,authorisation*/ ,(req,res) => {
    res.send('delete Post');
    //PostController.deletePost(req,res);
});

module.exports = postsRouter;