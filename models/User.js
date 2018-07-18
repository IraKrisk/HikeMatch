const mongoose = require('mongoose');
const bycript = require('bcryptjs');

const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: Number
  }, 
  password: {
    type: String
  }, 
  confirm_password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('users', UserSchema);