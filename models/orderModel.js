const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    cartItems:[
        {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        count:Number,
        color:String,
        price:Number
      }
    ],
    shippingAddress:{
        phone:String,
        city:String,
        postalCode:String
    },
    totalOrderPrice:Number,
    paymentType:{
        type:String,
        enum:["cash","card"],
        default:"cash"
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:Date,
    isDelivered:{
        type:Boolean,
        default:false,
    },
    deliveredAt:Date
},{timestamps:true});

module.exports=mongoose.model("Order",orderSchema);