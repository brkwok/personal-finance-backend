const { Account } = require("../models");

const createAccounts = async (plaidItemId, accounts) => {};

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
