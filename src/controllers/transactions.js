const { Transaction, Account, Item } = require("../models");

const { retrieveAccountByPlaidAccountId } = require("./accounts");

const createOrUpdateTransactions = async (transactions, userId) => {
	const pendingQueries = await transactions.map(async (transaction) => {
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

		const { _id: accountId } = await retrieveAccountByPlaidAccountId(
			plaidAccountId
		);

		const [category, subcategory] =
			categories !== null ? [categories[0], categories[1]] : [null, null];

		try {
			await Transaction.createOrUpdate(
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
			);
		} catch (err) {
			console.error(`createOrUpdate error: ${err.message}`);
		}
	});
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
		userId,
		transactionDate: {
			$gte: new Date(year, month - 1, 1),
			$lt: new Date(year, month, 1),
		},
	});

	return transactions;
};

const retrieveOldestTransaction = async (userId) => {
	const oldest = await Transaction.findOne(
		{ userId },
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
};
