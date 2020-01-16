const postsRouter = require("express").Router();
const express = require("express");
postsRouter.use(express.urlencoded({extended:true}));

const gcsUpload = require('gcs-upload');

const upload = gcsUpload({
    limits: {
      fileSize: 5e6 // in bytes
    },
    gcsConfig: {
      keyFilename: './credentials/Mustagram.json',
      bucketName: process.env.BUCKETNAME
    }
})

const PostController = require("../controllers/PostController");

const authorisation = require("../middlewares/authorisation").post_authorisation;

postsRouter.get('/',(req,res,next) => {
    //res.send('Post list');
    PostController.showAllPosts(req,res,next);
});

postsRouter.get('/:id',(req,res,next) => {
    //res.send('Post detail');
    PostController.showPostById(req,res,next);
});

postsRouter.post('/', upload.single('file'), (req,res,next) => {
    //res.send('add Post');
    PostController.addPost(req,res,next);
});

postsRouter.put('/:id', authorisation,(req,res,next) => {
    res.send('update Post');
    //PostController.updatePost(req,res,next);
});

postsRouter.patch('/:id', authorisation, (req,res,next) => {
    res.send('update Post');
    //PostController.updatePost(req,res,next);
});

postsRouter.delete('/:id', authorisation, (req,res,next) => {
    //res.send('delete Post');
    PostController.deletePost(req,res,next);
});

postsRouter.post('/:id/like', authorisation, (req,res,next) => {
    //res.send('like Post');
    PostController.likePost(req,res,next);
});

postsRouter.delete('/:id/like', authorisation, (req,res,next) => {
    //res.send('unlike Post');
    PostController.unlikePost(req,res,next);
});

module.exports = postsRouter;