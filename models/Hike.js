const mongoose = require('mongoose');

const hikeSchema = mongoose.Schema({
  destination:{
    type: String,
  },
  county:{
    type: String,
  },
  meetingPoint:{
    type: String,
  }, 
  hikeDate:{
    type: String,
  }, 
  hikeTime:{
    type: String,
  }, 
  estimatedHikeTime:{
    type: String,
  }, 
  difficultyLevel:{
    type: String,
  }, 
  elevation:{
    type: String,
  }, 
  averageSlope:{
    type: String,
  }, 
  description:{
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('hikes', hikeSchema);