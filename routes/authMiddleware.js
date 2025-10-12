module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render("notAuth", { title: "Not Authorized" }); // Unauthorized
};

module.exports.isMember = (req, res, next) => {
  if (req.user && req.user.member) {
    return next();
  }
  res.status(403).send("Forbidden - Members only");
};
