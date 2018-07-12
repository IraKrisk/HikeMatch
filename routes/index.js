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

  //search
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

/* // contact get request


router.get('/contact', function(req, res) {
  res.render('index/contact');
}); */



/* router.get('/contact', function(req, res){
  Hike.find({
    user: req.params.id
  })
  .populate('user')
  .then(function(hikes){
    res.render('index/contact', {
      hikes: hikes
    });
  });
}); */


router.get('/contact/:email', function(req, res){
  Hike.findOne({
    email: req.params.email
  })
  .populate('user')
  .then(function(hike){
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
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Subject: ${req.body.subject}</li>
      <li>Message: ${req.body.message}</li>
    </ul>
  `;


  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth:{
      user: req.body.email,
      pass: req.body.password
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: 'Sender name: ',
    to: req.params.email,
    subject: 'subject: ',
    html: output 
  }
 

  // Smtp Settings for outputing gmail for nodemailer
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      return;
    } else {
      console.log('email sent');
      console.log(info);
    }


  // verify connection configuration
  transporter.verify(function(error, success) {
  if (error) {
       console.log(error);
  } else {
       console.log('message sent');
  }

});

/*     console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


    res.render('contact', {msg:'Email has been sent'});

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou... */
    
    res.render('index/contact', {message:'Email has been sent'});
  });


   console.log('req.body ' + req.body);
   console.log('req.body.email ' + req.body.email);
   console.log('req.body.password ' + req.body.password);
 // res.redirect('/');
});

// search regEx
function escapeRegex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;