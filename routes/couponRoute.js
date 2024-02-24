const express=require("express");
const { createCoupon, getAllCoupon, getOneCoupon, updateCoupon, deleteOneCoupon } = require("../controllers/couponController");
const { protect, restrict} =require("../controllers/authController");
const router=express.Router();

router.route("/").post(protect,restrict("admin"),createCoupon)
                 .get(protect,getAllCoupon);
router.route("/:id").get(protect,getOneCoupon)
                    .put(protect,restrict("admin"),updateCoupon)
                    .delete(protect,restrict("admin"),deleteOneCoupon);
                    
module.exports=router;                    