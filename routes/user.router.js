var express = require("express");
const userController = require("../controllers/user.controller");
var router = express.Router();

// user CRUD
router.get("/", userController.FindAll);
router.get("/:id", userController.FindOne);
router.post("/", userController.Create);
router.patch("/:id", userController.Update);
router.delete("/:id", userController.Destroy);

module.exports = router;
