require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const {
	Configuration,
	PlaidApi,
	Products,
	PlaidEnvironments,
} = require("plaid");

const router = express.Router();

const PLAID_PRODUCTS = (
	process.env.PLAID_PRODUCTS || Products.Transactions
).split(",");

const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
	","
);

const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

// We store the access_token in memory - in production, store it in a secure
// persistent data store
// let ACCESS_TOKEN = null;
// let PUBLIC_TOKEN = null;
// let ITEM_ID = null;
// // The payment_id is only relevant for the UK/EU Payment Initiation product.
// // We store the payment_id in memory - in production, store it in a secure
// // persistent data store along with the Payment metadata, such as userId .
// let PAYMENT_ID = null;
// // The transfer_id is only relevant for Transfer ACH product.
// // We store the transfer_id in memory - in production, store it in a secure
// // persistent data store
// let TRANSFER_ID = null;

const configuration = new Configuration({
	basePath: PlaidEnvironments[process.env.PLAID_ENV],
	baseOptions: {
		headers: {
			"PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
			"PLAID-SECRET": process.env.PLAID_SECRET,
		},
	},
});

const client = new PlaidApi(configuration);

router.post("/info", function (req, res, next) {
	res.send({
		products: process.env.PLAID_PRODUCTS,
	});
});

router.post(
	"/exchange_token",
	ensureAuthenticated,
	async function (req, res, next) {
		// Get the client_user_id by searching for the current user
		const clientUserId = req.user.id;

		const configs = {
			user: {
				client_user_id: clientUserId,
			},
			client_name: "Personal Finance",
			products: PLAID_PRODUCTS,
			country_codes: PLAID_COUNTRY_CODES,
			language: "en",
		};

		try {
			const createTokenResponse = await client.linkTokenCreate(configs);

			res.json(createTokenResponse.data);
		} catch (error) {
			console.error(error);

			res.status(500).send("Create link token error");
		}
	}
);

router.post(
	"/set_access_token",
	ensureAuthenticated,
	async function (req, res, next) {
    const userId = req.user.id

		const user = await User.findById(userId);

    const accessToken = req.body.access_token

		res.status(200).send("hi");
	}
);

module.exports = router;
