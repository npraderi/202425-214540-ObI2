const makeApp = require('./app.js');
const config = require('../config.js');
const app = makeApp.appRoutes(null);


app.listen(config.api.port);
console.log('Api escuchando en el puerto ', config.api.port);