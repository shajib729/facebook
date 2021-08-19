const router = require('express').Router()
const User = require("../model/UserSchema")
const bcrypt=require("bcrypt")
// const {body,validationResult}=require('express-validator')
const {registerUser,validateRegUser} =require("../controllers/register")
const loginUser = require("../controllers/login")
const userAuth=require('../middleware/userAuth')


// REGISTER ROUTE
router.post('/register',validateRegUser,registerUser)

// LOGIN ROUTE
router.post('/login', loginUser)

// UPDATE USER
router.patch('/user/:id',userAuth, async (req, res) => {
    if (req.userId === req.params.id || req.rootUser.isAdmin) {

        if (req.body.password) {
            try {
                req.body.password=await bcrypt.hash(req.body.password,10)
            } catch (err) {
                res.status(500).json({error:err.message})
            }
        }
        
        try {
            const user = await User.findByIdAndUpdate({ _id:req.params.id},req.body)
            res.status(200).json({message:"Account has been updated"})
        } catch (err) {
            res.status(500).json({error:err.message})
        }

    } else {
        return res.status(400).json({error:"You can update only your account."})
    }
    // console.log(req.params);
})

// DELETE USER
router.delete('/user/:id',userAuth, async (req, res) => {
    if (req.userId === req.params.id || req.rootUser.isAdmin) {

        try {
            const user = await User.findByIdAndDelete({ _id:req.params.id})
            res.status(200).json({message:"Account has been deleted successfully!"})
        } catch (err) {
            res.status(500).json({error:err.message})
        }

    } else {
        return res.status(400).json({error:"You can delete only your account."})
    }
    // console.log(req.params);
})

// GET A USER
router.get("/user/:id",userAuth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        // console.log(user);
        if (user) {
            res.status(200).json({user})
        } else {
            res.status(400).json({error:"User is not found!"})
        }
        
    } catch (err) {
        res.status(400).json({error:"User is not found!"})
    }
})


// GET A FRIEND
router.get("/api/friends/:userId",userAuth, async (req, res) => {
    
    try {
      const user = await User.findById(req.params.userId)
      
    // Process 1: To Findout all followings user
    //   const friends = await Promise.all(
    //     user.followings.map((friendId) => {
    //       return User.findById(friendId);
    //     })
    //   );
        
    // Process 2: To Findout all followings user
        const friends=[]
        for (let i = 0; i < user.followings.length; i++){
            friends.push(await User.findById(user.followings[i]))    
        }
    //   console.log(friends);
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
      console.log(err.message,"Error to find friends");
    }
});

// GET WHOM YOU ARE FOLLOWING
router.get("/api/get/following",userAuth, async (req, res) => {
    
    try {
        const user = await User.findById(req.userId)
     
        res.status(200).json({message:user.followings})
        
    } catch (err) {
      res.status(500).json(err);
      console.log(err.message,"Error to find friends");
    }
});

// FOLLOW A USER
router.patch("/user/:id/follow", userAuth, async (req, res) => {
    
    if (req.userId !== req.params.id) {
        try {            
            const user = await User.findById({ _id: req.params.id })
            const currentUser = await User.findById({ _id: req.userId })
            
            if (!user.followers.includes(req.userId)) {
                
                await user.updateOne({$push:{ followers: req.userId }})
                
                await currentUser.updateOne({$push:{followings:req.params.id}})

                res.status(200).json({message:"User has been followd"})

            } else {
                res.status(400).json({error:"You allready follow this user."})
            }

        } catch (err) {
            res.status(400).json({error:err.message}) 
        }
    } else {
        res.status(400).json({error:"You can't follow yourself"})
    }
})

// UNFOLLOW A USER
router.patch("/user/:id/unfollow",userAuth, async (req, res) => {
    if (req.userId !== req.params.id) {
        try {
            
            const user = await User.findById({ _id: req.params.id })
            const currentUser = await User.findById({ _id: req.userId })
            
            if (user.followers.includes(req.userId)) {
                
                await user.updateOne({ $pull: { followers: req.userId } })
                
                await currentUser.updateOne({ $pull: { followings: req.params.id } })

                res.status(200).json({message:"User has been unfollowd"})

            } else {
                res.status(400).json({error:"You aren't following this user."})
            }

        } catch (err) {
            res.status(400).json({error:err.message}) 
        }
    } else {
        res.status(400).json({error:"You can't unfollow yourself"})
    }
})

// GET AUTHENTICATE USER
router.get('/authUser', userAuth, async (req, res) => {
    try {
        const user=await User.findById(req.userId)
        res.status(200).send(user)
    } catch (err) {
        res.status(500).send(err.message)
    }

})

// LOGOUT USER
router.get('/logout', userAuth, async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({message:"Successfully Logout"})
    } catch (err) {
        res.status(500).send(err.message)
    }

})

module.exports=router