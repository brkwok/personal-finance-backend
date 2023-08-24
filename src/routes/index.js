const authRouter = require("./auth");
const plaidRouter = require("./linkToken");
const itemsRouter = require("./items");
const transactionsRouter = require("./transactions");
const accountsRouter = require("./accounts");

module.exports = {
	authRouter,
	plaidRouter,
	itemsRouter,
	transactionsRouter,
	accountsRouter,
};
