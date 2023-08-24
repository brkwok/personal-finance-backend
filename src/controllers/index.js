const {
	createItem,
	retrieveItemById,
	retrieveItemByPlaidInstitutionId,
	retrieveItemByPlaidAccessToken,
	retrieveItemByPlaidItemId,
	retrieveItemsByUser,
	updateItemStatus,
	updateItemTransactionsCursor,
	deleteItem,
} = require("./items");

const {
	createAccounts,
	retrieveAccountByPlaidAccountId,
	retrieveAccountsByItemId,
	retreiveAccountsByUserId,
} = require("./accounts");

const {
	createOrUpdateTransactions,
	retrieveTransactionsByAccountId,
	retrieveTransactionsByItemId,
	retrieveTransactionsByUserId,
	deleteTransactions,
	retrieveOldestTransaction,
	retrieveTransactionAggregation,
	retrieveDistinctCategories,
} = require("./transactions");

const {
	retrieveUserById
} = require("./users")

module.exports = {
	// items
	createItem,
	retrieveItemById,
	retrieveItemByPlaidInstitutionId,
	retrieveItemByPlaidAccessToken,
	retrieveItemByPlaidItemId,
	retrieveItemsByUser,
	updateItemStatus,
	updateItemTransactionsCursor,
	deleteItem,
	// accounts
	createAccounts,
	retrieveAccountByPlaidAccountId,
	retrieveAccountsByItemId,
	retreiveAccountsByUserId,
	//transactions
	createOrUpdateTransactions,
	retrieveTransactionsByAccountId,
	retrieveTransactionsByItemId,
	retrieveTransactionsByUserId,
	deleteTransactions,
	retrieveOldestTransaction,
	retrieveTransactionAggregation,
	retrieveDistinctCategories,
	//users
	retrieveUserById
};
