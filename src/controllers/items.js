ObjectId = require("mongoose").Types.ObjectId;
const { Item } = require("../models");

const createItem = async (
	plaidInstitutionId,
	plaidAccessToken,
	plaidItemId,
	userId
) => {
	const status = "good";

	let item = null;
	try {
		item = await new Item({
			plaidAccessToken,
			plaidInstitutionId,
			plaidItemId,
			userId,
			status,
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
	await Item.findOne({ userId, plaidInstitutionId });

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
const retrieveItemsByUser = async (userId) => await Item.find({ userId });

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
const updateItemTransactionsCursor = async (itemId, transactionsCursor) =>
	await Item.findOneAndUpdate(
		{ _id: itemId },
		{ transactionsCursor }
	);

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
