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
		userId: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
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
				userId
			) {
				const transaction = await this.findOne({ plaidTransactionId });

				if (transaction) {
					await transaction
						.overwrite({
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
							userId,
						})
						.save();
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
						userId,
					});
				}
			},
		},
	}
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
