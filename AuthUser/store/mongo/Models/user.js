const mongoose = require('mongoose');
const config = require('../../../config.js');
mongoose.connect(config.mongodb.url);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  family: {type: mongoose.Types.ObjectId, ref: "Family",required: true}
  
});

userSchema.index({ email: 1, familyName: 1 },{unique: true});

const User = mongoose.model('User', userSchema);

module.exports = User;