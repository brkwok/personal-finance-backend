const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
	{
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
		transactionType: {
			type: String,
			required: true,
		},
		transactionName: {
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
		transactionDate: {
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
	},
	{
		statics: {
			async createOrUpdate(
				accountId,
				plaidTransactionId,
				plaidCategoryId,
				category,
				subcategory,
				transactionType,
				transactionName,
				amount,
				isoCurrencyCode,
				unofficialCurrencyCode,
				transactionDate,
				pending,
				accountOwner
			) {
				const transaction = await this.findOne({ plaidTransactionId });

				if (transaction) {
					transaction.updateOne({
						accountId,
						plaidTransactionId,
						plaidCategoryId,
						category,
						subcategory,
						transactionType,
						transactionName,
						amount,
						isoCurrencyCode,
						unofficialCurrencyCode,
						transactionDate,
						pending,
						accountOwner,
					});
				} else {
					await this.create({
						accountId,
						plaidTransactionId,
						plaidCategoryId,
						category,
						subcategory,
						transactionType,
						transactionName,
						amount,
						isoCurrencyCode,
						unofficialCurrencyCode,
						transactionDate,
						pending,
						accountOwner,
					});
				}
			},
		},
	}
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
