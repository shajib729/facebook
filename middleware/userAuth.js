const jwt = require('jsonwebtoken')
const User = require("../model/UserSchema")

const userAuth = async (req, res, next) => {
    try {
        
        const token = jwt.verify(req.cookies.jwt,process.env.SECRET_KEY)
        if (!token) {
            res.status(400).json({error:"Denied to access! Please Login Again."})
        } else {
            const rootUser = await User.findOne({ _id: token.id })
            req.rootUser = rootUser
            req.userId=token.id
            req.token = req.cookies.jwt

            next()
        }

    } catch (err) {
        res.status(400).json({ err: err.message ,error:"Denied to access! Please Login Again."})
        console.log(err.message);
    }
}

module.exports=userAuth