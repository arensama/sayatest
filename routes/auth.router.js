var express = require("express");
const authController = require("../controllers/auth.controller");
var router = express.Router();

// user CRUD

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);

module.exports = router;
