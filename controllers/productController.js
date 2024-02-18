const Product=require("../models/productModel");
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const CustomError=require('../utils/CustomError');

//create new product
exports.createProduct=asyncErrorHandler(async (req,res,next)=>{
      const newProduct=await Product.create(req.body);
      res.status(201).json({
         status:"success",
         data:{
             product:newProduct
         }
      })
    });