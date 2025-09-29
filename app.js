require("dotenv").config(); // 1) load env first

const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");
const passport = require("passport");
const crypto = require("crypto");
const { pool } = require("./db/pool");

const index = require("./routes/index");
const auth = require("./routes/auth");
const initPassport = require("./config/passport");

const app = express();

// Views & layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

// Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || crypto.randomBytes(16).toString("hex"),
    resave: false,
    saveUninitialized: false,
    store: new pgSession({ pool, createTableIfMissing: true }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Locals
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routers FIRST
app.use("/", index);
app.use("/", auth);

// Static AFTER routers so it doesn't override routes like "/"
app.use(express.static(path.join(__dirname, "public")));

// Optional 404
app.use((req, res) => res.status(404).send("Not found"));

// Start server (with error listener)
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
