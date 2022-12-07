const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const secure = require('../category/secure');

const router = express.Router();

// Routes
router.get('/',secure.verifyApiKey(), getAllExpenses)
router.post('/',secure.authRoleAdminOrMember(), secure.verifyApiKeyFromToken(), addExpense);
router.put('/:id',secure.authRoleAdmin(),secure.verifyApiKeyFromToken(), updateExpense);
router.delete('/:id',secure.authRoleAdmin(), deleteExpense);

// Internal functions

function addExpense(req, res, next) {
    req.body.frequent = req.query.frequent || false
    Controller.addExpense(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
}

function getAllExpenses(req, res, next) {
    Controller.getAllExpenses(req)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
}

function updateExpense(req, res, next) {
    req.body.id = req.params.id;
    Controller.updateExpense(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
}

function deleteExpense(req, res, next) {
    req.body.id = req.params.id;
    Controller.deleteExpense(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
}


module.exports = router;