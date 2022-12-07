const expenseController = require('../api/components/expense/expense-controller');
const Err = require('../utils/error');
jest.mock('../utils/error');
const Store = require('../store/mongo/mongoose.js')
jest.mock('../store/mongo/mongoose.js');
//const Cache = require('../store/cache/redisCache.js')
//jest.mock('../store/cache/redisCache.js');

const expense = {
    id: 1,
    amount: 100,
    description: "50 gramos de jamon",
    expenseDate: "2022-06-15 11:34:00",
    categoryName: "Alimentos",
    userEmail: "Camilo@gmail.com",
    family: "Familia Camilo",
    query: {dateIni: "2022-06-15 11:34:00", dateEnd: "2022-06-15 11:34:00", bycategory: "true", category: "Alimentos"},
}

const expenseByDate = {
    id: 1,
    amount: 100,
    description: "50 gramos de jamon",
    expenseDate: "2022-06-15 11:34:00",
    categoryName: "Alimentos",
    userEmail: "Camilo@gmail.com",
    family: "Familia Camilo",
    query: {dateIni: "2022-06-15 11:34:00", dateEnd: "2022-06-15 11:34:00", bycategory: "false", category: "Alimentos"},
}

const updatedExpense = {
    id: 1,
    amount: 50,
    description: "100 gramos de queso",
    expenseDate: "2022-06-15 11:34:00",
    categoryName: "Comida",
    userEmail: "Camilo@gmail.com"
}

const user = {
    name:"Camilo",
    email: "Camilo@gmail.com",
    password: "12345678",
    familyName: "Lanner"
}

const category = {
    name: "Alimentos",
    description: "En esta categoria se agregan gastos alimenticios",
    image: "No image",
    limitPerMont: 10000,
    familyName: "Lanner",
    active: true
}

const family = {
    familyName: "Lanner"
}

const error ={
    Error: "Error",
}


Store.insert.mockImplementationOnce(() => {
    return expense;
});

Store.filterAndUpdate.mockImplementationOnce(() => {
    return updatedExpense;
});

Store.deleteById.mockImplementationOnce(() => {
    return expense;
});

Store.getAll.mockImplementationOnce(() => {
    return expense;
});

Store.getByKey.mockImplementationOnce(() => {
    return user;    
}).mockImplementationOnce(() => {
    return family;    
}).mockImplementationOnce(() => {
    return user;    
}).mockImplementationOnce(() => {
    return family;    
}).mockImplementationOnce(() => {
    return user;    
}).mockImplementationOnce(() => {
    return family;    
});;

Store.getByPrimaryKey.mockImplementationOnce(() => {
    return category;    
})

Store.getById.mockImplementationOnce(() => {
    return expense;    
});

Store.getAll.mockImplementationOnce(() => {
    return expense;    
});

Store.findByDate.mockImplementationOnce(() => {
    return expenseByDate;    
});

Err.mockImplementation(() => {
    return error;
});


describe("Add Expense", () => {
    beforeEach(() => {
        this.repository = Store;
        this.expenseController = new expenseController(this.repository);
    });
    test('OK Expense', async () => {
        const result = await this.expenseController.addExpense(expense);
        expect(result).toStrictEqual(expense);
    });
    test('Not OK Expense', async () => {
        let thrownError;
        try {
             await this.expenseController.addExpense(expense);
        }
        catch(error) {
            thrownError = error;
        }
        expect(thrownError).toEqual(error);
    });
})

describe("Update Expense", () => {
    beforeEach(() => {
        this.repository = Store;
        this.expenseController = new expenseController(this.repository);
    });
    test('Updated Expense', async () => {
        const result = await this.expenseController.updateExpense(updatedExpense);
        expect(result).toStrictEqual(updatedExpense);
    });
})

describe("Delete Expense", () => {
    beforeEach(() => {
        this.repository = Store;
        this.expenseController = new expenseController(this.repository);
    });
    test('Delete Expense', async () => {
        const result = await this.expenseController.deleteExpense(expense);
        expect(result).toStrictEqual(expense);
    });
})

describe("Get all Expenses", () => {
    beforeEach(() => {
        this.repository = Store;
        this.expenseController = new expenseController(this.repository);
    });
    test('Get all Expenses by category', async () => {
        const result = await this.expenseController.getAllExpenses(expense);
        expect(result).toStrictEqual(expense);
    });
    test('Get all Expenses by date', async () => {
        const result = await this.expenseController.getAllExpenses(expenseByDate);
        expect(result).toStrictEqual(expenseByDate);
    });
})