const express=require("express");
const { getSingleUser, getAllUser } = require("../controllers/userController");
const { protect } = require("../controllers/authController");

const router=express.Router();

router.route("/").get(protect,getAllUser);
router.route("/:id").get(protect,getSingleUser);

module.exports=router;