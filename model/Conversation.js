const mongoose = require("mongoose")
// const User=require('./UserSchema')

const ConversationSchema = new mongoose.Schema(
{
    members:{
        type:Array,
    }
},
{
  timestamps:true
}
)

const Conversation =mongoose.model("Conversation", ConversationSchema)

module.exports=Conversation