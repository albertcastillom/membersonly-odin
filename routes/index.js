const router = require("express").Router();
const passport = require("passport");
const passwordUtils = require("../lib/passwordUtils");

router.get("/", (req, res) => res.render("index", { title: "Hello" }));

module.exports = router;
