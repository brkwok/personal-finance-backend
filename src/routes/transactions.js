const express = require("express");

const router = express.Router();

const {
	retrieveTransactionsByUserId,
	retrieveOldestTransaction,
} = require("../controllers");

router.post("/", async (req, res) => {
	const userId = req.user.id;
	const { year, month } = req.body;

	try {
		const transactions = await retrieveTransactionsByUserId(
			userId,
			year,
			month
		);

		res.json(transactions);
	} catch (err) {
		console.error("Error retrieving transactions", err.message);
		res.status(500).json(err);
	}
});

router.get("/range", async (req, res) => {
	const userId = req.user.id;

	try {
		const oldest = await retrieveOldestTransaction(userId);
		const transactionDate = oldest?.transactionDate;

		const year = transactionDate
			? transactionDate.getFullYear()
			: new Date().getFullYear();

		res.json({ year });
	} catch (err) {
		console.error(`Error retrieving oldest transaction record ${err.message}`);
		res.status(500).json({ error: err });
	}
});

module.exports = router;
