const jwt = require('jsonwebtoken');
const config = require('../config');
const cache = require('../store/cache/redisCache');

const secret = config.jwt.secret;

async function sign(data){
    await cache.SET(data.apiKey,data.familyName);
    return await jwt.sign(JSON.stringify(data), secret);
}

async function verify(token){
    try{ 
        return await jwt.verify(token, secret)
    }catch(e){
        return null
    }
}


const checkRole = {
    own: async function (req){
            const decoded = await decodeHeader(req);

            if(decoded){
                req.body.userEmail = decoded.email;
                return decoded.role;              
            }else{
                return null;
            }
    },
}



async function getToken(auth){

    if(!auth){
        return null;
    }

    if (auth.indexOf('Bearer ')=== -1){
        return null;
    }

    let token = auth.replace('Bearer ', '');

    return token;

}

async function verifyApiKey(apiKey){
    if(await cache.EXIST(apiKey)){
        ret =  await cache.GET(apiKey);
        return ret;
    }else{
        return null;
    }
}

async function decodeHeader(req) {
    const authorization = req.headers.authorization || '';
    const token = await getToken(authorization);

    if(token){
        const decoded = await verify(token);
        req.user = decoded;
        return decoded;
    }else{
        return null;
    }
}

module.exports = {
    sign,
    checkRole,
    verifyApiKey,
    decodeHeader
};