const auth = require('../../../auth');

const verifyApiKey = () => {
    return async (req, res, next) => {
        const apikey = req.header("x-api-key");  
        
                if (apikey){
                    req.family = await auth.verifyApiKey(apikey);  
                }                               
                if(req.family!=null){
                    return next();                    
                }
                return res.status(401).json({
                    "error": true,
                    "status": 401,
                    "body": "Unauthorized"
                });
    }
};

const verifyApiKeyFromToken = () => {
    return async (req, res, next) => {
          
                req.token = await auth.decodeHeader(req);
               

                    if(req.token){

                        let apiKey = req.token.apiKey
                        let email = req.token.email

                        if (apiKey){
                            req.body.familyName = await auth.verifyApiKey(apiKey);
                            req.body.email = req.token.email  
                        }    

                        if(req.body.familyName!=null){
                            return next();                    
                        }

                        return res.status(401).json({
                            "error": true,
                            "status": 401,
                            "body": "Unauthorized"
                        });
                    }
    }
};

const authRoleAdmin = (permissions) => {
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

const authRoleAdminOrMember = (permissions) => {
    return async (req, res, next) => {
        const owner = req.body.id;
                
                isAdminOrMember = await auth.checkRole.own(req, owner);

                Authorized = (isAdminOrMember==="ADMIN"||isAdminOrMember==="MEMBER");

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

module.exports = { verifyApiKey,verifyApiKeyFromToken,authRoleAdmin,authRoleAdminOrMember};