const { retrieveUserById } = require("./users");
const { Account, Item, User } = require("../models");
const { retrieveItemByPlaidItemId, retrieveItemsByUser } = require("./items");

const createAccounts = async (plaidItemId, accounts, userId) => {
	const item = await retrieveItemByPlaidItemId(plaidItemId);
	const user = await retrieveUserById(userId);

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

		await Account.create({
			item,
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
			user,
		});
	});

	return await Promise.all(queries);
};

const retrieveAccountByPlaidAccountId = async (plaidAccountId) => {
	const account = await Account.findByPlaidAccountId(plaidAccountId);

	return account;
};

const retrieveAccountsByItemId = async (itemId) => {
	const accounts = await Account.findByItemId(itemId);

	return accounts;
};

const retreiveAccountsByUserId = async (userId) => {
	const items = await retrieveItemsByUser(userId);

	const accountsMap = {};

	await Promise.all(
		items.map(async (item) => {
			const { _id } = item;

			const itemAccounts = await retrieveAccountsByItemId(_id);

			if (accountsMap[item.institutionName] === undefined) {
				accountsMap[item.institutionName] = itemAccounts;
			} else {
				accountsMap[item.institutionName].push(...itemAccounts);
			}
		})
	);

	return accountsMap;
};

module.exports = {
	createAccounts,
	retrieveAccountByPlaidAccountId,
	retrieveAccountsByItemId,
	retreiveAccountsByUserId,
};
