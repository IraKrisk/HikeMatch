const express = require('express');  // require the express package
const mongoose = require('mongoose');  // require modules
const exphbs  = require('express-handlebars');  
const bodyParser = require('body-parser');  
const flash = require('connect-flash');  
const session = require('express-session');  
const passport = require('passport'); 
// const nodemailer = require('nodemailer'); 
// const moment = require('moment');
const app = express();   // create the express application

app.use(express.static('public')); // access to the public folder
const keys = require('./config/keys');  // access to keys.js
const pass = require('./config/passport')(passport)  // passport.js

// helpers
const {formatDate} = require('./helpers/templates');

// routes
const index = require('./routes/index'); 
const hikes = require('./routes/hikes'); 
const users = require('./routes/users');

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongoose
mongoose.connect(keys.mongoURI)
  .then(function(){
    console.log('database connected');
  })
  .catch(function(err){
    console.log(err);
  });

// handlebars
app.engine('handlebars', exphbs({
  helpers: {formatDate: formatDate},
  defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');  // messages
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;   // user
  next();
})

// routes
app.use('/', index);
app.use('/hikes', hikes);
app.use('/users', users);

// server
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log('server started');
});