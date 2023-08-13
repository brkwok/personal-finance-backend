const { Account } = require("../models");
const { retrieveItemByPlaidItemId } = require("./items");

const createAccounts = async (plaidItemId, accounts) => {
	console.log("plaidItemId", plaidItemId);
	const { _id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);

	const queries = accounts.map(async (account) => {
		const {
			account_id: plaidAccountId,
			name,
			mask,
			official_name: officialName,
			balances: {
				available: availableBalance,
				current: currentBalance,
				iso_currency_code: isoCurrencyCode,
				unofficial_currency_code: unofficialCurrencyCode,
			},
			subtype,
			type,
		} = account;

		const acc = await Account.create({
			itemId,
			plaidAccountId,
			name,
			mask,
			officialName,
			availableBalance,
			currentBalance,
			isoCurrencyCode,
			unofficialCurrencyCode,
			subtype,
			type,
		});
		return acc;
	});

	return queries;
};

const retrieveAccountByPlaidAccountId = async (plaidAccountId) => {
	const accounts = await Account.findByPlaidAccountId(plaidAccountId);

	return accounts;
};

const retrieveAccountsByItemId = async (itemId) => {
	const accounts = await Account.findByItemId(itemId);

	return accounts;
};

const retreiveAccountsByUserId = async (userId) => {
	const accounts = await Account.findByUserId(userId);

	return accounts;
};

module.exports = {
	createAccounts,
	retrieveAccountByPlaidAccountId,
	retrieveAccountsByItemId,
	retreiveAccountsByUserId,
};
