const TABLE = 'user';
const xid = require('xid-js');
const jwt = require('../../../auth');
const auth = require('../auth');
const family = require ('../family');
const error = require('../../../utils/error');

module.exports = function (injectedStore,injectedQueue) {
    let store = injectedStore;

    if (!store) {
        store = require('../../../store/dummy');
    }

    if (!injectedQueue) {
        queue = require('../../../queue/publisher');
    }

    function list() {
        return store.getAll(TABLE);
    }

    function get(id) {
        return store.get(TABLE, id);
    }

    async function insert(body) {

        const user = {
            name: body.name,
            email: body.email,
            familyName: body.familyName            
        }

        if (body.id) {
            user.id = body.id;
        } else {
            user.id = xid.next();
        }        

        isUserValid = await userIsValidForRegistry(user)===true;
        ValidPassword = body.password > 8;

        if(isUserValid&&ValidPassword){            

            newFamily = await family.createFamilyWithOwner(user);

            if(newFamily) {

                if (body.password) {
                    await auth.insert({
                        id: user.id,
                        email: user.email,                    
                        password: body.password,
                        role: body.role,
                        apiKey: newFamily.apiKey
                    });
                }

                user.family = newFamily;
                return await store.insert(TABLE,user);

            }else{

                throw error('Error creating family', 409);
            }          

        }else{

            if(!ValidPassword){
                throw error('Invalid password, it has to be larger or equal than 8 characters', 409);
            }else{
                throw error('Invalid user parameters, they already exists in database', 409);
            }

            

        }
    }

    async function Invite(newInvite){

        const invite = {
            email: newInvite.email,
            invite: 'PENDING',
            familyName: newInvite.familyName,
            role: newInvite.role,
        }

        storedInvite = await store.insert('invite',invite);

        newInvite = {
            email: invite.email,
            jwt: await jwt.invite(newInvite)
        }

        queue.Publish(newInvite,'newInvite')

    }


    async function InviteRegisty(inviteToken, inviteUserPass){

        const user = {
            name: inviteUserPass.name,
            password: inviteUserPass.password,
            email: inviteToken.email,
            familyName: inviteToken.familyName,  
            role: inviteToken.role          
        }

        InvitationStatus = await store.getByKey('invite','email',user.email);

        if(InvitationStatus&&InvitationStatus.invite=='PENDING'){
        
            return await InsertIntoExistingFamily(user);

        }else{

            throw error('Invitation already accepted', 401);
            
        }
    } 

    async function InsertIntoExistingFamily(body) {

        const user = {
            name: body.name,
            email: body.email,
            familyName: body.familyName            
        }

        if (body.id) {
            user.id = body.id;
        } else {
            user.id = xid.next();
        }        

        isUserValid = await userIsValidToNewFamily(user)===true;

        if(isUserValid){            

            newFamily = await family.getFamily(user.familyName);

            if(newFamily) {

                if (body.password) {
                    await auth.insert({
                        id: user.id,
                        email: user.email,                    
                        password: body.password,
                        role: body.role,
                        apiKey: newFamily.apiKey
                    });
                }

                user.family = newFamily;
                result = store.insert(TABLE,user);

                if(result){
                    await store.findAndUpdateByKey('invite','email',user.email,'invite','ACCEPTED');
                    return await result
                }else{
                    throw error('Error creating user', 409);
                }

            }else{
                throw error('Error creating family', 409);
            }          
        }else{
            throw error('Invalid user parameters, some already exists in database', 409);
        }
    }


    async function userIsValidForRegistry(user){

        authExists = await store.findByKey('auth','email',user.email);
        emailExists = await store.findByKey('user','email',user.email);
        familyNameExists = await store.findByKey('family','familyName',user.familyName);
        ValidFamilyName = user.familyName.length > 2;
        ValidUserName = user.email.length > 0;
        
        isValidForRegister = !familyNameExists&&!authExists&&!emailExists&&ValidFamilyName&&ValidUserName

        return isValidForRegister;
    }

    async function userIsValidToNewFamily(user){

        authExists = await store.findByKey('auth','email',user.email);
        emailExists = await store.findByKey('user','email',user.email);
        familyNameExists = await store.findByKey('family','familyName',user.familyName);
        ValidFamilyName = user.familyName.length > 2;
        ValidUserName = user.email.length > 0;
        isValidForRegister = familyNameExists&&!authExists&&!emailExists&&ValidFamilyName&&ValidUserName
        return isValidForRegister;
    }

    async function ResetApikey(token) {

        familyUpdated = await family.ResetFamilyApikey(token.apiKey);
        if(familyUpdated){    
             emailsToNotify = await auth.ResetAuthApikey(token.apiKey,familyUpdated.apiKey);

             resetApiKey = {
                email: emailsToNotify,
                apiKey: familyUpdated.apiKey, 
            }

             queue.Publish(resetApiKey,'resetApiKey');

             return "Your api-key was updated!"

        }else{
            throw error('Error reseting api-key', 409);
        }

        
    }

    

    

    return {
        list,
        get,
        insert,
        Invite,
        InviteRegisty,
        ResetApikey
    };
}