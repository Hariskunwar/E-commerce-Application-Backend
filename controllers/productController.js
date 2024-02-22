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
      });
    });

    //update product
    exports.updateProduct=asyncErrorHandler(async (req,res,next)=>{
     
      const updatedProduct=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
      if(!updatedProduct){
        return next(new CustomError("product not found",400))
      }
      res.status(200).json({
        status:"success",
        data:{
          product:updatedProduct
        }
      });
    });

    exports.updateProductImage=asyncErrorHandler(async (req,res,next)=>{
      let product=await Product.findById(req.params.id);
      if(!product){
        return next(new CustomError("Product not found",404));
      }
      if(!req.file){
        return next(new CustomError("Please provide product image",40));
      }
      const file=dataUri(req.file);
      const cloudDb=await cloudinary.v2.uploader.upload(file.content);
      const image={
        public_id:cloudDb.public_id,
        url:cloudDb.secure_url
      }
    
     product=await Product.findByIdAndUpdate(req.params.id,{$push:{images:image}},{new:true})
     
      res.status(200).json({
        status:"success",
        updatedProduct:product
      });
    });

    //delete product image from database and cloudinary
    exports.deleteProductImage=asyncErrorHandler(async (req,res,next)=>{
      let product=await Product.findById(req.params.id);
      if(!product){
        return next(new CustomError("Product not found",404));
      }
      let id=req.query.id;
      //find image index
      let imageIndex=-1;
      product.images.forEach((item,index)=>{
          if(item._id.toString()===id.toString()){
            imageIndex=index;
          }
      })
      if(imageIndex<0){
        return next(new CustomError("image not found",404));
      }
      //delete image from cloudinary
      await cloudinary.v2.uploader.destroy(product.images[imageIndex].public_id);
     // remove from database
     product=await Product.findByIdAndUpdate(req.params.id,{$pull:{images:{_id:id}}},{new:true});
     res.status(200).json({
      status:"success",
      data:{
        product
      }
    });
    });

    //delete product
    exports.deleteProduct=asyncErrorHandler(async (req,res,next)=>{
      const product=await Product.findById(req.params.id);
      if(!product){
        return next(new CustomError("Product not found",404));
      }
      //first delete product image from cloudinary
      for(let index=0;index<product.images.length;index++){
        await cloudinary.v2.uploader.destroy(product.images[index].public_id);
      }
      await Product.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status:"success",
        data:null
      });
    });

    //product rating functionality
    exports.ratings=asyncErrorHandler(async (req,res,next)=>{
      const pId=req.body.productId;
       let product=await Product.findById(pId);
       //check already rated 
       const alreadyRated=product.ratings.find((rate)=>{
         return rate.ratedBy.toString()===req.user._id.toString();
       });
       if(alreadyRated){
        product=await Product.updateOne({ratings:{$elemMatch:alreadyRated}},{
          $set:{'ratings.$.star':req.body.star}
              },{new:true});
        }
       else{ 
         product=await Product.findByIdAndUpdate(pId,{
            $push:{
               ratings:{
                  star:req.body.star,
                  ratedBy:req.user._id
              }
          }
        },{new:true});
      
      }
      //average of all rating
      product=await Product.findById(pId);
      const totalRate=product.ratings.length;
      let ratingSum=product.ratings.map((item)=>{
      return item.star;
      }).reduce((prev,curr)=>prev+curr,0);
      const averageRating=Math.round(ratingSum/totalRate);
      product=await Product.findByIdAndUpdate(pId,{avgRate:averageRating},{new:true});
      res.status(200).json({
         status:"success",
         data:{
             product
          }
        });
     });