const express=require("express");
const { protect, restrict } = require("../controllers/authController");
const { createCashOrder, getAllOrders, getOneOrder, updateOrderToPaid, updateOrderToDelivered } = require("../controllers/orderController");

const router=express.Router();

router.route("/:cartId").post(protect,createCashOrder);
router.route("/").get(protect,restrict("admin"),getAllOrders)
router.route('/:id').get(protect,restrict("admin"),getOneOrder);
router.route('/paid/:id').put(protect,restrict("admin"),updateOrderToPaid);
router.route('/delivered/:id').put(protect,restrict("admin"),updateOrderToDelivered);

module.exports=router