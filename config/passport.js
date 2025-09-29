// config/passport.js
const LocalStrategy = require("passport-local").Strategy;
const { getUserByUsername, getUserById } = require("../models/userModel");
const { validatePassword } = require("../lib/passwordUtils");

module.exports = function initPassport(passport) {
  // username/password field names must match your login form inputs
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username, password, done) => {
        try {
          const user = await getUserByUsername(username);
          if (!user)
            return done(null, false, { message: "Invalid credentials" });

          const ok = await validatePassword(password, user.password_hash);
          if (!ok) return done(null, false, { message: "Invalid credentials" });

          // keep session payload small
          return done(null, {
            id: user.id,
            username: user.username,
            role: user.role,
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id); // store only the id in session
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      if (!user) return done(null, false);
      done(null, { id: user.id, username: user.username, role: user.role });
    } catch (err) {
      done(err);
    }
  });
};
