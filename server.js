require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session')
//passport library was already required in ppConfig, so we just require the relative path here
const passport = require('./config/ppConfig')
const flash = require('connect-flash')

const app = express();
app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

//Session middleware

// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true

const sessionObject = {
  	secret: process.env.SECRET_SESSION,
  	//Saves a session even when it's modified, so we set it to false
  	resave: false,
  	saveUninitialized: true
}
//Allows use to use sessions throughout
app.use(session(sessionObject));
//Passport
//Initialize passport
app.use(passport.initialize())
//Add a session
app.use(passport.session())
//Flash
app.use(flash())
app.use((req, res, next) => {
	//flash messages inside res.locals.alerts
	//See what this is
	console.log(res.locals)
	res.locals.alerts = req.flash()
	res.locals.currentUser = req.user
	//Do the next thing
	next()
})

//Controllers
app.use('/auth', require('./controllers/auth'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});



const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
