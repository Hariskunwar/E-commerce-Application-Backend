const Cart=require("../models/cartModel");
const Product=require('../models/productModel');
const asyncErrorHandler=require("../utils/asyncErrorHandler");
const CustomError=require('../utils/CustomError');
const Coupon=require("../models/couponModel");

//calculate total cart price
const calcTotalCartPrice=(cart)=>{
    let totalPrice=0;
    cart.products.forEach((item)=>{
      totalPrice +=item.count*item.price;
    });
    cart.cartTotal=totalPrice;
    cart.totalAfterDiscount=undefined;
    return totalPrice;
  };
  exports.addToCart=asyncErrorHandler(async (req,res,next)=>{
    const {productId,color}=req.body;
   //find product
   const product=await Product.findById(productId);
   if(!product){
    const err=new CustomError('product not found',404);
        return next(err);
   }

   //get cart of logged user
   let cart=await Cart.findOne({orderBy:req.user._id});
   //if not cart then create cart with product
   if(!cart){
    cart=await Cart.create({
        products:[{product:productId,color,price:product.price}],
        orderBy:req.user._id
    });
   }
   else{
    //if product is in cart increase product count
    const productIndex=cart.products.findIndex((item)=>{
       return item.product.toString()===productId&&item.color===color;
    } );

      if(productIndex>-1) {
        const prod=cart.products[productIndex];
        prod.count+=1;
        cart.products[productIndex]=prod;
      }else {
        // if product not exist in cart, then push product to products array
        cart.products.push({product:productId,color,price:product.price});
      }
    };
   //Calculate total cart price
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({
        status:'success',
        data:{
            cart
        },
      });
});
    
//get user cart
exports.getCart=asyncErrorHandler(async (req,res,next)=>{
    const cart=await Cart.findOne({orderBy:req.user._id}).populate("products.product");
    if(!cart){
        const err=new CustomError('No cart',404);
        return next(err);
    }
    res.status(200).json({
        status:"success",
        data:{
            cart
        }
    });
});

//delete cart
 exports.deleteCart=asyncErrorHandler(async (req,res,next)=>{
    await Cart.findOneAndDelete({orderBy:req.user._id});
    res.status(204).json({
        status:"success",
        data:null
    });
});

//remove specific cart product
exports.removeSpecificCartProduct=asyncErrorHandler(async (req,res,next)=>{
    let cart=await Cart.findOne({orderBy:req.user._id});
    if(!cart){
        const err=new CustomError('No product in cart',404);
        return next(err);
    }
    cart=await Cart.findOneAndUpdate({orderBy:req.user._id },{
          $pull:{products:{_id:req.params.id}},},{new:true});
    calcTotalCartPrice(cart);
    cart.save(); 
    res.status(200).json({
        status:"success",
        data:{
            cart
        }
    });   
});

//update product cart quantity
exports.updateCartProductQuantity=asyncErrorHandler(async (req,res,next) => {
    const {count}=req.body;
    const cart=await Cart.findOne({orderBy:req.user._id});
    if(!cart){
        const err=new CustomError('No cart',404);
        return next(err);
    }
    const productIndex=cart.products.findIndex((item)=>{
        return item._id.toString() === req.params.itemId
    });
    if(productIndex>-1) {
      let product=cart.products[productIndex];
      product.count=count;
      cart.products[productIndex] = product;
    } 
    else{
        const err=new CustomError(`There is no item with id: ${req.params.itemId}`,404);
        return next(err);
   }
   calcTotalCartPrice(cart);
   await cart.save();
   res.status(200).json({
      status:'success',
      data: {
        cart
      },
   });
});


//Apply coupon
exports.applyCoupon=asyncErrorHandler(async (req,res,next)=>{
    //get coupon
    const coupon=await Coupon.findOne({name:req.body.name,expire:{$gt:Date.now()}})
    if(!coupon){
        const err=new CustomError('coupon is invalid or expired',404);
        return next(err);
    }
    //get user cart
    const cart=await Cart.findOne({orderBy:req.user._id});
    if(!cart){
        const err=new CustomError('no product in cart',404);
        return next(err);
    }
    const totalPrice=cart.cartTotal;
    const priceAfterDiscount=(totalPrice-(totalPrice*coupon.discount)/100).toFixed(2);
    cart.totalAfterDiscount=priceAfterDiscount;
    await cart.save();
    res.status(200).json({
        status:"success",
        data:{
            cart
        }
    });
});
