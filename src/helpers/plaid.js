const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const {
	PLAID_ENV,
	PLAID_CLIENT_ID,
	PLAID_SECRET,
	PLAID_DEMO_SECRET,
	PLAID_DEMO_ENV,
} = process.env;

class PlaidClient {
	constructor(plaidEnv) {
		const env = plaidEnv === "demo" ? PLAID_DEMO_ENV : PLAID_ENV;
		const secret = plaidEnv === "demo" ? PLAID_DEMO_SECRET : PLAID_SECRET;

		const configuration = new Configuration({
			basePath: PlaidEnvironments[env],
			baseOptions: {
				headers: {
					"PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
					"PLAID-SECRET": secret,
					"Plaid-Version": "2020-09-14",
				},
			},
		});

		this.client = new PlaidApi(configuration);
	}
}

const client = new PlaidClient().client;
const demoClient = new PlaidClient("demo").client;

module.exports = {
	client,
	demoClient,
};
