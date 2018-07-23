const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bycript = require('bcryptjs');

const UserSchema = new Schema({
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