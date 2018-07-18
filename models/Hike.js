const mongoose = require('mongoose');

const HikeSchema = mongoose.Schema({
  destination: {
    type: String
  },
  county: {
    type: String
  },
  code: {
    type: String
  },
  meeting_point: {
    type: String
  }, 
  hike_date: {
    type: String
  }, 
  hike_time: {
    type: String
  }, 
  estimated_time: {
    type: String
  }, 
  diff_level: {
    type: String
  }, 
  elevation: {
    type: String
  }, 
  slope: {
    type: String
  }, 
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  interests: [{
    interestName: {
      type: String
    },
    interestDate: {
      type: Date,
      default: Date.now
    },
    interestUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  }],
  comments: [{
    commentTitle: {
      type: String
    },
    commentContent: {
      type: String
    },
    commentDate: {
      type: Date,
      default: Date.now
    },
    commentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  }],
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
});

mongoose.model('hikes', HikeSchema);