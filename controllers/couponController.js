const Coupon=require("../models/couponModel");
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError");

//create a coupon
exports.createCoupon= asyncErrorHandler(async (req,res,next)=>{
    const newCoupon=await Coupon.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            coupon:newCoupon
        }
    });
});

//get all coupon
exports.getAllCoupon=asyncErrorHandler(async (req,res,next)=>{
    const coupons=await Coupon.find();
    res.status(200).json({
        status:"success",
        data:{
            coupons
        }
    });
});

//get single coupon
exports.getOneCoupon=asyncErrorHandler(async (req,res,next)=>{
    const coupon=await Coupon.findById(req.params.id);
    if(!coupon){
        return next(new CustomError('coupon not found',404));
    }
    res.status(200).json({
        status:"success",
        data:{
            coupon
        }
    });
});

//update a coupon
exports.updateCoupon=asyncErrorHandler(async (req,res,next)=>{
    const updatedCoupon=await Coupon.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!updatedCoupon){
            return next(new CustomError('coupon not found',404));
        }
    res.status(200).json({
        status:"success",
        data:{
            coupon:updatedCoupon
        }
    });
});

//delete a coupon
exports.deleteOneCoupon=asyncErrorHandler(async (req,res,next)=>{
    const deletedCoupon=await Coupon.findByIdAndDelete(req.params.id);
    if(!deletedCoupon){
        return next(new CustomError('coupon not found',404));
    }
    res.status(204).json({
        status:"success",
        data:null
    });
});