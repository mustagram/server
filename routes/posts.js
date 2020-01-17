const postsRouter = require("express").Router();
const express = require("express");
postsRouter.use(express.urlencoded({extended:true}));

const gcsUpload = require('gcs-upload');

const upload = gcsUpload({
    limits: {
      fileSize: 50e6 // in bytes
    },
    gcsConfig: {
      keyFilename: process.env.CREDENTIAL_FILE,
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

postsRouter.post('/:id/like', (req,res,next) => {
    //res.send('like Post');
    PostController.likePost(req,res,next);
});

postsRouter.delete('/:id/like', (req,res,next) => {
    //res.send('unlike Post');
    PostController.unlikePost(req,res,next);
});

postsRouter.get('/:id/comments', (req,res,next) => {
    res.send('view Post comments');
    //PostController.showPostComments(req,res,next);
});

postsRouter.post('/:id/comments', (req,res,next) => {
    res.send('add Post comment');
    //PostController.commentPost(req,res,next);
});

module.exports = postsRouter;