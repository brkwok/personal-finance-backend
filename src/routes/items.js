const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../middlewares");

const { demoClient, client } = require("../helpers/plaid");

const {
	createItem,
	retrieveItemByPlaidInstitutionId,
	retrieveItemsByUser,
} = require("../controllers");
const updateTransactions = require("../helpers/plaidTransactions");

router.post("/", ensureAuthenticated, async function (req, res) {
	const userId = req.user.id;
	const username = req.user.username;

	const { publicToken, institutionId, accounts, institutionName } = req.body;

	const existingItem = await retrieveItemByPlaidInstitutionId(
		institutionId,
		userId
	);

	if (existingItem) {
		return res
			.status(409)
			.json("You have already linked an item at this institution.");
	}

	const plaidClient = username === "demo" ? demoClient : client;

	const response = await plaidClient.itemPublicTokenExchange({
		public_token: publicToken,
	});

	const accessToken = response.data.access_token;
	const itemId = response.data.item_id;

	const item = await createItem(
		institutionId,
		accessToken,
		itemId,
		userId,
		institutionName
	);

	const updated = await updateTransactions(itemId, plaidClient, userId);

	res.status(200).json({ message: "Item successfully created" });
});

router.post("/sandbox/item/reset_login", async (req, res) => {
	const userId = req.user.id;

	const items = await retrieveItemsByUser(userId);

	try {
		items.map(async (item) => {
			const { plaidAccessToken: access_token } = item;
			await demoClient.sandboxItemResetLogin({
				access_token,
			});
		});

		res.json("Successfully reset login");
	} catch (err) {
		console.error(err.message);
		res.status(500).json("Error resetting login");
	}
});

module.exports = router;
