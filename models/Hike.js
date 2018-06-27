const mongoose = require('mongoose');

const hikeSchema = mongoose.Schema({
  destination:{
    type: String,
    required: true
  },
  county:{
    type: String,
    required: true
  },
  meetingPoint:{
    type: String,
    required: true
  }, 
  hikeDate:{
    type: String,
    required: true
  }, 
  hikeTime:{
    type: String,
    required: true
  }, 
  estimatedHikeTime:{
    type: String,
    required: true
  }, 
  difficultyLevel:{
    type: String,
    required: true
  }, 
  elevation:{
    type: String,
    required: true
  }, 
  averageSlope:{
    type: String,
    required: true
  }, 
  description:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('hikes', hikeSchema);