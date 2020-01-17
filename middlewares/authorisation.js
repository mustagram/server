const Post = require("../models/post");
const Comment = require("../models/comment");

function post_authorisation(req,res,next)
{    
    Post.findById(req.params.id)
    .then((post) => {
        if(post.user.toString() != req.loggedUser.id)
        {
            next({status: 403, message: "Not authorised"});
        }
        else
        {
            next();
        }
    })
    .catch((err) => {
        next(err);
    });
}

function comment_authorisation(req,res,next)
{    
    Comment.findById(req.params.id)
    .then((comment) => {
        if(comment.user.toString() != req.loggedUser.id)
        {
            next({status: 403, message: "Not authorised"});
        }
        else
        {
            next();
        }
    })
    .catch((err) => {
        next(err);
    });
}

module.exports = {
    post_authorisation,
    comment_authorisation
};
