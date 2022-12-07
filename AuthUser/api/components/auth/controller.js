const bcrypt = require('bcrypt');
const auth = require('../../../auth');
const error = require('../../../utils/error');
const TABLE = 'auth';

module.exports = function (injectedStore) {

    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function login(email, password){

        let data = await store.getByKey(TABLE,'email',email); 
        const family = await store.getByKey('user','email',email); 
            data.familyName = family.familyName;
        if(data){
            return await bcrypt.compare(password, data.password).
            then(areEqual => {
                if(areEqual === true){
                    return auth.sign(data);
                }else{
                    throw error('Unauthorized', 401);
                }
            })
        }else{
            throw error('Unauthorized', 401);
        }
    }

    async function insert(data){
        const authData = {
            id: data.id,
            role: data.role,
            apiKey: data.apiKey
        }

        if (data.email){
            authData.email = data.email;
        }

        if (data.password){
            authData.password = await bcrypt.hash(data.password,5);
        }
        
        return store.insert(TABLE, authData);
    }

    async function ResetAuthApikey(apikey,newApikey) {
        let authsToUpdate = await store.getAllByKey('auth','apiKey',apikey);

        await store.findManyAndUpdateByKey('auth','apiKey',apikey,'apiKey',newApikey);
        let emailsToNotify = []
        
        authsToUpdate.forEach(element => {
            emailsToNotify.push(element.email);
        });

        return emailsToNotify;
    }

    return {
        insert,
        login,
        ResetAuthApikey
    }
}