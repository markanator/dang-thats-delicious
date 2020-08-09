const passport = require("passport");

exports.login = passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Failed Login!",
    successRedirect: "/",
    successFlash: "You are now logged in!",
});

exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "You are now logged out!");
    res.redirect("/");
};

exports.isLoggedin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); // cary on!
        return;
    }

    req.flash("error", "Oops you must be logged in to do that!");
    res.redirect("login");
};
