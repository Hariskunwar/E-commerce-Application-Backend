const User=require("../models/userModel");


//admin get all users
exports.getAllUser=async (req,res)=>{
    try {
        const users=await User.find();
        res.status(200).json({
            status:"success",
            data:{
                users
            }
        })
    } catch (error) {
        res.status(500).json({
            status:"error",
            error:error
        })
    }
}


//admin get single users
exports.getSingleUser=async (req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user){
            res.status(404).json({
                status:"error",
                message:"user not found"
            })
        }

        
        res.status(200).json({
            status:"success",
            data:{
                user
            }
        })
    } catch (error) {
        res.status(500).json({
            status:"error",
            error:error
        })
    }
}