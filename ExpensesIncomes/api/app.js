const express = require('express');
const bodyParser = require('body-parser');
const category = require('./components/category/network');
const expense = require('./components/expense/network');
const errors = require('../network/errors'); 
const income = require('./components/income/network');

function appRoutes(injectedOptions) {

    options = injectedOptions;

    const app = express(); 

    app.use(bodyParser.json());

    //ROUTER
    app.use('/api/categories', category);
    app.use('/api/expenses', expense);
    app.use('/api/incomes', income);

    //This has to be the last one
    app.use(errors);

    //family.loadCacheFamiliesApiKey();

    return app
}



module.exports.appRoutes = appRoutes;


