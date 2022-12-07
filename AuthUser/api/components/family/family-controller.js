const TABLE = 'family';
const error = require('../../../utils/error');

module.exports = function (injectedStore, injectedCache) {
    let store = injectedStore;
    let cache = injectedCache;

    async function createFamilyWithOwner(user) {

        const family = {
            familyName: user.familyName,
            apiKey: ([...Array(30)].map((e) => ((Math.random() * 36) | 0).toString(36)).join(''))
        }

        familyExists = await store.findByKey(TABLE,'familyName',family.familyName);

        if(!familyExists){        
                 
            await cache.SET(family.apiKey,family.familyName);
            return await store.insert(TABLE,family);

        }else{
        
            throw error('Family already exists!', 409);

        }
    }

    async function addFamilyMembers(user) {

        //TODO

    }

    async function addFamilyAdministrators(user) {

        //TODO

    }

    async function loadCacheFamiliesApiKey(){

        cache.FLUSHALL()

        let families = await getAllFamilies();
        
        for(const family of families){
           await cache.SET(family.apiKey,family.familyName)
        }
    }

   

    async function getAllFamilies() {
        return await store.getAll('family');
    }

    async function getFamily(familyName) {
        return await store.getByKey('family','familyName',familyName);
    }

    async function ResetFamilyApikey(apikey){
        let newApiKey = ([...Array(30)].map((e) => ((Math.random() * 36) | 0).toString(36)).join(''));
        result = await store.findAndUpdateByKey('family','apiKey',apikey,'apiKey',newApiKey);
        if(result){
            await cache.DEL(apikey);
            await cache.SET(newApiKey,result.familyName);
            return result;
        }else{
            throw error('Error updating api-key', 409);
        }
    }


    return {
        createFamilyWithOwner,
        addFamilyMembers,
        addFamilyAdministrators,
        loadCacheFamiliesApiKey,
        getFamily,
        ResetFamilyApikey
    };
}