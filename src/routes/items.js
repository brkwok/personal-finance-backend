const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../middlewares");

const { demoClient, client } = require("../helpers/plaid");

const {
	createItem,
	retrieveItemByPlaidInstitutionId,
} = require("../controllers");
const updateTransactions = require("../helpers/plaidTransactions");

router.post("/", ensureAuthenticated, async function (req, res) {
	const userId = req.user.id;
	const username = req.user.username;

	const { publicToken, institutionId, accounts } = req.body;

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
		accounts
	);

	const updated = await updateTransactions(itemId, plaidClient);

	res.status(200).json({ message: "Item successfully created", item });
});

module.exports = router;
