const mongoose = require('mongoose');
const config = require('../../../config.js');
mongoose.connect(config.mongodb.url);

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MEMBER'],
    required: true
  },
  apiKey: {
    type: String,
    required: true,
  } 
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;