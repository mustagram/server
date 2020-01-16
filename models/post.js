const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const postSchema = new Schema({    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    file: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        //required: true,
        ref: "User" 
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

postSchema.pre('save',function(next) {
    this.user = ObjectId(this.user);
    if(!this.created_at)
    {
        this.created_at = new Date();
        this.likes = [];
        this.comments = [];
    }

    this.updated_at = new Date();
    
    next();
})

const Post = mongoose.model("Post",postSchema);

module.exports = Post;