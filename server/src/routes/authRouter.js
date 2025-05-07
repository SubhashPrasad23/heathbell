const express=require("express")
const router = express.Router();
const { handleSignUp, handleLogin, handleLogout } = require("../controllers/auth");

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);


module.exports = router;
