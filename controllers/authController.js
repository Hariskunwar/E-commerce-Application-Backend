const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError");

const signToken=(id)=>{
    return jwt.sign({id:id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
    })
}

//user registeration
exports.signup=asyncErrorHandler(async (req,res,next)=>{
       const newUser=await User.create(req.body);
        const token=signToken(newUser._id);

        res.status(201).json({
            status:"success",
            token,
            data:{
                user:newUser
            }
        })
    })

//user login
exports.login=asyncErrorHandler(async (req,res,next)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email:email}).select("+password");
    if(!user || !(await user.comparePassword(password,user.password))){
        const err=new CustomError("Incorrect email or password",400);
        return next(err);
    }
    const token=signToken(user._id);
    res.status(200).json({
        status:"success",
        token
    })

})