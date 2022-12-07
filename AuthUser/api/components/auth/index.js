const store = require('../../../store/mongo/mongoose');
const ctrl = require('./controller');

module.exports = ctrl(store);