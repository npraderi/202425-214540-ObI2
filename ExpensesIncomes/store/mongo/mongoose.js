const mongoose = require('mongoose');

async function get(model, id) {

    Model = require(`./Models/${model}`);
    ret = await Model.findOne({ id: id });
    return ret;
}

async function getAll(model) {

    Model = require(`./Models/${model}`);
    ret = await Model.find({});
    return ret;
}


async function insert(model, data, id) {

        Model = require(`./Models/${model}`);
        const newModel = await new Model(data);
        ret = await newModel.save();
        
    return ret;
}
/*------------------------------------------------------------*/
async function findByKey(model,key,value){

    Model = require(`./Models/${model}`);
    ret = await Model.findOne({[key]: value}) ? true : false;
    return ret;
}

async function findAndUpdate(model,key,value,newValue){

    Model = require(`./Models/${model}`);    
    const filter = { [key]: value };
    ret = await Model.findOneAndUpdate(filter, newValue,{ new: true });
    return ret;

}

async function findAndUpdateByKey(model,key,value,newValueKey,newValue){

    Model = require(`./Models/${model}`);
    
    const filter = { [key]: value };
    const update = { [newValueKey]: newValue }

    ret = await Model.findOneAndUpdate(filter,update,{
        new: true
      });
    return ret;
}

async function findManyAndUpdateByKey(model,key,value,newValueKey,newValue){

    Model = require(`./Models/${model}`);
    
    const filter = { [key]: value };
    const update = { [newValueKey]: newValue }

    ret = await Model.updateMany(filter,update,{
        new: true
    });

    return ret;
}

async function findAndReplace(model,key,value,newValue){

    Model = require(`./Models/${model}`);
    
    const filter = { [key]: value };
    ret = await Model.replaceOne(filter, newValue);
    return ret;
}
/*------------------------------------------------------------*/
async function filterAndUpdateOneAttribute(model,primaryKey,newValue){

    Model = require(`./Models/${model}`);    
    ret = await Model.findOneAndUpdate(primaryKey, newValue,{ new: true });
    return ret;

}

async function filterAndUpdate(model,primaryKey,update){

    Model = require(`./Models/${model}`);    
    ret = await Model.findOneAndUpdate(primaryKey, update,{ new: true });
    return ret;

}
/*------------------------------------------------------------*/
async function getByKey(model,key,value){

    Model = require(`./Models/${model}`);
    ret = await Model.findOne({[key]: value}) || null;
    return ret;
}

async function getById(model,id){

    _id = mongoose.Types.ObjectId(id);
    Model = require(`./Models/${model}`);
    ret = await Model.findById({ _id:_id });
    return ret;
}

async function getByPrimaryKey(model,primaryKey){

    Model = require(`./Models/${model}`);
    ret = await Model.findOne(primaryKey) || null;
    return ret;
}
/*------------------------------------------------------------*/
async function deleteById(model,id){

    _id = mongoose.Types.ObjectId(id);
    Model = require(`./Models/${model}`);
    ret = await Model.deleteOne({ _id:_id });
    return ret;
}
/*------------------------------------------------------------*/

async function findAndUpdateById(model,id,newValue){

    _id = mongoose.Types.ObjectId(id);
    Model = require(`./Models/${model}`);
    
    const filter = { _id:_id };

    ret = await Model.findOneAndUpdate(filter, newValue,{ new: true });
    return ret;

}

async function sortQuery(model,primaryKey,orderBy,top){

    Model = require(`./Models/${model}`);

    ret = (top>0) ? await Model.find(primaryKey).sort(orderBy).limit(top) : await Model.find(primaryKey).sort(orderBy);

    return ret;

}


async function findByDate(model,primaryKey,dateIni,dateEnd) {

    Model = require(`./Models/${model}`);
    ret = await Model.find(primaryKey).find({ expenseDate: { $gte: dateIni, $lte: dateEnd }});     
    return ret;
}



module.exports = {
    get,
    getAll,
    insert,
    findByKey,
    getByKey,    
    getByPrimaryKey,
    findAndUpdateByKey,
    findAndReplace,
    findAndUpdate,
    filterAndUpdate,
    filterAndUpdateOneAttribute,
    getById,
    deleteById,
    findAndUpdateById,
    sortQuery,
    findByDate
}
