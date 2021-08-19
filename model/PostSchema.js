const mongoose = require("mongoose")
// const User=require('./UserSchema')

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    },
    desc: {
        type: String,
        max:500
    },
    img: {
        type:String
    },
    likes: {
        type: Array,
        default:[]
    }
},
{
  timestamps:true
}
)

const Post =mongoose.model("Post", PostSchema)

module.exports=Post