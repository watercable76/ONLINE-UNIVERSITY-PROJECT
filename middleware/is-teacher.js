module.exports = (req, res, next) => {
    if (!req.session.isTeacher) {
        return res.redirect('/login');
    }
    next();
}