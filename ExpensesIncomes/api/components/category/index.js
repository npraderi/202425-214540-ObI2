const store = require('../../../store/mongo/mongoose');
const cache = require('../../../store/cache/redisCache');
const ctrl = require('./category-controller');

module.exports = ctrl(store,cache);