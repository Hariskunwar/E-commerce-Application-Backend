const Product=require("../models/productModel");
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const CustomError=require('../utils/CustomError');
const { dataUri } = require("../utils/photouri");
const cloudinary=require("cloudinary");

//create new product
exports.createProduct=asyncErrorHandler(async (req,res,next)=>{
  if(!req.file){
    return next(new CustomError("Please provide product image",400));
  }
  const file=dataUri(req.file);
  const cloudDb=await cloudinary.v2.uploader.upload(file.content);
  const image={
    public_id:cloudDb.public_id,
    url:cloudDb.secure_url
  }

      const newProduct=await Product.create({...req.body,images:[image]});
      res.status(201).json({
         status:"success",
         data:{
             product:newProduct
         }
      })
    });