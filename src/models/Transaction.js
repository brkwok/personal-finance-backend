const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
	{
		account: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Account",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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
			default: "Other",
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
			index: true,
		},
		pending: {
			type: Boolean,
			required: true,
		},
		accountOwner: {
			type: String,
		},
		note: {
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
				account,
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
				user
			) {
				const transaction = await this.findOne({ plaidTransactionId });

				if (transaction) {
					await transaction
						.overwrite({
							account,
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
							user,
							updatedAt: Date.now(),
							createdAt: transaction.createdAt,
						})
						.save();
				} else {
					await this.create({
						account,
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
						user,
					});
				}
			},
		},
	}
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
