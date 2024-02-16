const express=require("express");
const { getSingleUser, getAllUser } = require("../controllers/userController");
const { protect, restrict } = require("../controllers/authController");

const router=express.Router();

router.route("/").get(protect,restrict('admin'),getAllUser);
router.route("/:id").get(protect,restrict('admin'),getSingleUser);

module.exports=router;