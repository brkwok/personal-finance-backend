# Personal Finance Backend

Welcome to the Personal Finance Backend repository! This backend server is built using Node.js, Express, and MongoDB. It powers the personal finance management application's backend, providing API endpoints for managing user authentication, financial transactions, budgets, and more.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Runnign the server](#running-the-server)
  - [Configuration](#configuration)
- [API Routes](#api-routes)
- [Plaid Integration](#plaid-integration)
- [Data Schema](#data-schema)

## Features

- User Authentication: Secure user registration and authentication system.
- Plaid Integration: Integrated with Plaid API for financial data retrieval.
- Transaction Management: Record and manage financial transactions.
- Budget Tracking: Keep track of expenses and budgets.
- Secure Session Management: Utilizes Express session and MongoDB to manage user sessions securely.

## Getting Started

### Prerequisites

- <u><b>Node.js</b></u> and <u><b>npm</b></u> installed.
- <u><b>MongoDB</b></u> database instance or connection URI.
- <u><b>Plaid API</b></u> credentials for Plaid integration.

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/brkwok/personal-finance-backend.git
```

2. Navigate to the project directory

```bash
cd personal-finance-backend
```

3. Install dependencies:

```bash
npm install
```

### Configuration

1. Create a `.env` file in the root directory based on `.env.cpy`:

```bash
cp .env.example .env
```

2. Configure the .env file with your environment variables, including MongoDB connection URI, session secret, and Plaid API credentials if applicable.

### Running the Server

1. Start the serveR:

```bash
npm start
```

The server will be accessible at `http://localhost:5000`

## API Routes

This backend application provides the following API routes to manage personal finance data:

### Accounts

- GET /accounts
  - Retrieves accounts associated with the authenticated user.
  - Requires authentication.
  - Example Response:
    ```json
    [
    	{
    		"_id": "account_id_1",
    		"name": "Checking Account",
    		"balance": 1200.5,
    		"type": "checking",
    		"userId": "user_id_1"
    	},
    	{
    		"_id": "account_id_2",
    		"name": "Savings Account",
    		"balance": 5000,
    		"type": "savings",
    		"userId": "user_id_1"
    	}
    ]
    ```

### Authentication

- GET /auth/federated/google
  - Initiates Google OAuth2 authentication
- GET /auth/redirect/google
  - Handles the callback after successful GOOGLE OAuth2 authentication
- POST /auth/demo
  - Logs in a user with demo credentials (Passport.js local strategy)
  - Example Request:
    ```json
    {
    	"username": "demo",
    	"password": "123456"
    }
    ```
  - Example Response:
    ```json
    {
    	"displayName": "Demo User",
    	"profilePicUrl": "https://example.com/demo-avatar.png"
    }
    ```
- POST /auth/logout
  - Logs out the authenticated user.
- GET /auth/user
  - Retrieves authenticated user's information
  - requires authentication (secure cookie)
  - Example Response:
    ```json
    {
    	"displayName": "John Doe",
    	"profilePicUrl": "https://example.com/avatar.png"
    }
    ```

### Items

- POST /items
  - Links a financial institution item to the authenticated user.
  - Requires authentication
  - Example Request:
    ```json
    {
    	"publicToken": "plaid_public_token",
    	"institutionId": "institution_id",
    	"institutionName": "Chase Bank"
    }
    ```
  - Example Response:
    ```json
    {
    	"message": "Item successfully created"
    }
    ```

### Link Token

- POST /link-token/info
  - Retrieves information about supported Plaid products
- POST /link-token/link-token

  - Generates a link token for Plaid Link integration
  - Requires authentication
  - Example Response (Link Token):
    ```json
    {
    	"link_token": "generated_link_token"
    }
    ```

### Transactions

- POST /transactions
  - Requires Authentication
  - Retrieves transactions for a given year and month
  - Retrieves all categories that exist for the transactions
  - Aggregates total spent by categories and returns the aggregation of given month, previous month, and month before the previous month
  - Example Request:
    ```json
    {
    	"year": 2023,
    	"month": 7
    }
    ```
  - Example Response:
    ```json
      {
        "transactions": [...],
        "aggregation": {...},
        "categories": [...]
      }
    ```
- GET /transactions/range
  - Retrieves the oldest transaction's year for date range selection
  - Requires authentication
  - Example Response:
    ```json
    {
    	"year": 2020
    }
    ```

## Plaid Integration

This backend utilizes Plaid API for financial data retrieval and integration. The Plaid Client is set up using the provided configuration, allowing seamless interaction with Plaid services.

### Plaid Client Configuration

The Plaid Client configuration is defined in `helpers/plaid.js`:

```javascript
// helpers/plaid.js
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

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
```

### Fetching Transactions from Plaid

Transactions are fetched from Plaid using the `updateTransactions` function defined in `helpers/plaidTransactions.js`:

```javascript
// helpers/plaidTransactions.js
const {
	retrieveItemByPlaidItemId,
	createAccounts,
	createOrUpdateTransactions,
	deleteTransactions,
	updateItemTransactionsCursor,
} = require("../controllers");
const { Account } = require("../models");

const fetchTransactionUpdates = async (plaidItemId, client) => {
	// ... (implementation details)
};

const updateTransactions = async (plaidItemId, client, userId) => {
	// ... (implementation details)
};

module.exports = updateTransactions;
```

The `updateTransactions` function fetches transaction updates from Plaid, manages accounts and transactions in the database, and updates the transactions cursor.

### Using Plaid Integration

Whenever a user links a financial institution item to their account, the `updateTransactions` function can be used to fetch and update their transaction data. This ensures that the user's financial data remains up to date and synchronized.

For a complete example of how Plaid integration is used in the application, refer to the corresponding routes and controllers in the source code.

## Data Schema

The backend application follows a specific data schema for storing and managing personal finance data. This schema is implemented using Mongoose models. Below is an overview of the data schema and the corresponding models.

### User Model

The `User` model represents user accounts and includes information such as usernames, passwords, and profile details.

```javascript
// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
	items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
	accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
	googleId: {
		type: String,
		required: true,
		unique: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	profilePicUrl: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	username: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

### Item Model

The `Item` model is used to store information about linked financial institution items.

```javascript
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	accounts: [
		{
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Account",
		},
	],
	plaidAccessToken: {
		type: String,
		unique: true,
		required: true,
	},
	plaidItemId: {
		type: String,
		unique: true,
		required: true,
	},
	plaidInstitutionId: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	institutionName: {
		type: String,
		default: "",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	transactionsCursor: {
		type: String,
	},
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
```

### Account Model

The `Account` model represents financial accounts associated with a user.

```javascript
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
	{
		item: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		transactions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Transaction",
			},
		],
		plaidAccountId: {
			type: String,
			unique: true,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		mask: {
			type: String,
			required: true,
		},
		officialName: {
			type: String,
		},
		currentBalance: {
			type: Number,
		},
		availableBalance: {
			type: Number,
		},
		isoCurrencyCode: {
			type: String,
		},
		unofficialCurrencyCode: {
			type: String,
		},
		type: {
			type: String,
			required: true,
		},
		subtype: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			de	async findByPlaidAccountId(plaidAccountId) {
				return await this.findOne({ plaidAccountId });
			},
			async findByUserId(userId) {
				return await this.find({ userId });
			},
			async findByItemId(itemId) {
				return await this.find({ item: itemId });
			},
		statics: {
		// statics functions
		},
	}
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
```

### Transaction Model

The `Transaction` model stores financial transaction data.

```javascript
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
	{
		account: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Account",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		plaidTransactionId: {
			type: String,
			unique: true,
			required: true,
		},
		plaidCategoryId: {
			type: String,
		},
		category: {
			type: String,
			default: "Other",
		},
		subcategory: {
			type: String,
		},
		transactionType: {
			type: String,
			required: true,
		},
		transactionName: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		isoCurrencyCode: {
			type: String,
		},
		unofficialCurrencyCode: {
			type: String,
		},
		transactionDate: {
			type: Date,
			required: true,
			index: true,
		},
		pending: {
			type: Boolean,
			required: true,
		},
		accountOwner: {
			type: String,
		},
		note: {
			type: String,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		statics: {
			// statics functions
		},
	}
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
```
