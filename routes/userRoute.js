const express=require("express");
const { getSingleUser, getAllUser } = require("../controllers/userController");

const router=express.Router();

router.route("/").get(getAllUser);
router.route("/:id").get(getSingleUser);

module.exports=router;