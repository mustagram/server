const Post = require("../models/post");

function authorisation(req,res,next)
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

module.exports = authorisation;
