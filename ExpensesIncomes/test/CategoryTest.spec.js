const categoryController = require('../api/components/category/category-controller');
const Err = require('../utils/error');
jest.mock('../utils/error');
const Store = require('../store/mongo/mongoose.js')
jest.mock('../store/mongo/mongoose.js');


const category = {
    name: "Alimentos",
    description: "En esta categoria se agregan gastos alimenticios",
    image: "No image",
    limitPerMont: 10000,
    familyName: "Picon",
    active: true
}

const family = {
    name:"Franco",
    email: "Franco@gmail.com",
    password: "12345678",
    familyName: "Picon"
}

const updatedCategory ={
    oldName: "Alimentos",
    name: "Comida",
    description: "En esta categoria se agregan gastos de comida",
    image: "Yes image",
    limitPerMont: 10000,
    familyName: "Picon",
    active: true
}

const error ={
    Error: "Error",
}

const deletedCategory ={
    name: "Alimentos",
    description: "En esta categoria se agregan gastos alimenticios",
    image: "No image",
    limitPerMont: 10000,
    familyName: "Picon",
    active: false
}

Store.insert.mockImplementationOnce(() => {
    return category;
}).mockImplementationOnce(() => {
    return null;
});

Err.mockImplementation(() => {
    return error;
});

Store.getByKey.mockImplementationOnce(() => {
    return family    
}).mockImplementationOnce(() => {
    return null    
}).mockImplementationOnce(() => {
    return family    
});

Store.filterAndUpdate.mockImplementation(() => {
    return updatedCategory    
});

Store.sortQuery.mockImplementation(() => {
    return category    
});


Store.filterAndUpdateOneAttribute.mockImplementation(() => {
    return deletedCategory    
});

describe("Add Category", () => {
    beforeEach(() => {
        this.repository = Store;
        this.categoryController = new categoryController(this.repository);
    });
    test('OK Category', async () => {
        const result = await this.categoryController.createCategory(category);
        expect(result).toStrictEqual(category);
    });
    test('Family missing Category', async () => {
        let thrownError;
        try {
             await this.categoryController.createCategory(category);
        }
        catch(error) {
            thrownError = error;
        }

        expect(thrownError).toEqual(error);

    });
    test('Category insertion failed', async () => {
        let thrownError;

        try {
             await this.categoryController.createCategory(category);
        }
        catch(error) {
            thrownError = error;
        }

        expect(thrownError).toEqual(error);

    });
})

describe("Edit Category", () => {
    beforeEach(() => {
        this.repository = Store;
        this.categoryController = new categoryController(this.repository);
    });
    test('Edit Category', async () => {
        const result = await this.categoryController.updateCategory(updatedCategory);

        expect(result).toStrictEqual(updatedCategory);
    });
})

describe("Delete Category", () => {
    beforeEach(() => {
        this.repository = Store;
        this.categoryController = new categoryController(this.repository);
    });
    test("Delete Category", async () => {
        const result = await this.categoryController.deleteCategory(category);
        expect(result).toStrictEqual(deletedCategory);
    });
})

describe("Get top 3 categories", () => {
    beforeEach(() => {
        this.repository = Store;
        this.categoryController = new categoryController(this.repository);
    });
    test("Get top 3 categories", async () => {
        const result = await this.categoryController.getTop3CategorySpent(category);
        expect(result).toStrictEqual(category);
    });
})