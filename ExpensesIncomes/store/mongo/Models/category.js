const mongoose = require('mongoose');
const config = require('../../../config.js');
mongoose.connect(config.mongodb.url);

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  limitPerMonth: {
    type: Number
  },
  familyName: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  },
  totalSpent: {
    type: Number,
    required: true,
  },
  subscriptors: {
    type: [String],
  },
  limitWarnSubscription: {
    type: [String],
  },
});

categorySchema.index({ name: 1, familyName: 1, totalSpent: -1 },{unique: true});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;