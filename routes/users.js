const express = require('express');  
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// user model
const usersModel = require('../models/User');
const User = mongoose.model('users');

// hike model
const hikesModel = require('../models/Hike');
const Hike = mongoose.model('hikes');

// helpers
const {ensureAuthenticated} = require('../helpers/authentication');

// login get request 
router.get('/login', function(req, res, next){
  res.render('users/login');
});

// login post request

/* router.post('/login', function(req, res){
  res.render('users/login');
}); */

router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
  req.flash('success_msg', 'You have successfully logged in');
});


// register get request 
router.get('/register', function(req, res){
  res.render('users/register');
});

// register post request  
router.post('/register', function(req, res){
  let errors = [];


// register form validation
/*   if(req.body.name.length > 25) {
    errors.push({text: 'Name can have maximum 25 characters'});
  }

  if((/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/).test(req.body.email) === false) {
    errors.push({text: 'Invalid email format'});
  }

  if((/^[0-9-]*$/).test(req.body.phone) === false) {
    errors.push({text: 'Phone has to consist of numbers and - without spaces'});
  }

  if(req.body.password.length < 2) {
    errors.push({text: 'Password must have at least 8 characters'});
  }

  if(req.body.password != req.body.confirm_password){
    errors.push({text: 'Passwords must match'});
  } */

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirm_password: req.body.confirm_password
    });
  } else {
    User.findOne({
      email: req.body.email
    })
      .then(function(user){
        if(user){
          req.flash('error_msg', 'Email already registered');
          res.redirect('register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
          })
          bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(newUser.password, salt, function(err, hash) {
                newUser.password = hash;
                newUser.save()
                  .then(function(user){
                    req.flash('success_msg', 'You have successfully registered, please log in');
                    res.redirect('login');
                  })
              });
          });
        }
      });
  }
});

// logout get request
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You have successfully logged out');
  res.redirect('login');
})

// dashboard get request
router.get('/dashboard', ensureAuthenticated, function(req, res) {
  Hike.find({
    user: req.user.id
  })
  .sort({date: 'desc'})
  .then(function(hikes){
    res.render('users/dashboard', {
      hikes: hikes
    });
  });
});

module.exports = router;