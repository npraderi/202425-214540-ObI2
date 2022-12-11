const express = require('express');
const bodyParser = require('body-parser');
const user = require('./components/user/network');
const auth = require('./components/auth/network');
const family = require('./components/family');
const errors = require('../network/errors'); 
const cors = require('cors')

function appRoutes(injectedOptions) {

    options = injectedOptions;

    const app = express(); 
    
    app.use(cors());
    app.use(bodyParser.json());

    //ROUTER
    app.use('/api/users', user.userRoutes(options));
    app.use('/api/auth', auth);

    //This has to be the last one
    app.use(errors);

    family.loadCacheFamiliesApiKey();

    return app
}



module.exports.appRoutes = appRoutes;


