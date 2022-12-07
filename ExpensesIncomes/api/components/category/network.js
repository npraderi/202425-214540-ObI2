const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const secure = require('./secure');


const router = express.Router();

router.get('/', secure.verifyApiKey() ,getCategories);
router.get('/spent/', secure.verifyApiKey() ,getTop3CategorySpent);
router.post('/', secure.authRoleAdmin(), secure.verifyApiKeyFromToken(),createCategory);
router.post('/subscribe', secure.authRoleAdmin(), secure.verifyApiKeyFromToken(), Subscribe);
router.post('/unsubscribe', secure.authRoleAdmin(), secure.verifyApiKeyFromToken(), Unsubscribe);
router.put('/', secure.authRoleAdmin(), secure.verifyApiKeyFromToken(), updateCategory);
router.delete('/',secure.authRoleAdmin(), secure.verifyApiKeyFromToken(), deleteCategory);

// Internal functions

function createCategory(req, res, next) {
    Controller.createCategory(req.body)
        .then(async (category) => {
            await response.success(req, res, category, 201);
        })
        .catch(next); 
}

function getCategories(req, res, next) {
    Controller.getTop3CategorySpent(req.family,0)
        .then(async (category) => {
            await response.success(req, res, category, 201);
        })
        .catch(next); 
}

function getTop3CategorySpent(req, res, next) {
    Controller.getTop3CategorySpent(req.family,3)
        .then(async (category) => {
            await response.success(req, res, category, 201);
        })
        .catch(next); 
}

function updateCategory(req, res, next) {
    Controller.updateCategory(req.body)
        .then((category) => {
            response.success(req, res, category, 201);
        })
        .catch(next); 
}

function deleteCategory(req, res, next) {
    Controller.deleteCategory(req.body)
        .then((category) => {
            response.success(req, res, category, 201);
        })
        .catch(next); 
}

function Subscribe(req, res, next) {
    req.body.categoryName = req.query.category
    req.body.limit = req.query.limit || false
    Controller.Subscribe(req.body)
        .then(async (category) => {
            await response.success(req, res, category, 201);
        })
        .catch(next); 
}


function Unsubscribe(req, res, next) {
    req.body.categoryName = req.query.category
    Controller.Unsubscribe(req.body)
        .then(async (category) => {
            await response.success(req, res, category, 201);
        })
        .catch(next); 
}




module.exports = router;
