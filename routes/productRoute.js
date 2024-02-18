const express=require("express");
const { protect, restrict } = require("../controllers/authController");
const { createProduct } = require("../controllers/productController");

const router=express.Router();

router.route("/").post(protect,restrict("admin"),createProduct);

module.exports=router;