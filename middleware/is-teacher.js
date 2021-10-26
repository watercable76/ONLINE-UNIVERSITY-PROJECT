module.exports = (req, res, next) => {
  if (!res.locals.isTeacher) {
    return res.redirect("/login");
  }
  next();
};
