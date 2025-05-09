const express=require("express")
const { profile } = require("../controllers/profile")
const router=express.Router()
const userAuth= require("../middlewares/userAuth")

router.get("/profile",userAuth,profile)


module.exports=router