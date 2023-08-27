MONGO_URI=

SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLIENT_LOGIN_REDIRECT=
CLIENT_LOGIN_FAILURE_REDIRECT=
DEMO_USERID=
DEMO_PASSWORD=

# Get your Plaid API keys from the dashboard: https://dashboard.plaid.com/team/keys
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_DEMO_SECRET=


# Use 'sandbox' to test with fake credentials in Plaid's Sandbox environment
# Use 'development' to test with real credentials while developing
# Use 'production' to go live with real users
PLAID_ENV=development
PLAID_DEMO_ENV=sandbox

# PLAID_PRODUCTS is a comma-separated list of products to use when
# initializing Link, e.g. PLAID_PRODUCTS=auth,transactions.
# see https://plaid.com/docs/api/tokens/#link-token-create-request-products for a complete list.
# Only institutions that support ALL listed products will be displayed in Link.
# If you don't see the institution you want in Link, remove any products you aren't using.
# Some products (Payment Initiation, Payroll or Document Income, Identity Verification) cannot be specified
# Alongside other products.
# NOTE: The Identity Verification (IDV) and Income APIs have separate Quickstart apps. 
# For IDV, use https://github.com/plaid/idv-quickstart 
# For Income, use https://github.com/plaid/income-sample
# Important:
# When moving to Production, make sure to update this list with only the products
# you plan to use. Otherwise, you may be billed for unneeded products.
PLAID_PRODUCTS=transactions

# PLAID_COUNTRY_CODES is a comma-separated list of countries to use when
# initializing Link, e.g. PLAID_COUNTRY_CODES=US,CA.
# Institutions from all listed countries will be shown. If Link is launched with multiple country codes,
# only products that you are enabled for in all countries will be used by Link.
# See https://plaid.com/docs/api/tokens/#link-token-create-request-country-codes for a complete list
PLAID_COUNTRY_CODES=US,CA

# PLAID_REDIRECT_URI is optional for this Quickstart application.
# If you're not sure if you need to use this field, you can leave it blank
#
# If using this field on Sandbox, set PLAID_REDIRECT_URI to 'http://localhost:3000/'
# The OAuth redirect flow requires an endpoint on the developer's website
# that the bank website should redirect to. You will need to configure
# this redirect URI for your client ID through the Plaid developer dashboard
# at https://dashboard.plaid.com/team/api.
# For development or production, you will need to use an https:// url
# Instructions to create a self-signed certificate for localhost can be found at https://github.com/plaid/quickstart/blob/master/README.md#testing-oauth
PLAID_REDIRECT_URI=
