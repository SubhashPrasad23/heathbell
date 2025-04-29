const express=require("express")
const router=express.Router()
const userAuth = require("../middlewares/userAuth");
const medicineInfoAi = require("../controllers/medicineInfoAi");


router.post("/medicineInfo",userAuth,medicineInfoAi)


module.exports = router;
