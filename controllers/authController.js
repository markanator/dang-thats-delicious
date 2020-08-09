const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const promisify = require("es6-promisify");
const User = mongoose.model("User");

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

exports.forgot = async (req, res) => {
    // see if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash("error", "No account with that email exists.");

        return res.redirect("/login");
    }
    // set reset token and expires on account
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    // send an email with a token
    const resetURL = `http://${req.header.host}/account/reset/${user.resetPasswordToken}`;
    req.flash("success", "You have been a password reset link!");
    // redirect to login page
    res.redirect("/login");
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        // check token
        resetPasswordToken: req.params.token,
        // is it expired?
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
        req.flash("error", "password reset token is invalid or has expired");
        return res.redirect("/login");
    }
    // show reset password form!
    res.render("reset", { title: "Reset your Passowrd!" });
};

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body["password-confirm"]) {
        next(); // keepit going!
        return;
    }
    req.flash("error", "Passwords do not match!");
    res.redirect("back");
};

exports.update = async (req, res) => {
    // find user and token checks out
    const user = await User.findOne({
        // check token
        resetPasswordToken: req.params.token,
        // is it expired?
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
        req.flash("error", "password reset token is invalid or has expired");
        return res.redirect("/login");
    }
    // vibe check passed
    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash(
        "success",
        "💃 Nice! Your password has been reset! You are now logged in!"
    );
    res.redirect("/");
};
