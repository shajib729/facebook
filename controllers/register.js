const bcrypt=require('bcrypt')
const User = require("../model/UserSchema")
const { body, validationResult } = require('express-validator')
var jwt = require('jsonwebtoken');


// Regiter User Validation Check
const validateRegUser = [
    body('username').not().trim().isEmpty().withMessage("Username can't be blanked"),
    body("email").not().isEmpty().trim().withMessage("Email is required").isEmail().withMessage("Not a valid Email"),
    body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 character"),
    body('cpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }    
        // Indicates the success of this synchronous custom validator
        return true;
      })
]


// REGISTER USER CONTROLLER
const registerUser= async (req, res) => {
    let { username, email, password } = req.body
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({error:errors.formatWith(err=>err.msg).mapped()})
        } else {
            // Find out if the user is exist or not
            const findUser=await User.findOne({$or:[{username:username},{email:email}]})
            if (findUser) {
                res.status(400).json({error:"With these username or email an user exist. These should be uniqe!"})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                const user = await User.create({ username, email, password: hashedPassword })
                if (user) {
                    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" })
                    res.cookie('jwt', token)

                    res.status(200).json({message:"User Registered Successfully",token,id:user._id})
                }
            }

        }

    } catch (err) {
        console.log(err);
        res.send(err.message)
    }
}

module.exports={registerUser,validateRegUser}