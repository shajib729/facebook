const bcrypt=require('bcrypt')
const User = require("../model/UserSchema")
var jwt = require('jsonwebtoken');

// LOGIN USER CONTROLLER
const loginUser= async (req, res) => {
    const { email, password } = req.body
    try {

        if (!email || !password) {
            res.status(400).json({error:"Please Fill Form Correctly!"})
        } else {
            // Find out if the user is exist or not
            const findUser=await User.findOne({$or:[{username:email},{email:email}]})
            if (findUser) {

                const checkPassword = await bcrypt.compare(password, findUser.password)
                if (checkPassword) {

                    const token = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY, { expiresIn: "7d" })
                    
                    res.cookie('jwt', token)
                    
                    res.status(200).json({ message: "Login Successfull", token,id:findUser._id })
                    
                } else {
                    res.status(400).json({error:"Wrong Info!"})
                }
                
            } else {
                res.status(400).json({error:"Authorization Error"})
            }

        }

    } catch (err) {
        console.log(err.message);
        res.send(err.message)
    }
}

module.exports = loginUser