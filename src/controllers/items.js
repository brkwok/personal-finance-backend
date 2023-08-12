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

const retrieveItemById = async (itemId) => await Item.findById(itemId);

const retrieveItemByPlaidInstitutionId = async (plaidInstitutionId, userId) =>
	await Item.findOne({ userId, plaidInstitutionId });

const retrieveItemByPlaidAccessToken = async (plaidAccessToken) =>
	await Item.findOne({ plaidAccessToken });

const retrieveItemByPlaidItemId = async (plaidItemId) =>
	await Item.findOne({ plaidItemId });

const retrieveItemsByUser = async (userId) => await Item.find({ userId });

const updateItemStatus = async (itemId, status) =>
	await Item.findOneAndUpdate({ _id: itemId }, { status });

const updateItemTransactionsCursor = async (itemId, transactionsCursor) =>
	await Item.findOneAndUpdate({ _id: itemId }, { transactionsCursor });

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
