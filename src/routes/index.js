const authRouter = require("./auth");
const plaidRouter = require("./linkToken");
const itemsRouter = require("./items");
const transactionsRouter = require("./transactions");

module.exports = {
	authRouter,
	plaidRouter,
	itemsRouter,
	transactionsRouter,
};
