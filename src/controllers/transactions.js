const { retrieveUserById } = require("./users");
const { Transaction, Account } = require("../models");
const { retrieveAccountByPlaidAccountId } = require("./accounts");
const { Types } = require("mongoose");

const createOrUpdateTransactions = async (transactions, userId) => {
	const pendingQueries = transactions.map(async (transaction, i) => {
		const {
			account_id: plaidAccountId,
			transaction_id: plaidTransactionId,
			category_id: plaidCategoryId,
			category: categories,
			transaction_type: transactionType,
			name: transactionName,
			amount,
			iso_currency_code: isoCurrencyCode,
			unofficial_currency_code: unofficialCurrencyCode,
			date: transactionDate,
			pending,
			account_owner: accountOwner,
		} = transaction;

		const account = await retrieveAccountByPlaidAccountId(plaidAccountId);

		const user = await retrieveUserById(userId);

		const [category, subcategory] =
			categories !== null ? [categories[0], categories[1]] : ["Other", "Other"];

		try {
			await Transaction.createOrUpdate(
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
			);
		} catch (err) {
			console.error(`createOrUpdate error: ${err.message}`);
		}
	});

	return await Promise.all(pendingQueries);
};

const retrieveTransactionsByAccountId = async (accountId) =>
	await Transaction.find({ accountId });

const retrieveTransactionsByItemId = async (itemId) =>
	await Account.find({ itemId }).populate("transactions");

const retrieveTransactionsByUserId = async (
	userId,
	year = new Date().getFullYear(),
	month = new Date().getMonth()
) => {
	const transactions = await Transaction.find({
		user: userId,
		transactionDate: {
			$gte: new Date(year, month - 1, 1),
			$lt: new Date(year, month, 1),
		},
	}).sort({ transactionDate: -1 });

	return transactions;
};

const retrieveTransactionAggregation = async (
	userId,
	year = new Date().getFullYear(),
	month = new Date().getMonth()
) => {

	const currentMonthAggregation = await Transaction.aggregate([
		{
			$match: {
				user: new Types.ObjectId(userId),
				transactionDate: {
					$gte: new Date(year, month - 1, 1),
					$lt: new Date(year, month, 1),
				},
			},
		},
		{
			$group: {
				_id: {
					$ifNull: ["$category", "Other"],
				},
				totalAmount: {
					$sum: { $abs: "$amount" },
				},
			},
		},
		{
			$project: {
				category: "$_id",
				totalAmount: 1,
				_id: 0,
			},
		},
	]);

	const previousMonthAggregation = await Transaction.aggregate([
		{
			$match: {
				user: new Types.ObjectId(userId),
				transactionDate: {
					$gte: new Date(year, month - 2, 1),
					$lt: new Date(year, month - 1, 1),
				},
			},
		},
		{
			$group: {
				_id: {
					$ifNull: ["$category", "Other"],
				},
				totalAmount: {
					$sum: { $abs: "$amount" },
				},
			},
		},
		{
			$project: {
				category: "$_id",
				totalAmount: 1,
				_id: 0,
			},
		},
	]);

	const monthBeforePreviousAggregation = await Transaction.aggregate([
		{
			$match: {
				user: new Types.ObjectId(userId),
				transactionDate: {
					$gte: new Date(year, month - 3, 1),
					$lt: new Date(year, month - 2, 1),
				},
			},
		},
		{
			$group: {
				_id: {
					$ifNull: ["$category", "Other"],
				},
				totalAmount: {
					$sum: { $abs: "$amount" },
				},
			},
		},
		{
			$project: {
				category: "$_id",
				totalAmount: 1,
				_id: 0,
			},
		},
	]);

	return {
		currentMonthAggregation,
		previousMonthAggregation,
		monthBeforePreviousAggregation,
		month: new Date(year, month - 1, 1),
	};
};

const retrieveDistinctCategories = async (userId) => {
	function customSort(a, b) {
		if (a[0] === "Other") return 1; // Move "Other" to the end
		if (b[0] === "Other") return -1; // Keep "Other" in place
		return 0; // No change for other categories
	}

	try {
		const distinctCategories = await Transaction.distinct("category", {
			user: userId,
		});

		return distinctCategories.sort(customSort);
	} catch (error) {
		console.error("Error fetching distinct categories", error);
		throw error;
	}
};

const retrieveOldestTransaction = async (userId) => {
	const oldest = await Transaction.findOne(
		{ user: userId },
		{},
		{ sort: { transactionDate: 1 } }
	);

	return oldest;
};

const deleteTransactions = async (plaidTransactionIds) => {
	try {
		plaidTransactionIds.map(async (plaidTransactionId) => {
			await Transaction.findOneAndDelete({ plaidTransactionId });
		});
	} catch (err) {
		console.error(err.message);
		throw new Error(err);
	}
};

module.exports = {
	createOrUpdateTransactions,
	retrieveTransactionsByAccountId,
	retrieveTransactionsByItemId,
	retrieveTransactionsByUserId,
	deleteTransactions,
	retrieveOldestTransaction,
	retrieveTransactionAggregation,
	retrieveDistinctCategories,
};
