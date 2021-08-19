const router = require('express').Router()
const Post = require('../model/PostSchema')
const path=require('path')
const userAuth=require("../middleware/userAuth.js")
const User = require('../model/UserSchema')

// File Handler
const fileUpload = (req, res, next) => {
    // if (!req.files || Object.keys(req.files).length === 0) {
    //     return res.status(400).send('No files were uploaded.');
    // }
    
    if (req.files) {
        
        sampleFile =req.files.img
        fileName =[Date.now().toString(), sampleFile.mimetype.split('/')[1]].join('.')
        uploadPath = path.join(__dirname , '../my-app/public/upload/' , fileName);

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath)        
        req.body.img="../upload/"+fileName
        next()

    } else {
       next() 
    }
    
}

// Create a post
router.post('/post/create',userAuth,fileUpload, async (req, res) => {
    try {
        // console.log(req.body.img);
        if (req.body.desc || req.body.img) {

           req.body.userId = req.userId
            const newPost = await Post.create(req.body)
            // console.log(newPost);
            
            res.status(200).json({ message: "Post is created successfully" })
        } else {
            res.status(400).json({error:"Image or Description is required!"})
        }
    } catch (err) {
        // console.log(err);
        res.status(400).json({error:err.message})
    }
})

// Update a post
router.patch('/post/update/:id', userAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId._id == req.userId) {

            if (req.body.desc) {
                await post.updateOne({ $set:{desc:req.body.desc} })
                res.status(200).json({ message: "The Post Has Been Updated.", post})
            } else {
                res.status(400).send("Description Field Can't be Blank")
            }
            
        } else {
            res.status(400).json({error:"You can only update your post"})
        }
    } catch (err) {
        res.status(500).json({error:err.message})
   }
})

// Delete a post
router.delete('/post/delete/:id', userAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post) {

            if (post.userId == req.userId) {
                await post.deleteOne()
                res.status(200).json({ message: "The Post Has Been Deleted."})
            } else {
                res.status(400).json({error:"You can only delete your post"})
            }
            
        } else {
            res.status(400).json({error:"Post is not found"})
        }
    } catch (err) {
        res.status(500).json({error:err.message})
   }
})

// Like a post
router.patch('/post/like/:id', userAuth, async (req, res) => {
    try {
        // console.log('req.body');
        const post = await Post.findById(req.params.id)
        
        if (!post.likes.includes(req.userId)) {

            await post.updateOne({ $push: { likes: req.userId } })
            res.status(200).json({message:"The Post Has Been Liked"})

        } else {

            await post.updateOne({$pull:{likes:req.userId}})
            res.status(200).json({ message: "The Post Has Been Unliked" })
            
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({error:err.message})
    }
})

// Get a post
router.get('/post/:id',userAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("userId",['username','email'])

        if (post) {
            res.status(200).json({ message: "The Post Has Been Updated.", post})
        } else {
            res.status(400).send("Post is not found")
        }
            
       
    } catch (err) {
        res.status(500).json({error:err.message})
   }
})

// Get Timeline posts
router.get('/post/all/timeline', userAuth, async (req, res) => {
    
    try {

        const currentUser = await User.findById(req.userId)
        let allPost=[]
        for (let i = 0; i < currentUser.followings.length; i++){
            allPost.push(...await Post.find({ userId: currentUser.followings[i] }).populate('userId',['username','email','profilePicture']))
        }
        allPost.push(...await Post.find({ userId: currentUser._id }).populate('userId',['username','email','profilePicture']))
        res.status(200).json({data:allPost.reverse(),rootUser:req.userId})

    } catch (err) {
        res.status(500).json({error:err.message,err:"error"})
   }
})

// Get User all posts
router.get('/api/profile/:id', userAuth, async (req, res) => {
    // console.log(req.params);
    try {
        // console.log(req.params);
        const currentUser = await User.findById(req.params.id)
        const posts = await Post.find({ userId: currentUser._id })
        res.status(200).json({posts,currentUser})

    } catch (err) {
        res.status(500).json({error:err.message,err:"error"})
   }
})


module.exports=router