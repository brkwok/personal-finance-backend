const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
	{
		item: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item"
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		transactions: [
			{
				type: mongoose.Schema.Types.ObjectId,
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
			async findByPlaidAccountId(plaidAccountId) {
				return await this.findOne( { plaidAccountId });
			},
			async findByUserId(userId) {
				return await this.find({ userId });
			},
			async findByItemId(itemId) {
				return await this.find({ item: itemId });
			},
		},
	}
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
