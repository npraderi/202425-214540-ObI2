const TABLE = 'category';
const error = require('../../../utils/error');


module.exports = function (injectedStore,injectedCache) {

    let store = injectedStore;
    let cache = injectedCache;

    async function createCategory(newCategory) {

        const category = {
            name: newCategory.name,
            description: newCategory.description,
            image: newCategory.image,
            limitPerMonth: newCategory.limitPerMonth,    
            familyName: newCategory.familyName,
            active: newCategory.active,
            totalSpent: 0
        }

        insertedCategory = await store.insert(TABLE,category);        

        if(insertedCategory){                
            return insertedCategory;
        }else{
            throw error('Error creating category', 409);
        }
   
    }

    async function updateCategory(updatedCategory) {

        const category = {
            name: updatedCategory.name,
            description: updatedCategory.description,
            image: updatedCategory.image,
            limitPerMonth: updatedCategory.limitPerMonth,
            familyName: updatedCategory.familyName,
            active: updatedCategory.active,
        }

        filter = {'name': updatedCategory.oldName, 'familyName': category.familyName};
        update = category;

        return await store.filterAndUpdate('category',filter,update);        
    }

    async function incrementCategoryExpense(id,expenseAmount){

        newValue =  { $inc: { totalSpent: +expenseAmount } };
        return await store.findAndUpdateById(TABLE,id,newValue);
                
    }

    async function deleteCategory(deletedCategory) {

        const category = {
            name: deletedCategory.name,
            description: deletedCategory.description,
            image: deletedCategory.image,
            limitPerMonth: deletedCategory.limitPerMonth,
            familyName: deletedCategory.familyName,
            active: deletedCategory.active
        }

        primaryKey = {'name': category.name, 'familyName': category.familyName};
        newValue = {'active':false};

        return await store.filterAndUpdateOneAttribute('category',primaryKey,newValue);

    }

    async function getTop3CategorySpent(familyName,count){
        primaryKey = {familyName:familyName}
        orderBy = {totalSpent:-1}
        return await store.sortQuery(TABLE,primaryKey,orderBy,count);
    }

    async function getCategoriesByDate(familyName,initDate,endDate){
        primaryKey = {familyName:familyName}

        return await store.findByDate(TABLE,primaryKey,initDate,endDate);
    }

    async function Subscribe(category){

        primaryKey = {'name': category.categoryName, 'familyName': category.familyName};
        newValue = category.limit ==='true' ? { $addToSet: { subscriptors: category.email }, $addToSet: { limitWarnSubscription: category.email }} : { $addToSet: { subscriptors: category.email } }
        return await store.filterAndUpdateOneAttribute('category',primaryKey,newValue);

    }

    async function Unsubscribe(category){

        primaryKey = {'name': category.categoryName, 'familyName': category.familyName};
        removeValue =  {$pull: { subscriptors: category.email } }
        return await store.filterAndUpdateOneAttribute('category',primaryKey,removeValue);

    }

    
    return {
        createCategory,
        updateCategory,
        deleteCategory,
        incrementCategoryExpense,
        getTop3CategorySpent,
        getCategoriesByDate,
        Subscribe,
        Unsubscribe
    };

}


