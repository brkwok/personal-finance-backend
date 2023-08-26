ObjectId = require("mongoose").Types.ObjectId;
const { retrieveUserById } = require("./users");
const { Item } = require("../models");

const createItem = async (
	plaidInstitutionId,
	plaidAccessToken,
	plaidItemId,
	userId,
	institutionName
) => {
	const status = "good";

	let item = null;
	const user = await retrieveUserById(userId);

	try {
		item = await new Item({
			plaidAccessToken,
			plaidInstitutionId,
			plaidItemId,
			user,
			status,
			institutionName,
		}).save();
	} catch (err) {
		console.error(err.message);
	}

	return item;
};

/**
 *
 * @param {string} itemId
 * @returns {Object}
 */
const retrieveItemById = async (itemId) => await Item.findById(itemId);

/**
 *
 * @param {string} plaidInstitutionId
 * @param {string} userId
 * @returns {Object}
 */
const retrieveItemByPlaidInstitutionId = async (plaidInstitutionId, userId) =>
	await Item.findOne({ user: userId, plaidInstitutionId });

/**
 *
 * @param {string} plaidAccessToken
 * @returns {Object}
 */
const retrieveItemByPlaidAccessToken = async (plaidAccessToken) =>
	await Item.findOne({ plaidAccessToken });

/**
 *
 * @param {string} plaidItemId
 * @returns {Ojbect}
 */
const retrieveItemByPlaidItemId = async (plaidItemId) =>
	await Item.findOne({ plaidItemId });

/**
 *
 * @param {string} userId
 * @returns {Object[]}
 */
const retrieveItemsByUser = async (userId) => await Item.find({ user: userId });

/**
 *
 * @param {string} itemId
 * @param {string} status
 * @returns {Object}
 */
const updateItemStatus = async (itemId, status) =>
	await Item.findOneAndUpdate({ _id: itemId }, { status });

/**
 *
 * @param {string} itemId
 * @param {string} transactionsCursor
 * @returns {Object}
 */
const updateItemTransactionsCursor = async (
	plaidItemId,
	transactionsCursor
) => {
	const item = await Item.findOne({ plaidItemId });

	item.transactionsCursor = transactionsCursor;

	await item.save();
};

/**
 *
 * @param {string} itemId
 */
const deleteItem = async (itemId) => {
	await Item.findOneAndDelete({ _id: itemId });
};

module.exports = {
	createItem,
	retrieveItemById,
	retrieveItemByPlaidInstitutionId,
	retrieveItemByPlaidAccessToken,
	retrieveItemByPlaidItemId,
	retrieveItemsByUser,
	updateItemStatus,
	updateItemTransactionsCursor,
	deleteItem,
};
