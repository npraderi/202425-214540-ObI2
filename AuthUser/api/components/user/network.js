const express = require('express');
const secure = require('./secure');
const response = require('../../../network/response');


function userRoutes(injectedController) {

    let Controller = injectedController;

    if(!Controller){
        Controller = require('./index');
    }


    const router = express.Router();


    router.get('/', list)
    router.get('/:id', get);
    router.post('/', insert);
    router.post('/invite/:token', secure.decodeTokenParam(), InviteRegisty);
    router.post('/invite', secure.authRoleAdmin(), Invite);
    router.post('/reset-apikey', secure.authRoleAdmin(),secure.decodeToken(), ResetApikey);


    function list(req, res, next) {
        Controller.list()
            .then((lista) => {
                response.success(req, res, lista, 200);
            })
            .catch(next);
    }

    function get(req, res, next) {
        Controller.get(req.params.id)
            .then((user) => {
                response.success(req, res, user, 200);
            })
            .catch(next);
        
    }

    function insert(req, res, next) {
        Controller.insert(req.body)
            .then((user) => {
                response.success(req, res, user, 201);
            })
            .catch(next);
        
    }

    function Invite(req, res, next) {
        Controller.Invite(req.body)
            .then((user) => {
                response.success(req, res, user, 201);
            })
            .catch(next);
    }
    
    
    function InviteRegisty(req, res, next) {
        Controller.InviteRegisty(req.token,req.body)
            .then((user) => {
                response.success(req, res, user, 201);
            })
            .catch(next);
    }

    function ResetApikey(req, res, next) {
        Controller.ResetApikey(req.token)
            .then((user) => {
                response.success(req, res, user, 201);
            })
            .catch(next);
    }


    return router
}
module.exports.userRoutes = userRoutes;