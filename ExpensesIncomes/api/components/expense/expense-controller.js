const TABLE = 'expense';
const { insert } = require('../../../store/mongo/mongoose');
categoryController = require('../category/category-controller');
const error = require('../../../utils/error');


module.exports = function (injectedStore,injectedQueue) {

    let store = injectedStore;

    if (!injectedQueue) {
        queue = require('../../../queue/publisher');
    }


    async function addExpense(newExpense) {

        const expense = {
            amount: newExpense.amount,
            description: newExpense.description,
            expenseDate: newExpense.expenseDate,
            categoryName: newExpense.categoryName,
            userEmail: newExpense.email,   
            familyName: newExpense.familyName,
            frequent: newExpense.frequent,
            expenseRegistryDate: new Date() 
        }     
        
        categoryPrimaryKey = {'name':expense.categoryName,'familyName':expense.familyName};

        expense.category = await store.getByPrimaryKey('category',categoryPrimaryKey);
        
        insertedExpense = await insert(TABLE,expense);

        if(insertedExpense){

            let updatedCategory = await categoryController(store).incrementCategoryExpense(expense.category._id,expense.amount);

           

            console.log("UPDATE CATEGORY: ", updatedCategory)

            if(updatedCategory.subscriptors.length > 0){

                publishExpense = {
                    email : updatedCategory.subscriptors,
                    category : updatedCategory.name,
                    description : insertedExpense.description,
                    amount : insertedExpense.amount,
                }

                queue.Publish(publishExpense,'newExpense')
            }

            if(updatedCategory.limitWarnSubscription.length > 0 && (updatedCategory.limitPerMonth < updatedCategory.totalSpent)){

                publishExpense = {
                    email :  updatedCategory.limitWarnSubscription,
                    category : updatedCategory.name,
                    description : insertedExpense.description,
                    amount : insertedExpense.amount,
                    totalSpent : updatedCategory.totalSpent,
                    limitPerMonth : updatedCategory.limitPerMonth,
                }

                queue.Publish(publishExpense,'limitWarn')
            }

            return insertedExpense;

        }else{
            throw error('Error inserting expense', 500);
        }  
             
    }

    async function getAllExpenses(req) {    
        let dateIni = req.query.dateIni;
        let dateEnd = req.query.dateEnd;
        
        let primaryKey = (req.query.bycategory==='true') ? {familyName:req.family, categoryName:req.query.category} : {familyName:req.family}

        if((dateIni||dateEnd) && (req.query.bycategory==='false')){            
            return await store.findByDate(TABLE, primaryKey, dateIni,dateEnd);
        }else{
            return await store.getAll(TABLE,primaryKey); 
        }

                    
    }

    async function updateExpense(updatedExpense) {

        expense = await store.getById(TABLE,updatedExpense.id);

        expense = {
            id: updatedExpense.id,
            amount: updatedExpense.amount,
            description: updatedExpense.description,
            expenseDate: updatedExpense.expenseDate,
            categoryName: updatedExpense.categoryName,
            userEmail: updatedExpense.email,
            familyName: updatedExpense.familyName, 
            expenseRegistryDate: new Date() 
        }    

        categoryPrimaryKey = {'name':expense.categoryName,'familyName':expense.familyName};
        expense.category = await store.getByPrimaryKey('category',categoryPrimaryKey);       
        filter = {'_id': expense.id};
        update = expense;

        return await store.filterAndUpdate(TABLE,filter,update);   
    }

    async function deleteExpense(expenseToDeleteId) {

        return await store.deleteById(TABLE,expenseToDeleteId);

    }
    
    
    
    return {
        addExpense,
        updateExpense,
        getAllExpenses,
        deleteExpense
    };

}