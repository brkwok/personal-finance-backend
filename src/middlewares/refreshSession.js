const refreshSession = (req, res, next) => {
	if (req.session) {
		// Reset the maxAge of the session cookie to extend the session
		req.session.cookie.maxAge = 1000 * 60 * 60; // 60 minutes (adjust the duration as needed)
	}
	next();
};

module.exports = refreshSession;
