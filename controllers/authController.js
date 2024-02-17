const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError");
const util=require('util');
const sendEmail = require("../utils/email");
const crypto=require("crypto");

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

//authorization middleware
exports.protect=asyncErrorHandler(async (req,res,next)=>{
    //read token and check if it exist
    const authHeader=req.headers.authorization;
    let token;
    if(authHeader && authHeader.startsWith("Bearer")){
        token=authHeader.split(" ")[1];
    }
    if(!token){
        const err=new CustomError("You are not logged in",401);
        return next(err); 
    }
    //validate the token
    const decoded=await util.promisify(jwt.verify)(token,process.env.SECRET_STR);

    //check user still exist in database or not
    const user=await User.findById(decoded.id);
    if(!user){
        const err=new CustomError("User with given token does not exist",401);
        return next(err); 
    }
    //check if user changed password after token issued or not
    if(await user.isPasswordChanged(decoded.iat)){
        const err=new CustomError("Password was changed, please login again",401);
        return next(err); 
    }

    //attach user with request object
    req.user=user;
    next();
    //console.log(decoded);
})


//user role and permission
exports.restrict=(...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
        const err=new CustomError('You have not permission',403)
        return next(err);
        }
        next()
    }
}


//reset password

exports.forgotPassword=asyncErrorHandler(async (req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        const err=new CustomError('User with provided email not found',404);
        return next(err);
    }
    const resetToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    const message=`You have recieved a password reset request.
    Please use below link to reset your password.
    ${resetUrl} .\n
    This password reset link will be valid only for 10 minute.`
                   
    try {
        await sendEmail({
            email:user.email,
            subject:"Password change request recieved",
            message:message
           })

    } catch (error) {
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpires=undefined;
        await user.save({validateBeforeSave:false});
        return next(new CustomError('There was an error sending password reset email, please try again later'),500);
    }
    res.status(200).json({
        status:"success",
        message:"Password reset link send to your email."
    })
})

exports.resetPassword=asyncErrorHandler(async (req,res,next)=>{
    const token=crypto.createHash('sha256').update(req.params.resetToken).digest("hex");
    const user=await User.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gte:Date.now()}});
    if(!user){
        const err=new CustomError('Token is invalid or expired',400);
        return next(err);
    }
    user.password=req.body.password;
    user.confirmPassword=req.body.confirmPassword;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    user.passwordChangedAt=new Date();
    await user.save();
    const loginToken=signToken(user._id);
    res.status(200).json({
        status:"success",
        token:loginToken
    })
})