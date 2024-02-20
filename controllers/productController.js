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

    //get all products
    exports.getAllProduct=asyncErrorHandler(async (req,res,next)=>{
      
      //exculde some fields
      const excludeFields=['sort','page','limit','fields'];
      let queryObj={...req.query};
      excludeFields.forEach((el)=>{
        delete queryObj[el];
      })
      
      //filtering
      let queryStr=JSON.stringify(queryObj);
      queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
       queryObj=JSON.parse(queryStr);
       
       
       let query= Product.find(queryObj);

      //sorting
      if(req.query.sort){
        const sortedBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortedBy);
      }else{
        query=query.sort("-createdAt")
      }

      //limiting fields
      if(req.query.fields){
        const fields=req.query.fields.split(',').join(' ');
        query=query.select(fields);
      }else{
        query=query.select('-__v');
      }

      //pagination
      const page=req.query.page*1||1;
      const limit=req.query.limit*1||3;
      const skip=(page-1)*limit;
      query=query.skip(skip).limit(limit);
      if(req.query.page){
        const productCount=await Product.countDocuments();
        if(skip>=productCount){
          return next(new CustomError('This page is not found',404));
        }
      }

      const products=await query;


      
      res.status(200).json({
        status:"success",
        data:{
          products
        }
      });
    });

    //get single product
    exports.getSingleProduct=asyncErrorHandler(async (req,res,next)=>{
      const product=await Product.findById(req.params.id);
      if(!product){
        return next(new CustomError("Product not found",404))
      }
      res.status(200).json({
        status:"success",
        data:{
          product
        }
      })
    })