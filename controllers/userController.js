const User=require("../models/userModel");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError");
const jwt=require("jsonwebtoken");


//admin get all users
exports.getAllUser=asyncErrorHandler(async (req,res,next)=>{
        const users=await User.find();
        res.status(200).json({
            status:"success",
            data:{
                users
            }
        })
    })


//admin get single users
exports.getSingleUser=asyncErrorHandler(async (req,res,next)=>{
   
        const user=await User.findById(req.params.id);
        if(!user){
            const error=new CustomError("User not found",404)
            return next(error);
        }
         res.status(200).json({
            status:"success",
            data:{
                user
            }
        })
    })

    //user change password
    exports.updatePassword=asyncErrorHandler(async (req,res,next)=>{
        const user=await User.findById(req.user._id).select("+password");
        if(!(await user.comparePassword(req.body.currentPassword,user.password))){
            const error=new CustomError("Current password provided is wrong",401);
            return next(error);
        }
        user.password=req.body.newPassword;
        user.confirmPassword=req.body.confirmPassword;
        user.passwordChangedAt=new Date();
        await user.save();
        const token=jwt.sign({id:user._id},process.env.SECRET_STR,{
            expiresIn:process.env.LOGIN_EXPIRES
        });
        res.status(200).json({
            status:"success",
            token,
            data:{
                user
            }
        })
    })