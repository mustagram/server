const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const commentSchema = new Schema({    
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User" 
    }
}, {timestamps : true},{versionKey : false});

commentSchema.pre('save',function(next) {
    this.user = ObjectId(this.user);
    
    next();
})

const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;