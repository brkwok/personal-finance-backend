const { Transaction } = require("../models");

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

		const { id: accountId } = await retrieveAccountByPlaidAccountId(
			plaidAccountId
		);

		const [category, subcategory] = categories;

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
			console.error(err.message);
		}

		return pendingQueries;
	});
};
