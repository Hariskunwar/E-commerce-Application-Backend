const mongoose=require("mongoose");

const couponSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"enter coupon name"],
        unique:true,
        uppercase:true
    },
    expire:{
        type:Date,
        required:[true,"enter coupon expiry date"]
    },
    discount:{
        type:Number,
        required:[true,"enter discount percentage"]
    }
},{timestamps:true});

module.exports=mongoose.model('Coupon',couponSchema);