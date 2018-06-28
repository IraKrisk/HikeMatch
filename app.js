const express = require('express');  // require the express package
const mongoose = require('mongoose');  // require mongoose
const exphbs  = require('express-handlebars');  // require handlebars
const bodyParser = require('body-parser');  // require body-parser
const flash = require('connect-flash');  // require connect-flash
const session = require('express-session');  // require express-session
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
  .then(function(){
    console.log('database connected');
  })
  .catch(function(err){
    console.log(err);
  });

// hike model
const hikes = require('./models/Hike');
const Hike = mongoose.model('hikes');

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// connect flash
app.use(flash());

// message variables
app.use( function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})



// get request for home page
app.get('/', function(req, res){
  Hike.find({})
  .sort({date:'desc'})
  .then(function(hikes){
    res.render('index', {
      hikes:hikes
    });
  });
});

// get request for add page
app.get('/hikes/add', function(req, res){
  res.render('hikes/add');  
});

app.post('/hikes/add', function(req, res){

  // add hike form validation
  let errors = [];

 
  if(!req.body.destination || !req.body.county || !req.body.meeting_point || !req.body.hike_date || !req.body.hike_time || !req.body.estimated_time || !req.body.diff_level || !req.body.elevation || !req.body.slope || !req.body.description) {
    errors.push({text:'Please fill in all required fields'});
  }
 

  if(errors.length > 0){
    res.render('hikes/add', {
      errors: errors,
      destination: req.body.destination,
      county: req.body.county
    })

  // if no error create hike
  } else {
    const newUser = {
      destination: req.body.destination,
      county: req.body.county
    }

    new Hike(newUser)
      .save()
      .then(function(hike){
        req.flash('success_msg', 'Hike added');
        res.redirect('/');
      });
  }
});


// get request for edit page

app.get('/hikes/edit/:id', function(req, res){  
  Hike.findOne({
    id: req.params.id
  })
  .then(function(hike){
    res.render('hikes/edit', {
      hike:hike
    });
  });
});

/*
app.get('/hikes/edit/:id', function(req, res){  
  Hike.findOne({_id: req.params.id}, function(hike){
    res.render('hikes/edit', {
      hike:hike
    });
  });
});
*/


// post request for edit page

app.post('/hikes/edit/:id', function(req, res){
  Hike.findOne({
    _id: req.params.id
  })
  .then(function(hike){
    hike.destination = req.body.destination;
    hike.county = req.body.county;

    hike.save()
      .then(function(hike){
        req.flash('success_msg', 'Hike edited');
        res.redirect('/');
      });
  });
});


// get request for delete page
app.get('/hikes/delete/:id', function(req, res){
 Hike.remove({_id: req.params.id})
  .then(function(){
    req.flash('success_msg', 'Hike deleted');
    res.redirect('/');
  });
});



// get request for log in page
app.get('/login', function(req, res){
  res.render('login');
});

// get request for info page
app.get('/info', function(req, res) {
  res.render('info');
});



// server
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log('server started');
});