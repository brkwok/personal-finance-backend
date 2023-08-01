const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const { authRouter } = require("./routes");

mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true })
	.then(() => {
		console.log("connected to database");
		// Start the server after successfully connecting to the database
		app.listen(PORT, () => {
			console.log(`Server listening to port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error(err);
	});

// Allow Cross-Origin Resource Sharing (CORS)
app.use(cors());

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
		cookie: { maxAge: 1000 * 60 * 60 }, // Set the maximum age of the session cookie to 1 hour (in milliseconds)
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

// Connect to the MongoDB database using Mongoose

app.use("/", authRouter);
