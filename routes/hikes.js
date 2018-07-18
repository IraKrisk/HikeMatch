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
  .populate('interests.interestUser')
  .populate('comments.commentUser')
  .then(function(hike){
    res.render('hikes/show', {
      hike: hike
    });
  });
  console.log(req.params.code);
});

// add get request 
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('hikes/add');  
});

// add post request
router.post('/add',  ensureAuthenticated, function(req, res){ 
  let errors = [];  

  // add and edit hike form validation
  let inputDate = req.body.hike_date;

/*   if(!req.body.destination || !req.body.county || !req.body.cod || !req.body.meeting_point || !req.body.hike_date || !req.body.hike_time || !req.body.estimated_time || !req.body.diff_level || !req.body.elevation || !req.body.slope || !req.body.description) {
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
  if(req.body.estimated_time.length > 12){
    errors.push({text: 'Estimated hike time can have maximum 12 characters'});
  }
  if(req.body.elevation.length > 12){
    errors.push({text: 'Elevation can have maximum 12 characters'});
  }
  if(req.body.slope.length > 12){
    errors.push({text: 'Estimated hike length can have maximum 12 characters'});
  }
  if(req.body.description.length > 2000){
    errors.push({text: 'Description can have maximum 2000 characters'});
  } */


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

// author's hikes
router.get('/user/:name', function(req, res){
  Hike.find({
   user: req.params.id
  })
  .populate('user')
  .sort({date:'desc'})
  .then(function(hikes){
    res.render('index', {
      hikes: hikes
    });
  });
  console.log(req.params.name);
});


// interested in hike
router.post('/interest/:code', ensureAuthenticated, function(req, res){
  Hike.findOne({
    code: req.params.code
  })
  .populate('user')
  .then(function(hike){
    const newInterest = {
      interestUser: req.user.id
    }
    hike.interests.unshift(newInterest);  // adds new interest
    hike.save()
    .then(function(hike){
      res.redirect('/hikes/show/' + hike.code);
    });
  });
});

// comments
router.post('/comment/:code', ensureAuthenticated, function(req, res){
  Hike.findOne({
    code: req.params.code
  })
  .populate('user')
  .then(function(hike){
    const newComment = {
      commentTitle: req.body.commentTitle,
      commentContent: req.body.commentContent,
      commentUser: req.user.id
    }
    hike.comments.unshift(newComment);  // adds new comment
    hike.save()
    .then(function(hike){
      res.redirect('/hikes/show/' + hike.code);
    });
  });
});


// search county 
router.get('/county/:county', function(req, res){
  Hike.find({
    county: req.params.county
  })
  .sort({date: 'desc'})
  .then(function(hikes){
    res.render('index/', {
      hikes: hikes
    });
  });
});

// search difficulty level
router.get('/difficulty/:diff_level', function(req, res){
  Hike.find({
    diff_level: req.params.diff_level
  })
  .sort({date: 'desc'})
  .then(function(hikes){
    res.render('index/', {
      hikes: hikes
    });
  });
});

module.exports = router;



