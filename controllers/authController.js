const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncErrorHandler=require("../utils/asyncErrorHandler");

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

