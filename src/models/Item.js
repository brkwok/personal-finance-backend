const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	userId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "User",
	},
	plaidAccessToken: {
		type: String,
		unique: true,
		required: true,
	},
	plaidItemId: {
		type: String,
		unique: true,
		required: true,
	},
	plaidInstitutionId: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	transactionsCursor: {
		type: String,
	},
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;