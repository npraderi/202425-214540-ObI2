const mongoose = require('mongoose');
const config = require('../../../config.js');
mongoose.connect(config.mongodb.url)

//async () => {await mongoose.connect(config.mongodb.url)}

const incomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  incomeDate: {
    type: Date,
    required: true,
  },
  incomeRegistryDate: {
    type: Date,
    required: true,
  },
  categoryName:{
    type: String,
    required: true,
  },
  category: { 
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true
  },
  frequent: {
    type: Boolean,
    default: false
  },
  userEmail:{
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },  
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;