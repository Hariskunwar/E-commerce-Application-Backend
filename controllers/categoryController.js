const Category=require('../models/categoryModel');
const Product = require('../models/productModel');
const CustomError = require('../utils/CustomError');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

//create product category
exports.createCategory=asyncErrorHandler(async (req,res,next)=>{
    const category=await Category.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            category
        }
    });
});

//get all categories
exports.getAllCategory=asyncErrorHandler(async (req,res,next)=>{
    const categories=await Category.find();
    res.status(200).json({
        status:"success",
        data:{
            categories
        }
    });
});

//delete a category
exports.deleteCategory=asyncErrorHandler(async (req,res,next)=>{
    const category=await Category.findById(req.params.id);
    if(!category){
        return next(new CustomError("Category not found",404));
    }
    //find products with category id
    const products=await Product.find({category:req.params.id});
    for(let i=0;i<products.length;i++){
      const product =products[i];
      product.category=undefined;
        await product.save();
    }
    //delete category
    await category.deleteOne();
    res.status(204).json({
         status:"success",
         data:null
    });
    
});