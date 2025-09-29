const express = require("express");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const { hashPassword } = require("../lib/passwordUtils");
const { createUser, getUserByUsername } = require("../models/userModel");

const router = express.Router();

// GET /login
router.get("/login", (req, res) => res.render("login", { title: "Login" }));

// POST /login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login", // add connect-flash if you want messages
  })
);

// GET /sign-up
router.get("/sign-up", (req, res) =>
  res.render("signup", { title: "Sign up" })
);
// POST /sign-up
router.post(
  "/sign-up",
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username too short"),
  body("password").isLength({ min: 6 }).withMessage("Password too short"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", { errors: errors.array() });
    }

    const { username, password } = req.body;
    const existing = await getUserByUsername(username);
    if (existing) {
      return res
        .status(400)
        .render("signup", { errors: [{ msg: "Username taken" }] });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ username, passwordHash });

    // auto-login after signup (optional)
    req.login(user, (err) => {
      if (err) return res.redirect("/login");
      return res.redirect("/");
    });
  }
);

// POST /logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
