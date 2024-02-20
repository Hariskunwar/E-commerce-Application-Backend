const express=require("express");
const { protect, restrict } = require("../controllers/authController");
const { createProduct, getAllProduct, getSingleProduct, updateProduct, updateProductImage } = require("../controllers/productController");
const { photoUploader } = require("../middleware/multer");

const router=express.Router();

router.route("/").post(protect,restrict("admin"),photoUploader,createProduct)
                 .get(protect,getAllProduct);
router.route("/:id").get(protect,getSingleProduct)
                    .put(protect,restrict('admin'),updateProduct);
                    
router.route("/image/:id").put(protect,restrict("admin"),photoUploader,updateProductImage)                    



module.exports=router;