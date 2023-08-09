const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	googleId: {
		type: String,
		required: true,
		unique: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	profilePicUrl: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	userName: {
		type: String
	},
	password: {
		type: String
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;