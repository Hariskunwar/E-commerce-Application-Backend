const User=require("../models/userModel");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError");


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