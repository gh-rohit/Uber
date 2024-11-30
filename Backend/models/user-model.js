const mongoose = require('mongoose');
const jwt= require('jsonwebtoken')
const bcrypt = require('bcrypt');
 const userSchema = new mongoose.Schema({
    fullname:{
       firstname:{
         type: String,
         required: true,
         minlength: [3,'charcters must be at least 3 characters']
       },
       lastname:{
         type: String,
         required: true,
       },
     
    },  email:{
        type: String,
        required: true,
        unique: true,
        minlength: [5,'charcters must be at least 5 characters']
      },
      password:{
        type: String,
        required: true,
        select:false,
        
      },
    
 })
 userSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
 userSchema.methods.comparePassword = async function (password){
return await bcrypt.compare(password, this.password)
 }
 userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10)
 }
 const userModel =mongoose.model('user',userSchema);
 module.exports = userModel;