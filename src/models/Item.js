const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	accounts: [
		{
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Account",
		},
	],
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
	institutionName: {
		type: String,
		default: "",
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
