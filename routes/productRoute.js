const express=require("express");
const { protect, restrict } = require("../controllers/authController");
const { createProduct } = require("../controllers/productController");
const { photoUploader } = require("../middleware/multer");

const router=express.Router();

router.route("/").post(protect,restrict("admin"),photoUploader,createProduct);

module.exports=router;