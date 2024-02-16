const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError");
const util=require('util');

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