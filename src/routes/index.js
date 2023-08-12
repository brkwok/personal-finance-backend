const authRouter = require("./auth");
const plaidRouter = require("./linkToken");
const itemsRouter = require("./items");

module.exports = {
	authRouter,
	plaidRouter,
	itemsRouter,
};
