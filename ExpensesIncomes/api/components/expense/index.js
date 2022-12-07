const store = require('../../../store/mongo/mongoose');
const ctrl = require('./expense-controller');

module.exports = ctrl(store);