const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const fs = require("fs");
const https = require("https");

require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

app.use(function (req, res, next) {
	if (req.headers["x-arr-ssl"] && !req.headers["x-forwarded-proto"]) {
		req.headers["x-forwarded-proto"] = "https";
	}

	return next();
});

const PORT = process.env.PORT || 5000;

const {
	authRouter,
	plaidRouter,
	itemsRouter,
	transactionsRouter,
	accountsRouter,
} = require("./routes");

// Allow Cross-Origin Resource Sharing (CORS)
app.use(
	cors({
		origin: [
			"https://localhost:3000",
			"https://mern-personal-finance-backend.azurewebsites.net",
			"https://brkwok.github.io",
		],
		credentials: true,
		exposedHeaders: ["set-cookie"],
	})
);

mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true })
	.then(() => {
		console.log("connected to database");
		// Start the server after successfully connecting to the database
		https
			.createServer(
				{
					key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
					cert: fs.readFileSync(path.resolve(__dirname, "cert.pem")),
				},
				app
			)
			.listen(PORT, () => {
				console.log("express server listening to " + PORT);
			});
	})
	.catch((err) => {
		console.error(err.message);
	});

require("./jobs/updateTransactions");

// Parse incoming JSON data
app.use(express.json());

// Parse incoming URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Configure and use express-session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET, // A secret key used to sign the session ID cookie
		resave: true, // Force the session to be saved back to the session store even if it was not modified
		cookie: {
			maxAge: 1000 * 60 * 60,
			secure: true,
			httpOnly: true,
			sameSite: "none",
		}, // Set the maximum age of the session cookie to 1 hour (in milliseconds)
		saveUninitialized: false, // Do not save uninitialized sessions (e.g., if the session is new but not modified)
		store: MongoStore.create({
			// Use connect-mongo to store sessions in MongoDB
			client: mongoose.connection.getClient(), // Use the existing Mongoose connection to the MongoDB database
		}),
	})
);

// Initialize Passport and restore authentication state from session (if available)
app.use(passport.initialize());
app.use(passport.session());

const { refreshSession, ensureAuthenticated } = require("./middlewares");

app.use(refreshSession);

app.use("/auth", authRouter);
app.use("/plaid", ensureAuthenticated, plaidRouter);
app.use("/items", ensureAuthenticated, itemsRouter);
app.use("/transactions", ensureAuthenticated, transactionsRouter);
app.use("/accounts", ensureAuthenticated, accountsRouter);
