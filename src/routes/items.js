const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../middlewares");

const { demoClient, client } = require("../helpers/plaid");

const {
	createItem,
	retrieveItemByPlaidInstitutionId,
} = require("../controllers/items");

router.post("/", ensureAuthenticated, async function (req, res) {
	const userId = req.user.id;
	const username = req.user.username;

	const { publicToken, institutionId, accounts } = req.body;

	const existingItem = await retrieveItemByPlaidInstitutionId(
		institutionId,
		userId
	);

	if (existingItem) {
		res
			.status(409)
			.send("You have already linked an item at this institution.");
	}

	const plaidClient = username === "demo" ? demoClient : client;

	const response = await plaidClient.itemPublicTokenExchange({
		public_token: publicToken,
	});

	const accessToken = response.data.access_token;
	const itemId = response.data.item_id;

	try {
		await createItem(institutionId, accessToken, itemId, userId, accounts);



		res.json("Item successfully created");
	} catch (err) {
		res.status(500).json("Error creating item");
	}
});

module.exports = router;
