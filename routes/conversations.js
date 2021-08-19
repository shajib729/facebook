const router = require('express').Router()
const Conversation = require("../model/Conversation")
const userAuth=require("../middleware/userAuth.js")

//new conversation
router.post('/conversation',userAuth,async (req, res) => {
    try {
        const newConversation = await Conversation.create({ members: [req.body.senderId,req.userId] })
        res.status(200).json({message:newConversation})   
    } catch (err) {
        res.status(500).json({error:err.message})
    }
})

//get conversation of a user
router.get('/conversation/:userId',async (req, res) => {
    try {
        // console.log(req.params.userId);
        const conversation = await Conversation.find({
            members:{$in: [req.params.userId]}
        })
        
        res.status(200).json({message:conversation})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
})

module.exports=router