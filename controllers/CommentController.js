const Comment = require("../models/comment");
const Post = require("../models/post");

class CommentController
{
    static showAllComments(req,res,next) // user own comments
    {
        Comment.find({
            user: req.loggedUser.id
        }).exec()
        .then((comments) => {
            res.status(200).json(comments);
        })
        .catch((error) => {
            next(error);
        })
    }

    static showCommentById(req,res,next)
    {
        Comment.findById(req.params.id)
        .exec()
        .then((comment) => {
            res.status(200).json(comment);
        })
        .catch((error) => {
            next(error);
        })
    }

    static addComment(req,res,next)
    {
        let postId = req.body.post;
        let data = _.pick(req.body,'text');
        data.user = req.loggedUser.id;
        let newComment;

        Comment.create(data)
        .then((comment) => {
            newComment = comment;
            console.log(comment);
            return Post.findById(postId).exec();
        })
        .then((post) => {
            if(post)
            {
                post.comments.push(newComment._id);
                return post.save();
            }
            else
            {
                next({status: 404,message: "Not found"})
            }
        })
        .then((post) => {
            res.status(200).json({
                post: post,
                comment: newComment
            });
        })
        .catch((error) => {
            next(error)
        })

    }

    static deleteComment(req,res,next)
    {
        let postId;
        Comment.findById(req.params.id)
        .exec()
        .then((comment) => {
            if(!comment)
            {
                next({status: 404,message: "Not found"})
            }
            else
            {
                //get origin post id
                postId = comment.post;

                //delete comment
                return Comment.findByIdAndDelete(req.params.id).exec();
            }
            
        })        
        .then(() => {
            //get origin post
            return Post.findById(postid).exec();
        })
        .then((post) => {
            //remove comment from comments array
            post.comments = post.comments.filter(id => id.toString() != req.params.id);
            return post.save();
        })
        .then(() => {
            res.status(201).json({
                msg: "Delete comment successful"
            });
        })
        .catch((error) => {
            next(error);
        })
    }
}

module.exports = CommentController;