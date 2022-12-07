const mongoose = require('mongoose');
const config = require('../../../config.js');
mongoose.connect(config.mongodb.url)

//async () => {await mongoose.connect(config.mongodb.url)}

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expenseDate: {
    type: Date,
    required: true,
  },
  expenseRegistryDate: {
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
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;