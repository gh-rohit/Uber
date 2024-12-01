const userModel = require('../models/user-model');
const userService = require('../services/user-service');
const { validationResult } = require('express-validator');
const blacklistToken = require('../models/blacklist-model');

module.exports.registerUser = async (req, res, next) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body)
        const { email, fullname, password } = req.body;

        // Hash password
        const hashedPassword = await userModel.hashPassword(password);

        // Create user
        const user = await userService.createUser({
             firstname: fullname.firstname,
             lastname: fullname.lastname,
            email,
            password: hashedPassword
        });
      

        // Retrieve the newly created user instance
        const foundUser = await userModel.findById(user._id); // Retrieve the full user document
        const token = await foundUser.generateAuthToken(); // Call method on the instance

        res.status(201).json({ token, user: foundUser });
    } catch (error) {
        next(error); // Handle errors gracefully
    }
};
module.exports.loginUser = async function(req, res, next){
     const error = validationResult(req);
     if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
     }
     const {email , password} = req.body; 
     const user = await userModel.findOne({email}).select('+password')
     if(!user){
        return res.status(401).json({message:"invalid email or password"})
     }
     const isMatch = await user.comparePassword(password)
     if(!isMatch){
        return res.status(401).json({message:"invalid email or password"})
     }
     const token = await user.generateAuthToken()
     res.cookie("token", token)
     res.status(200).json({token , user})
   

}
module.exports.getUserProfile = async function(req , res, next){
    res.status(200).json(req.user)
}
module.exports.logoutUser =async (req , res, next) =>{
    res.clearCookie('token')
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]
    await blacklistToken.create({token})
    res.status(200).json({message: "logged out"})
}