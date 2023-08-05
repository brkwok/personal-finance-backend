const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
require("dotenv").config;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env["GOOGLE_CLIENT_ID"],
			clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
			callbackURL: "/auth/redirect/google",
			proxy: true,
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
		cb(null, { id: user.id });
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

const router = express.Router();

router.get("/federated/google", passport.authenticate("google"));

router.get(
	"/redirect/google",
	passport.authenticate("google", {
		successReturnToOrRedirect: process.env.CLIENT_LOGIN_REDIRECT,
	}),
	(_req, res) => {
		res.status(400).send({ message: "Failed to log in" });
	}
);

router.post("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.status(200).send({ message: "Succesfully logged out" });
	});
});

router.get("/user", ensureAuthenticated, async function (req, res) {
	try {
		// Retrieve the authenticated user's ID from the session
		const userId = req.user.id;

		// Fetch user data from the database based on the user's ID
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Return the user data as the API response
		res.json({ displayName: user.displayName });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
