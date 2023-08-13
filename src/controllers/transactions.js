const { Transaction, Account, Item } = require("../models");

const { retrieveAccountByPlaidAccountId } = require("./accounts");

const createOrUpdateTransactions = async (transactions) => {
	const pendingQueries = transactions.map(async (transaction) => {
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
				accountOwner
			);
		} catch (err) {
			console.error("createOrUpdate error");
		}
	});
};

const retrieveTransactionsByAccountId = async (accountId) =>
	await Transaction.find({ accountId });

const retrieveTransactionsByItemId = async (itemId) =>
	await Account.find({ itemId }).populate("transactions");

const retrieveTransactionsByUserId = async (userId) => {
	const items = await Item.find({ userId })
		.populate({
			path: "accounts",
			populate: {
				path: "transactions",
				model: "Transaction",
			},
		})
		.exec((err, items) => {
			if (err) {
				console.error(err.message);
				return;
			}
		});

	const transactions = items.flatMap((item) =>
		item.accounts.flatMap((account) => account.transactions)
	);

	return transactions;
};

const deleteTransactions = async (plaidTransactionIds) => {
	const queries = plaidTransactionIds.map(async (plaidTransactionId) => {
		await Transaction.findOneAndDelete({ plaidTransactionId });
	});

	return queries;
};

module.exports = {
	createOrUpdateTransactions,
	retrieveTransactionsByAccountId,
	retrieveTransactionsByItemId,
	retrieveTransactionsByUserId,
	deleteTransactions,
};
