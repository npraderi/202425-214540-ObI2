const store = require('../../../store/mongo/mongoose');
const ctrl = require('./income-controller');

module.exports = ctrl(store);