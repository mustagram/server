const Post = require("../models/post");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class PostController
{
    static showAllPosts(req,res,next) // everyone's posts
    {
        Post.find().exec()
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((error) => {
            next(error);
        })
    }

    static showPostById(req,res,next)
    {
        Post.findById(req.params.id)
        .exec()
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((error) => {
            next(error);
        })
    }

    static addPost(req,res,next)
    {
        console.log(req.body);
        
        Post.create(req.body)
        .then((post) => {
            res.status(201).json(post);
        })
        .catch((error) => {
            next(error)
        })

    }

    static deletePost(req,res,next)
    {
        Post.findByIdAndDelete(req.params.id)
        .exec()
        .then(() => {
            res.status(204).json({
                msg: "Delete successful"
            });
        })
        .catch((error) => {
            next(error);
        })
    }

    static likePost(req,res,next)
    {
        Post.findById(req.params.id)
        .exec()
        .then((post) => {
            post.likes.push(ObjectId(req.loggedUser.id));
            return post.save();
        })
        .then(() => {
            res.status(201).json({
                msg: "Like successful"
            });
        })
        .catch((error) => {
            next(error);
        })
    }

    static unlikePost(req,res,next)
    {
        Post.findById(req.params.id)
        .exec()
        .then((post) => {
            post.likes = post.likes.filter(id => id != req.loggedUser.id); 
            return post.save();
        })
        .then(() => {
            res.status(201).json({
                msg: "Like successful"
            });
        })
        .catch((error) => {
            next(error);
        })
    }
}

module.exports = PostController