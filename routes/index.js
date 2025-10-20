const router = require("express").Router();
const passport = require("passport");
const passwordUtils = require("../lib/passwordUtils");
const userController = require("../controllers/userController");
const { RandomUUID } = require("crypto");
const isAuth = require("./authMiddleware").isAuth;

router.get("/", isAuth, userController.getMessages);
//after login takes you to messages page
router.get("/new", userController.getNewMessageForm);
router.get("/messages/:id", userController.getMessageById);
router.post("/new", userController.postNewMessage);

module.exports = router;
