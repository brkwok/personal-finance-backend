const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		// If the user is authenticated, proceed to the next middleware/route handler
		return next();
	} else {
		// redirect user to the login
		res.status(401).send({ message: "You must be logged in" });
	}
};

module.exports = ensureAuthenticated;
