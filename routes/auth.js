const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env["GOOGLE_CLIENT_ID"],
			clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
			callbackURL: "/oauth2/redirect/google",
			scope: ["profile", "email"],
		},
		async (_accessToken, _refreshToken, profile, done) => {
			const existingUser = await User.findOne({ googleId: profile.id });

			if (existingUser) {
				return done(null, existingUser);
			} else {
				const err = new Error("Unauthorized Access");
				err.status = 401;

				return done(err);
			}
		}
	)
);

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		cb(null, { id: user.id, username: user.username, name: user.name });
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

const router = express.Router();

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", {
		successReturnToOrRedirect: "/",
		failureRedirect: "/login",
	})
);

router.post("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

module.exports = router;
