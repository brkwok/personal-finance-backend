const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
	accountId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Account",
	},
	plaidTransactionId: {
		type: String,
		unique: true,
		required: true,
	},
	plaidCategoryId: {
		type: String,
	},
	category: {
		type: String,
	},
	subcategory: {
		type: String,
	},
	type: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	isoCurrencyCode: {
		type: String,
	},
	unofficialCurrencyCode: {
		type: String,
	},
	date: {
		type: Date,
		required: true,
	},
	pending: {
		type: Boolean,
		required: true,
	},
	accountOwner: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;