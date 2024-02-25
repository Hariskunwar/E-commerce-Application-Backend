const Order=require('../models/orderModel');
const User=require("../models/userModel");
const Product=require("../models/productModel");
const Cart=require('../models/cartModel');
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require("../utils/CustomError");

//create order
exports.createCashOrder=asyncErrorHandler(async (req,res,next)=>{
    //get user cart
    const cart=await Cart.findById(req.params.cartId);
    if(!cart){
        return next(new CustomError('cart not found',404));
    }
    const cartPrice=cart.totalAfterDiscount?cart.totalAfterDiscount:cart.cartTotal;
    //create order
    const order=await Order.create({
        orderBy:req.user._id,
        cartItems:cart.products,
        shippingAddress:req.body.shippingAddress,
        totalOrderPrice:cartPrice
    });
    //decrement product quantity and increment product sold
    const updateProduct=cart.products.map((item)=>{
        return {
            updateOne:{
                filter:{_id:item.product},
                update:{$inc:{quantity: -item.count,sold:+item.count}}
            }
        }
    });
    await Product.bulkWrite(updateProduct,{});
    //delete cart
    await Cart.findByIdAndDelete(req.params.cartId);
    res.status(201).json({
        status:"success",
        data:{
            order
        }
    });

});

//find all orders
exports.getAllOrders=asyncErrorHandler(async (req,res,next)=>{
    const orders=await Order.find();
    res.status(200).json({
        status:"success",
        data:{
            orders
        }
    });
});

//get single order
exports.getOneOrder=asyncErrorHandler(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new CustomError('order not found',404));
    }
    res.status(200).json({
        status:"success",
        data:{
            order
        }
    });
});

//update order status to paid
exports.updateOrderToPaid=asyncErrorHandler(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new CustomError('order not found',404));
    }
    order.isPaid=true;
    order.paidAt=Date.now();
    const updatedOrder=await order.save();
    res.status(200).json({
        status:'success',
        data:{
            updatedOrder
        }
    });
});

//update order status to delivered
exports.updateOrderToDelivered=asyncErrorHandler(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new CustomError('order not found',404));
    }
    order.isDelivered=true;
    order.deliveredAt=Date.now();
    const updatedOrder=await order.save();
    res.status(200).json({
        status:'success',
        data:{
            updatedOrder
        }
    });
});