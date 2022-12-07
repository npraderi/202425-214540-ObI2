const store = require('../../../store/mongo/mongoose');
const ctrl = require('./family-controller');
const cache = require('../../../store/cache/redisCache');

module.exports = ctrl(store,cache);