const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const { dataUri } = require("../utils/photouri");
const cloudinary = require("cloudinary");
const Product=require("../models/productModel");


//admin get all users
exports.getAllUser = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: "success",
        data: {
            users
        }
    })
})


//admin get single users
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        const error = new CustomError("User not found", 404)
        return next(error);
    }
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})

//user change password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
        const error = new CustomError("Current password provided is wrong", 401);
        return next(error);
    }
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangedAt = new Date();
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    });
    res.status(200).json({
        status: "success",
        token,
        data: {
            user
        }
    })
})

//user updating own account
const filterReqObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(prop => {
        if (allowedFields.includes(prop)) {
            newObj[prop] = obj[prop]
        }
    })
    return newObj;
}
exports.updateMe = asyncErrorHandler(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        const error = new CustomError("You cannot change your password using this endpoint", 400);
        return next(error);
    }
    const filterObj = filterReqObj(req.body, "email", "name", "mobile", "photo");
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterObj, { new: true, runValidators: true });
    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })
})

//user deleting own account 
exports.deleteMe = asyncErrorHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.user._id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});

//uplaod profile
exports.uploadProfilePhoto = asyncErrorHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id);
    //get product photo
    const profile = dataUri(req.file);
    //delete previous photo
    await cloudinary.v2.uploader.destroy(user.photo.public_id);
    //update with new photo
    const cloudDb = await cloudinary.v2.uploader.upload(profile.content);
    user.photo = {
        public_id: cloudDb.public_id,
        url: cloudDb.secure_url
    };
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        message: "profile picture updated"
    });

});

//add product to wish list
exports.addRemoveToWishlist = asyncErrorHandler(async (req, res, next) => {
    const  pId  = req.body.productId;
    const product=await Product.findById(pId);
    if(!product){
        return next(new CustomError("Product not found",400));
    }
    let user = await User.findById(req.user._id);
    //check if the product is already in user wishlist
    const isAlreadyAdded = user.wishlist.find((id) => { 
        return id.toString() === product._id.toString()
    });
    //if already in wishlist then remove
    if (isAlreadyAdded) {
        user=await User.findByIdAndUpdate(req.user._id,{
                    $pull:{wishlist:product._id}
                  },{new:true});
        res.status(200).json({
            status: "success",
            message: "product removed from wishlist",
            data: {
                user
            }
        })
    } else {
        //add product to wishlist
        user=await User.findByIdAndUpdate(req.user._id,{
            $push:{wishlist:product._id}},
            {new:true});
   
        res.status(200).json({
            status: "success",
            message: "product added to wishlist",
            data: {
                user
            }
        });

    }

});


//get wishlist

exports.getWishlist=asyncErrorHandler(async (req,res,next)=>{
    const user=await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({
        status:"success",
        data:{
            user
        }
    });
});