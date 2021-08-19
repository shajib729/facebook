const router = require('express').Router()
const Message = require("../model/Message")

// Add
router.post('/messages', async (req, res) => {
    try{
        const newMessage = await Message.create(req.body)
        res.status(200).json({message:newMessage})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
})

// Get
router.get('/messages/:conversationId', async (req, res) => {
    try{
        const messages = await Message.find({ conversationId: req.params.conversationId })
        res.status(200).json({message:messages})
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
})

module.exports = router;