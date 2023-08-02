const Boom = require("@hapi/boom");

const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		// If the user is authenticated, proceed to the next middleware/route handler
		return next();
	} else {
		// redirect user to the login
		return res.redirect("/login");
	}
};

module.exports = ensureAuthenticated;
