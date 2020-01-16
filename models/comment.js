const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const commentSchema = new Schema({    
    text: {
        type: String,
        required: true
    },
    created_at: {
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User" 
    },
    post: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Post" 
    }
});

commentSchema.pre('save',function(next) {
    this.user = ObjectId(this.user);
    this.post = ObjectId(this.post);
    if(!this.created_at)
    {
        this.created_at = new Date();
    }

    this.updated_at = new Date();
    
    next();
})

const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;