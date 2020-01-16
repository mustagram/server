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
        Comment.findByIdAndDelete(req.params.id)
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
}

module.exports = CommentController;