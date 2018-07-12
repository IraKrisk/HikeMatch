const express = require('express');  // require the express package
const mongoose = require('mongoose');  // require mongoose
const router = express.Router();

// helpers
const {ensureAuthenticated} = require('../helpers/authentication');

// hike model
const hikes = require('../models/Hike');
const Hike = mongoose.model('hikes');

// show get request 
router.get('/show/:code', function(req, res){
  Hike.findOne({
    code: req.params.code
  })
  .populate('user')
  .then(function(hike){
    res.render('hikes/show', {
      hike: hike
    });
  });
  console.log(req.params.code);
});

//  add get request 
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('hikes/add');  
});

// add post request
router.post('/add',  ensureAuthenticated, function(req, res){

  // add hike form validation
  let errors = [];  
  let inputDate = req.body.hike_date;

 
/*   if(!req.body.destination || !req.body.county || || !req.body.cod || !req.body.meeting_point || !req.body.hike_date || !req.body.hike_time || !req.body.estimated_time || !req.body.diff_level || !req.body.elevation || !req.body.slope || !req.body.description) {
    errors.push({text:'Please fill in all the fields'});
  } 

  if((req.body.county === 'County') || (req.body.diff_level === 'Difficulty level')){
    errors.push({text:'Please fill in all the fields'});
  } 

  if(new Date(inputDate).getTime() < new Date().getTime()){
    errors.push({text:'Please enter future date'});
  } 

  if((/^[a-zA-Z0-9]+$/).test(req.body.code) === false) {
    errors.push({text: 'Code has to consist of letters or numbers without spaces'});
  } 
  if(req.body.code.length > 8){
    errors.push({text: 'Code can have maximum 8 characters'});
  }

  if(req.body.meeting_point.length > 30){
    errors.push({text: 'Code can have maximum 30 characters'});
  }
  if(req.body.estimated_time.length > 25){
    errors.push({text: 'Estimated hike time can have maximum 25 characters'});
  }
  if(req.body.elevation.length > 10){
    errors.push({text: 'Elevation can have maximum 10 characters'});
  }
  if(req.body.slope.length > 10){
    errors.push({text: 'Estimated hike length can have maximum 10 characters'});
  }
  if(req.body.description.length > 2000){
    errors.push({text: 'Description can have maximum 2000 characters'});
  }


*/ 



    if(errors.length > 0){
      res.render('hikes/add', {
        errors: errors,
        destination: req.body.destination,
        county: req.body.county,
        code: req.body.code,
        meeting_point: req.body.meeting_point,
        hike_date: req.body.hike_date,
        hike_time: req.body.hike_time,
        estimated_time: req.body.estimated_time,
        diff_level: req.body.diff_level,
        elevation: req.body.elevation,
        slope: req.body.slope,
        description: req.body.description,
        user: req.user.id
        // email: req.params.email
      });

    // if no error create hike
    } else {
        Hike.findOne({
          code: req.body.code
        })
        .then(function(hike){
          if(hike){
            req.flash('error_msg', 'Code already exists');
            res.redirect('/users/dashboard');
          } else {
            const newHike = {
              destination: req.body.destination,
              county: req.body.county,
              code: req.body.code,
              meeting_point: req.body.meeting_point,
              hike_date: req.body.hike_date,
              hike_time: req.body.hike_time,
              estimated_time: req.body.estimated_time,
              diff_level: req.body.diff_level,
              elevation: req.body.elevation,
              slope: req.body.slope,
              description: req.body.description,
              user: req.user.id
              // email: req.params.email
              // name: req.user.name
              
              // id: newId
            }

            new Hike(newHike)
            .save()
            .then(function(hike){
              req.flash('success_msg', 'Hike added');
              res.redirect('/users/dashboard');
            });
          }          
       })
    }
   console.log(req.body);
});


// edit get request
router.get('/edit/:code', ensureAuthenticated, function(req, res){  

  Hike.findOne({
    code: req.params.code
  })
  .then(function(hike){
    res.render('hikes/edit', {
      hike: hike
    });
  })
  console.log(req.params.destination);
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
router.post('/edit/:code', function(req, res){
  
  Hike.findOne({
    code: req.params.code
  })
  .then(function(hike){
    hike.destination = req.body.destination;
    hike.county = req.body.county;
    hike.code = req.body.code;
    hike.meeting_point = req.body.meeting_point;
    hike.hike_date = req.body.hike_date;
    hike.hike_time = req.body.hike_time;
    hike.estimated_time = req.body.estimated_time;
    hike.diff_level = req.body.diff_level;
    hike.elevation = req.body.elevation;
    hike.slope = req.body.slope;
    hike.description = req.body.description;

    hike.save()
      .then(function(hike){
        req.flash('success_msg', 'Hike edited');
        res.redirect('/');
      });
  });
});


// delete get request
router.get('/delete/:code', ensureAuthenticated, function(req, res){
 Hike.remove({
   code: req.params.code
  })
  .then(function(){
    req.flash('success_msg', 'Hike deleted');
    res.redirect('/');
  });
  // console.log(req.params.id);
});

// user's hikes
router.get('/user/:id', function(req, res){
  Hike.find({
    user: req.params.id
  })
  .populate('user')
  .sort({date:'desc'})
  .then(function(hikes){
    res.render('index/', {
      hikes: hikes
    });
  });
  console.log(req.params.id);
});


// search county 
router.get('/county/:county', function(req, res){
  Hike.find({
    county: req.params.county
  })
  .populate('user')
  .sort({date: 'desc'})
  .then(function(hikes){
    res.render('index/', {
      hikes: hikes
    });
  });
  console.log('req.params.county ' + req.params.county);
});

// search difficulty level
router.get('/difficulty/:diff_level', function(req, res){
  Hike.find({
    diff_level: req.params.diff_level
  })
  .populate('user')

  .sort({date: 'desc'})
  .then(function(hikes){
    res.render('index/', {
      hikes: hikes
    });
  });
  console.log('req.params.diff_level '  + req.params.county);
});

module.exports = router;



