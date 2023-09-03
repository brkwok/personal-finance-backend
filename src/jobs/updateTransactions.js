/**
 * Node.js script for scheduling and running periodic Plaid transaction updates.
 * Uses node-cron to execute the update process every 3 hours.
 * @module ScheduledJob
 */

const cron = require("node-cron");
/**
 * Plaid API clients for both demo and production environments.
 * @typedef {Object} PlaidClients
 * @property {Object} demoClient - Plaid client for the demo environment.
 * @property {Object} client - Plaid client for the production environment.
 */
const { demoClient, client } = require("../helpers/plaid");
/**
 * Mongoose models for database operations.
 * @typedef {Object} DatabaseModels
 * @property {Function} Item - Mongoose model for items.
 * @property {Function} User - Mongoose model for users.
 */
const { Item, User } = require("../models");
const updateTransactions = require("../helpers/plaidTransactions");

/**
 * Function to update transactions for all Plaid items.
 * @async
 * @function updateItemTransactions
 * @returns {Promise<Array>} - A Promise that resolves to an array of update results.
 */
const updateItemTransactions = async () => {
	// Fetch all items from the database
	const items = await Item.find();

	// Create an array of queries to update transactions for each item
	const queries = items.map(async (item) => {
		// Extract the Plaid item ID and user ID from the item
		const { plaidItemId, user: userId } = item;

		// Find the user's username based on their user ID
		const { username } = await User.findById(userId);

		// Use the appropriate Plaid client (demo or production) based on the username
		let plaidClient = client;
		if (username && username === "demo") {
			plaidClient = demoClient;
		}

		// Update transactions for the item using the Plaid client
		await updateTransactions(plaidItemId, plaidClient, userId, true);
	});

	return await Promise.all(queries);
};

/**
 * Cron job for updating Plaid transactions.
 * Runs every 3 hours (0,3,6,9,12,15,18,21).
 * @function
 */
cron.schedule("* 0,3,6,9,12,15,18,21 * * *", async () => {
	try {
		console.log("Updating transactions for all items");
		await updateItemTransactions();
		console.log("Update complete");
	} catch (e) {
		console.error(e);
	}
});
