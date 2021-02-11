function isLoggedIn(req, res, next) {
	//Check to see if req.user exists
	if (!req.user) {
		req.flash('error', 'You must be signed in to do that!')
	} else {
		//If they are signed in, run the next function
		next()
	}
}

module.exports = isLoggedIn