const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//Database
const db = require('../models')

//Passport "serialize" info to be able to login
//cb: callback]
//Saving id to session
passport.serializeUser((user, cb) => {
	cb(null, user.id)
})

//Find user by the id
passport.deserializeUser((id, cb) => {
	//check to see if we can find an ID in the database
	db.user.findByPk(id)
	.then(user => {
		if (user) {
			cb(null, user)
		}
		console.log('User is null...')
	})
	.catch(error => {
		console.log("There is an error:")
		console.log(error)
	})
})

passport.use(new LocalStrategy({
	//LocalStrategy has a username field
	usernameField: 'email',
	passwordField: 'password'
}, (email, password, cb) => {
	//Check database to see if we can find user by the email
	//Once we get that information back, check to see if password is valid
	db.user.findOne({
		//Second email is parameter from line 32
		where: { email:email }
	})
	.then(user => {
		//user comes from our models directory
		if (!user || !user.validPassword(password)) {
			cb(null, false)
		} else {
			cb(null, user)
		}
	})
	.catch(error => {
		console.log("Error:")
		console.log(error)
	})
}))

module.exports = passport