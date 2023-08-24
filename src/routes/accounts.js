const express = require("express");
const router = express.Router();

const { retreiveAccountsByUserId } = require("../controllers");

router.get("/", async function (req, res) {
	const userId = req.user.id;

	try {
		const accounts = await retreiveAccountsByUserId(userId);

		res.json(accounts);
	} catch (error) {
		console.error("Error retrieving user accounts", error.message);
		res.json({ error });
	}
});

module.exports = router;
