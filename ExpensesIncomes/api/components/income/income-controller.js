const TABLE = 'income';
const { insert } = require('../../../store/mongo/mongoose');
categoryController = require('../category/category-controller');
const error = require('../../../utils/error');


module.exports = function (injectedStore) {

    let store = injectedStore;

    async function addIncome(newIncome) {

        const income = {
            description: newIncome.description,
            amount: newIncome.amount,
            incomeDate: newIncome.incomeDate,
            categoryName: newIncome.categoryName,
            userEmail: newIncome.email,   
            familyName: newIncome.familyName,
            frequent: newIncome.frequent,   
            incomeRegistryDate: new Date() 
        }     
        
        categoryPrimaryKey = {'name':income.categoryName,'familyName':income.familyName};

        income.category = await store.getByPrimaryKey('category',categoryPrimaryKey);
        
        insertedIncome = await insert(TABLE,income);

        if(insertedIncome){

            publishIncome = {
                email : income.category.subscriptors,
                category : income.category.name,
                description : insertedIncome.description,
                amount : insertedIncome.amount,
            }

            queue.Publish(publishIncome,'newIncome')

            return insertedIncome;          
        }else{
            throw error('Error inserting income', 500);
        }  
             
    }

    async function getAllIncomes(req) {    
        dateIni = req.query.dateIni
        dateEnd = req.query.dateEnd
        primaryKey = {familyName:req.family} 

        console.log(dateIni);
        console.log(dateEnd);

        if(dateIni||dateEnd){            
            return await store.findByDate(TABLE,primaryKey,dateIni,dateEnd);
        }else{
            return await store.getAll(TABLE,primaryKey); 
        }

                    
    }

    async function updateIncome(updatedIncome) {

        income = await store.getById(TABLE,updatedIncome.id);

        income = {
            id: updatedIncome.id,
            amount: updatedIncome.amount,
            description: updatedIncome.description,
            incomeDate: updatedIncome.incomeDate,
            categoryName: updatedIncome.categoryName,
            userEmail: updatedIncome.email,   
            familyName: updatedIncome.familyName,      
            incomeRegistryDate: new Date() 
        }
        
        categoryPrimaryKey = {'name':income.categoryName,'familyName':income.familyName};
        income.category = await store.getByPrimaryKey('category',categoryPrimaryKey);       
        filter = {'_id': income.id};
        update = income;

        return await store.filterAndUpdate(TABLE,filter,update);   
    }

    async function deleteIncome(incomeToDeleteId) {

        return await store.deleteById(TABLE,incomeToDeleteId);

    }
    
    
    
    return {
        addIncome,
        updateIncome,
        getAllIncomes,
        deleteIncome
    };

}