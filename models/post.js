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
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User" 
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, {timestamps : true},{versionKey : false});

postSchema.pre('save',function(next) {
    this.user = ObjectId(this.user);
    next();
})

const Post = mongoose.model("Post",postSchema);

module.exports = Post;