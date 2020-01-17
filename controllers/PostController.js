const Post = require("../models/post");
const Comment = require("../models/comment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const _ = require("underscore");


// Imports the Google Cloud client libraries
const vision = require("@google-cloud/vision");
async function detectUnsafe(url) {
    // [START vision_safe_search_detection_gcs]
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    const bucketName = process.env.BUCKETNAME;
    const fileName = url.split('/').pop();
  
    // Performs safe search property detection on the remote file
    const [result] = await client.safeSearchDetection(
      `gs://${bucketName}/${fileName}`
    );
    const detections = result.safeSearchAnnotation;
    console.log(`Adult: ${detections.adult}`);
    console.log(`Spoof: ${detections.spoof}`);
    console.log(`Medical: ${detections.medical}`);
    console.log(`Violence: ${detections.violence}`);

    return detections.adult == "VERY_LIKELY" || detections.adult == "LIKELY" || detections.racy == "VERY_LIKELY" || detections.racy == "LIKELY" || detections.violence == "VERY_LIKELY" || detections.violence == "LIKELY" || detections.medical == "VERY_LIKELY" || detections.medical == "LIKELY"

    // [END vision_safe_search_detection_gcs]
}

class PostController
{
    static showAllPosts(req,res,next) // everyone's posts
    {
        Post.find()
        .populate('user')
        .populate({
            path : 'comments',
            populate : {path : 'user'}
        })
        .then(async (posts) => {
            for(let i=0;i<posts.length;i++)
            {
                let isUnsafe = await detectUnsafe(posts[i].file)
                if(isUnsafe)
                {
                    posts[i].file = "https://via.placeholder.com/400x400?text=Marked+as+unsafe";
                }
            }
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
        .then(async (post) => {
            let isUnsafe = await detectUnsafe(post.file)
            if(isUnsafe)
            {
                post.file = "https://via.placeholder.com/400x400?text=Marked+as+unsafe";
            }
            res.status(200).json(post);
        })
        .catch((error) => {
            next(error);
        })
    }

    static addPost(req,res,next)
    {
        console.log('masukkkk')
        let data = _.pick(req.body,'title','description','file');
        data.user = req.loggedUser.id;
        data.comments = [];
        data.likes = [];
        
        Post.create(data)
        .then(async (post) => {
            let isUnsafe = await detectUnsafe(post.file)
            if(isUnsafe)
            {
                post.file = "https://via.placeholder.com/400x400?text=Marked+as+unsafe";
            }
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
        let numberOfLikes;
        Post.findById(req.params.id)
        .exec()
        .then((post) => {
            let hasLiked = false;
            for(let i=0;i<post.likes.length;i++)
            {
                if(post.likes[i].toString() == req.loggedUser.id)
                {
                    hasLiked = true;
                    break;
                }
            }

            if(!hasLiked)
            {
                post.likes.push(ObjectId(req.loggedUser.id));
            }
            
            numberOfLikes = post.likes.length;
            return post.save();
        })
        .then(() => {
            res.status(201).json({
                msg: "Like successful",
                numberOfLikes: numberOfLikes
            });
        })
        .catch((error) => {
            next(error);
        })
    }

    static unlikePost(req,res,next)
    {
        let numberOfLikes;
        Post.findById(req.params.id)
        .exec()
        .then((post) => {
            post.likes = post.likes.filter(id => id.toString() != req.loggedUser.id); 
            numberOfLikes = post.likes.length;
            return post.save();
        })
        .then(() => {
            res.status(201).json({
                msg: "Unlike successful",
                numberOfLikes: numberOfLikes
            });
        })
        .catch((error) => {
            next(error);
        })
    }

    static showPostComments(req,res,next)
    {
        Comment.find({
            post: req.params.id
        })
        .exec()
        .then((comments) => {
            res.status(200).json(comments);
        })
        .catch((error) => {
            next(error);
        })
    }

    static commentPost(req,res,next)
    {
        let postId = req.params.id;
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
}

module.exports = PostController