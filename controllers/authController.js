const User=require("../models/userModel");
const jwt=require("jsonwebtoken");

const signToken=(id)=>{
    return jwt.sign({id:id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
    })
}

//user registeration
exports.signup=async (req,res)=>{
    try {
        
        const newUser=await User.create(req.body);
        const token=signToken(newUser._id);

        res.status(201).json({
            status:"success",
            token,
            data:{
                user:newUser
            }
        })
    } catch (error) {
        res.status(500).json({
            status:"error",
            error:error
        })
    }
}

