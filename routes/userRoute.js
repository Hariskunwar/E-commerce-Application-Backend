const express=require("express");
const { getSingleUser, getAllUser, updatePassword, updateMe, deleteMe, uploadProfilePhoto, addRemoveToWishlist, getWishlist } = require("../controllers/userController");
const { protect, restrict } = require("../controllers/authController");
const { photoUploader } = require("../middleware/multer");
const { addToCart, getCart,removeSpecificCartProduct, updateCartProductQuantity, deleteCart } = require("../controllers/cartController");

const router=express.Router();

router.route('/wishlist').get(protect,getWishlist);
router.route("/").get(protect,restrict('admin'),getAllUser);
router.route("/get-cart").get(protect,getCart);
router.route("/:id").get(protect,restrict('admin'),getSingleUser);
router.route('/updatePassword').patch(protect,updatePassword);
router.route("/updateme").patch(protect,updateMe);
router.route("/deleteme").delete(protect,deleteMe);
router.route("/upload-profile").patch(protect,photoUploader,uploadProfilePhoto);
router.route('/add-wishlist').patch(protect,addRemoveToWishlist);
router.route('/add-to-cart').post(protect,addToCart);
router.route("/delete-cart").delete(protect,deleteCart);
router.route("/remove-cart-product/:id").put(protect,removeSpecificCartProduct);
router.route("/update-cart-product-quantity/:itemId").put(protect,updateCartProductQuantity)



module.exports=router;