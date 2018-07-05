const express = require('express');  // require the express package
const mongoose = require('mongoose');  // require mongoose
const router = express.Router();

// helpers
const {ensureAuthenticated} = require('../helpers/authentication');

// hike model
const hikesModel = require('../models/Hike');
const Hike = mongoose.model('hikes');

// get request for show hike
router.get('/show/:id', function(req, res){
  Hike.findOne({
    _id: req.params.id
  })
  .populate('user')
  .then(function(hike){
    res.render('hikes/show', {
      hike: hike
    });
  });
  console.log(req.params.id);
});

//  add get request 
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('hikes/add');  
});

// add post request
router.post('/add',  ensureAuthenticated,function(req, res){

  // add hike form validation
  let errors = [];  

 
/*   if(!req.body.destination || !req.body.county || !req.body.meeting_point || !req.body.hike_date || !req.body.hike_time || !req.body.estimated_time || !req.body.diff_level || !req.body.elevation || !req.body.slope || !req.body.description) {
    errors.push({text:'Please fill in all required fields'});
  } */


  if(errors.length > 0){
    res.render('hikes/add', {
      errors: errors,
      destination: req.body.destination,
      county: req.body.county,
      meeting_point: req.body.meeting_point,
      hike_date: req.body.hike_date,
      hike_time: req.body.hike_time,
      estimated_time: req.body.estimated_time,
      diff_level: req.body.diff_level,
      elevation: req.body.elevation,
      slope: req.body.slope,
      description: req.body.description
    });

  // if no error create hike
  } else {
    const newUser = {
      destination: req.body.destination,
      county: req.body.county,
      meeting_point: req.body.meeting_point,
      hike_date: req.body.hike_date,
      hike_time: req.body.hike_time,
      estimated_time: req.body.estimated_time,
      diff_level: req.body.diff_level,
      elevation: req.body.elevation,
      slope: req.body.slope,
      description: req.body.description,
      user: req.user.id
    }

    new Hike(newUser)
      .save()
      .then(function(hike){
        req.flash('success_msg', 'Hike added');
        res.redirect('/');
      });
  }
  console.log(req.body);
});


// edit get request
router.get('/edit/:id', ensureAuthenticated, function(req, res){  
  Hike.findOne({
    _id: req.params.id
  })
  .then(function(hike){
    if (hike.user != req.user.id){
      req.flash('error_msg', 'Not authorized');
      res.redirect('/');
    } else {
      res.render('hikes/edit', {
        hike: hike
      });
    }
  });
  console.log(req.params.id);
}); 


/* router.get('/edit/:id', function(req, res){  
  Hike.findById(req.params.id, function(hike){
    res.render('hikes/edit', {
      hike:hike
    });
  });
  console.log(req.params.id);
}); */


// edit post request
router.post('/edit/:id', function(req, res){
  
  Hike.findOne({
    _id: req.params.id
  })
  .then(function(hike){
    hike.destination = req.body.destination;
    hike.county = req.body.county;
    hike.meeting_point = req.body.meeting_point;
    hike.hike_date = req.body.hike_date;
    hike.hike_time = req.body.hike_time;
    hike.estimated_time = req.body.estimated_time;
    hike.diff_level = req.body.diff_level;
    hike.elevation = req.body.elevation;
    hike.slope = req.body.slope;
    description = req.body.description;

    hike.save()
      .then(function(hike){
        req.flash('success_msg', 'Hike edited');
        res.redirect('/');
      });
  });
   // console.log(req.params.id);
   // console.log(req.body);
});


// delete get request
router.get('/delete/:id', ensureAuthenticated, function(req, res){
 Hike.remove({
   _id: req.params.id
  })
  .then(function(){
    req.flash('success_msg', 'Hike deleted');
    res.redirect('/');
  });
  // console.log(req.params.id);
});


module.exports = router;