const express=require("express");
const { getSingleUser, getAllUser, updatePassword, updateMe, deleteMe } = require("../controllers/userController");
const { protect, restrict } = require("../controllers/authController");

const router=express.Router();

router.route("/").get(protect,restrict('admin'),getAllUser);
router.route("/:id").get(protect,restrict('admin'),getSingleUser);
router.route('/updatePassword').patch(protect,updatePassword);
router.route("/updateme").patch(protect,updateMe);
router.route("/deleteme").delete(protect,deleteMe);

module.exports=router;