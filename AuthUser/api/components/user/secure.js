const auth = require('../../../auth');

const authRoleAdmin = () => {
    return async (req, res, next) => {
        const owner = req.body.id;
                
                isAdmin = await auth.checkRole.own(req, owner);
                Authorized= (isAdmin === ('ADMIN'));
                if(Authorized){
                    return next();                    
                }else{
                    return res.status(401).json({
                        "error": true,
                        "status": 401,
                        "body": "Unauthorized"
                    });
                }  
    }

};


const decodeTokenParam = () => {
    return async (req, res, next) => {  
        
                req.token = await auth.decodeToken(req.params.token);
                if(req.token){
                    return next();                    
                }else{
                    return res.status(401).json({
                        "error": true,
                        "status": 401,
                        "body": "Unauthorized"
                    });
                }  
    }

};

const decodeToken = () => {
    return async (req, res, next) => {  
        
                req.token = await auth.decodeHeader(req);
                if(req.token){
                    return next();                    
                }else{
                    return res.status(401).json({
                        "error": true,
                        "status": 401,
                        "body": "Unauthorized"
                    });
                }  
    }

};

module.exports = { authRoleAdmin,decodeTokenParam, decodeToken };
