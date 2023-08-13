const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
	{
		itemId: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Item",
		},
		transactions: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Transaction",
			},
		],
		plaidAccountId: {
			type: String,
			unique: true,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		mask: {
			type: String,
			required: true,
		},
		officialName: {
			type: String,
		},
		currentBalance: {
			type: Number,
		},
		availableBalance: {
			type: Number,
		},
		isoCurrencyCode: {
			type: String,
		},
		unofficialCurrencyCode: {
			type: String,
		},
		type: {
			type: String,
			required: true,
		},
		subtype: {
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
	},
	{
		statics: {
			findByPlaidAccountId(plaidAccountId) {
				return this.find({ plaidAccountId });
			},
			findByUserId(userId) {
				return this.find({ userId });
			},
			findByItemId(itemId) {
				return this.find({ itemId });
			},
		},
	}
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
