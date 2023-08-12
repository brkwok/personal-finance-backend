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

const retrieveItemByPlaidInstitutionId = async (plaidInstitutionId, userId) => {
	const item = await Item.findOne({
		plaidInstitutionId,
		userId,
	});

	return item;
};

module.exports = {
	createItem,
	retrieveItemByPlaidInstitutionId,
};
