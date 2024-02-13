const mongoose=require("mongoose");
const validator=require("validator");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:[true,"User with this email already exist"],
        validate:[validator.isEmail,"Please enter a valid email"]
    },
   
    mobile:{
        type:String,
        required:[true,"Please enter your phone number"],
        unique:[true,"User with this phone number already exist"],
        
    },
    photo:{
        type:String,
        default:"https://i.stack.imgur.com/l60Hf.png"
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:6
    },
    confirmPassword:{
        type:String,
        required:[true,"Please confirm your password"]
    },
},{timestamps:true})

module.exports=mongoose.model("User",userSchema);