const express = require('express');  // require the express package
const mongoose = require('mongoose');  // require mongoose
const router = express.Router();

// hike model
const hikesModel = require('../models/Hike');
const Hike = mongoose.model('hikes');

// get request for home page
router.get('/', function(req, res){
  Hike.find({})
  .populate('user')
  .sort({date:'desc'})
  .then(function(hikes){
    res.render('index', {
      hikes: hikes
    });
  });
});

// get request for info page
router.get('/info', function(req, res) {
  res.render('index/info');
});

module.exports = router;