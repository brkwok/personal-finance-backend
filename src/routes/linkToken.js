const express = require("express");
const { User, PlaidToken } = require("../models");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const {
	Configuration,
	PlaidApi,
	Products,
	PlaidEnvironments,
} = require("plaid");

const { client, demoClient } = require("../helpers/plaid");

const router = express.Router();

const PLAID_PRODUCTS = (
	process.env.PLAID_PRODUCTS || Products.Transactions
).split(",");

const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
	","
);

const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

router.post("/info", function (req, res, next) {
	res.send({
		products: process.env.PLAID_PRODUCTS,
	});
});

router.post(
	"/link_token",
	ensureAuthenticated,
	async function (req, res, next) {
		// Get the client_user_id by searching for the current user
		const clientUserId = req.user.id;
		const username = req.user.username;

		const configs = {
			user: {
				client_user_id: clientUserId,
			},
			client_name: "Personal Finance",
			products: PLAID_PRODUCTS,
			country_codes: PLAID_COUNTRY_CODES,
			language: "en",
		};

		let redirect_uri = PLAID_REDIRECT_URI;

		if (redirect_uri.indexOf("http") === 0) {
			configs.redirect_uri = redirect_uri;
		}

		try {
			let createTokenResponse;
			if (username && username === "demo") {
				createTokenResponse = await demoClient.linkTokenCreate(configs);
			} else {
				createTokenResponse = await client.linkTokenCreate(configs);
			}

			res.json(createTokenResponse.data);
		} catch (error) {
			console.error(error.message);

			res.json(err.response.data);
		}
	}
);

module.exports = router;
