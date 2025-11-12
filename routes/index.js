const router = require("express").Router();
const passport = require("passport");
const passwordUtils = require("../lib/passwordUtils");
const userController = require("../controllers/userController");
const { RandomUUID } = require("crypto");
const { isMember } = require("./authMiddleware");
const isAuth = require("./authMiddleware").isAuth;

//main page - list messages
router.get("/", isAuth, userController.getMessages);
//new message form
router.get("/new", userController.getNewMessageForm);
//message detail page must be member to view
router.get("/messages/:id", userController.getMessageById);
//post new message - must be member to post
router.post("/new", userController.postNewMessage);

router.get("/membership", isAuth, (req, res) => {
  res.render("membership", { title: "Membership" });
});

module.exports = router;
