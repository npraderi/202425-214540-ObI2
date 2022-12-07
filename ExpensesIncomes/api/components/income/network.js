const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const secure = require('../category/secure');

const router = express.Router();

router.get('/',secure.verifyApiKey(), getAllIncomes)
router.post('/',secure.authRoleAdminOrMember(),secure.verifyApiKeyFromToken(), addIncome);
router.put('/:id',secure.authRoleAdmin(),secure.verifyApiKeyFromToken(), updateIncome);
router.delete('/:id',secure.authRoleAdmin(), deleteIncome);

function addIncome(req, res, next) {
    req.body.frequent = req.query.frequent || false
    Controller.addIncome(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
}

function getAllIncomes(req, res, next) {
    Controller.getAllIncomes(req)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
}

function updateIncome(req, res, next) {
    req.body.id = req.params.id;
    Controller.updateIncome(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
}

function deleteIncome(req, res, next) {
    req.body.id = req.params.id;
    Controller.deleteIncome(req.body)
        .then((user) => {
            response.success(req, res, user, 201);
        })
        .catch(next);
}


module.exports = router;