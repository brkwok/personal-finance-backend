const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

passport.use(
	new LocalStrategy(async (username, password, done) => {
		const user = await User.findOne({ username });

		if (user && user.password === password) {
			return done(null, user);
		} else {
			const err = new Error("Failed to Log In");
			err.status = 401;

			return done(err);
		}
	})
);

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
				const err = new Error("Failed to Log In");
				err.status = 401;

				return done(err);
			}
		}
	)
);

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		cb(null, { id: user.id, username: user.username });
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

router.post("/demo", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return res.status(500).send({ error: "An error occurred" });
		}

		if (!user) {
			return res.status(401).send({ message: "Authentication failed" });
		}

		req.logIn(user, (err) => {
			if (err) {
				return res.status(500).send({ error: "An error occurred" });
			}

			return res
				.status(200)
				.send({
					displayName: user.displayName,
					profilePicUrl: user.profilePicUrl,
				});
		});
	})(req, res, next);
});

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
			return res.json({ error: "User not found" });
		}

		// Return the user data as the API response
		res.status(200).send({
			displayName: user.displayName,
			profilePicUrl: user.profilePicUrl,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
