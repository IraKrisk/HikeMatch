const express = require('express');  // require the express package
const mongoose = require('mongoose');  // require mongoose
const exphbs  = require('express-handlebars');  // require handlebars
// const passport = require('passport');

// require('./config/passport')(passport);

const app = express();   // create the express application

app.use(express.static('public')); // access to the public folder
app.use(express.static('images')); // access to the images folder
const keys = require('./config/keys');  // access to keys.js

// handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// mongoose
mongoose.connect(keys.mongoURI)
  .then(() => console.log('database connected'))
  .catch(err => console.log(err));

const hikes = require('./models/Hike');
const Idea = mongoose.model('hikes');


// home page route
app.get('/', function(req, res) {
  res.render("index");
});

// info page route
app.get('/info', function(req, res) {
  res.render("info");
});

// add hike page route
app.get('/addhike', function(req, res){
  res.render("hikes/addhike");  
});

// edit hike page route
app.get('/edithike', function(req, res){
  res.render("hikes/edithike");  
});


// log in route
app.get('/login', function(req, res) {
  res.render("login");
});



// server
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  console.log("Server started");
});