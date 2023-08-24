const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
	items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
	accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
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
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	username: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
