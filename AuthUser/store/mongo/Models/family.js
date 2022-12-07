const mongoose = require('mongoose');
const config = require('../../../config.js');
mongoose.connect(config.mongodb.url);

const familySchema = new mongoose.Schema({
  familyName: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  }  
});

const Family = mongoose.model('Family', familySchema);

module.exports = Family;