const express=require('express')
const router=express.Router()
const {createUser, loginUser} = require("../controller/userController")


//==================================  users  ============================//

router.post("/register", createUser)
router.post("/login", loginUser)
router.all("/*",(req,res)=>{
    res.status(404).send({msg:"invalid http request"})
})

module.exports=router