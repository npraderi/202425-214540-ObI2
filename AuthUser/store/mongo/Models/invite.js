const mongoose = require('mongoose');
const config = require('../../../config.js');
mongoose.connect(config.mongodb.url);

const inviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  invite: {
    type: String,
    enum: ['PENDING', 'ACCEPTED'],
    required: true
  },
  familyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MEMBER'],
    required: true
  }

});

inviteSchema.index({ email: 1, familyName: 1 },{unique: true});

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;