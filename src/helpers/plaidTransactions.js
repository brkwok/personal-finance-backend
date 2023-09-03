const {
	retrieveItemByPlaidItemId,
	createAccounts,
	createOrUpdateTransactions,
	deleteTransactions,
	updateItemTransactionsCursor,
} = require("../controllers");

const fetchTransactionUpdates = async (plaidItemId, client) => {
	const { plaidAccessToken: accessToken, transactionsCursor: lastCursor } =
		await retrieveItemByPlaidItemId(plaidItemId);

	let cursor = lastCursor;

	let added = [];
	let modified = [];
	let removed = [];
	let hasMore = true;

	const batchSize = 100;

	try {
		while (hasMore) {
			const request = {
				access_token: accessToken,
				cursor: cursor,
				count: batchSize,
			};

			const res = await client.transactionsSync(request);
			const data = res.data;

			added = added.concat(data.added);
			modified = modified.concat(data.modified);
			removed = removed.concat(data.removed);
			hasMore = data.hasMore;
			cursor = data.next_cursor;
		}
	} catch (err) {
		console.error(`fetchTransactionUpdatesError: ${err.message}`);
		cursor = lastCursor;
	}

	return { added, modified, removed, cursor, accessToken };
};

const updateTransactions = async (
	plaidItemId,
	client,
	userId,
	updating = false
) => {
	const { added, modified, removed, cursor, accessToken } =
		await fetchTransactionUpdates(plaidItemId, client);

	const request = {
		access_token: accessToken,
	};

	const {
		data: { accounts },
	} = await client.accountsGet(request);

	try {
		if (!updating) {
			await createAccounts(plaidItemId, accounts, userId);
		}
		await createOrUpdateTransactions(added.concat(modified), userId);
		await deleteTransactions(removed);
		await updateItemTransactionsCursor(plaidItemId, cursor);
	} catch (err) {
		console.error(err.message);
	}

	return {
		addedCount: added.length,
		modifiedCount: modified.length,
		removedCount: removed.length,
	};
};

module.exports = updateTransactions;
