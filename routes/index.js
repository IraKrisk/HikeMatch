const express = require('express');  // require the express package
const mongoose = require('mongoose');  // require mongoose
const nodemailer = require('nodemailer'); 
const bcrypt = require('bcryptjs');
const router = express.Router();

// hike model
const hikesModel = require('../models/Hike');
const Hike = mongoose.model('hikes');

// helpers
const {ensureAuthenticated} = require('../helpers/authentication');

// home page get request
router.get('/', function(req, res){
  // text search
  if(req.query.search){
    const search = new RegExp(escapeRegex(req.query.search), 'gi');
    Hike.find({
      destination: search  
    })
    .sort({date: 'desc'})
    .then(function(hikes){
      res.render('index/', {
        hikes: hikes
      });
    });
  // hike list
  } else {
    Hike.find({})
    .populate('user')
    .sort({date: 'desc'})
    .then(function(hikes){
      res.render('index', {
        hikes: hikes
      });
    });
  }
});

// info get request
router.get('/info', function(req, res) {
  res.render('index/info');
});

router.get('/contact/:email', ensureAuthenticated, function(req, res){
  Hike.findOne({
    email: req.params.email
  })
  .populate('user')
  .then(function(hike){
    let bla = 'bla';
    res.render('index/contact', {
      hike: hike
    });
    console.log(req.params.email);
  });
});

// contact post request
router.post('/contact/:email', function(req, res) {

  const output = `
    <ul>
      <li>Name: ${req.user.name}</li>
      <li>Email: ${req.user.email}</li>
      <li>Subject: ${req.body.subject}</li>
      <li>Message: ${req.body.message}</li>
    </ul>
  `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth:{
      user: 'hike.match.project@gmail.com',
      pass: 'nC!pR0ject'
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: 'hike.match.project@gmail.com',
    subject: 'Hike Match',
    to: req.params.email,
    html: output 
  }

  // Smtp Settings for outputing gmail for nodemailer
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      return;
    } else {
      console.log(info);
    }
    res.render('index/contact', {message: 'Email has been sent'});
  });
  console.log(req.body);
});

// search regEx
function escapeRegex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;