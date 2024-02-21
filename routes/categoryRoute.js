const express=require("express");
const { protect, restrict } = require("../controllers/authController");
const { createCategory, getAllCategory, deleteCategory } = require("../controllers/categoryController");

const router=express.Router();

router.route('/').post(protect,restrict('admin'),createCategory)
                 .get(protect,getAllCategory);
router.route("/:id").delete(protect,restrict('admin'),deleteCategory);                 

module.exports=router;