const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// user model
const usersModel = require('../models/User');
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done){
    User.findOne({
      email: email
    })
    .then(function(user){
      if(!user){
        return done(null, false, {message: 'Email not found'});
      }

      bcrypt.compare(password, user.password, function(err, isMatch){
        if(isMatch){
          return done(null, user);        
        } else {
         return done(null, false, {message: 'Incorrect password'});
        }
      });    
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
}