const express=require('express')
const router=express.Router()
const {createUser, updateUser, loginUser, getProfile} = require("../controllers/userController")
const {createProduct, getProduct, getProductById, updateProduct, deleteProduct}= require("../controllers/productController")
const {authentication} = require("../middleware/middleware")
const { updateCart, getCart, deleteCart, createCart } = require('../controllers/cartController')
const {createOrder,updateOrder}=require("../controllers/orderController")

//==================================  users  ============================//

router.post("/register", createUser)
router.post("/login", loginUser)