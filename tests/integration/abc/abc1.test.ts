import { describe, expect } from '@jest/globals';

describe('Ingredient DAL', () => {
    beforeAll(async () => {
        return;
        // await dbTeardown() ; ({ id: ingredientId } = await Ingredient.create({
        //         name: 'Beans',
        //         slug: 'beans',
        //     }))
    })
    afterAll(async () => {
        // await dbTeardown()
    })

    describe('Create method', () => {
        beforeAll(async () => {
            console.log("before all create method")
        })
        it('should create and return an object of ingredient details', async () => {
            const ingredient = 1;
            console.log("create method step 1")
            expect(ingredient).not.toBeNull()
        })
        it('an object of ingredient details', async () => {
            const ingredient = 1;
            console.log("create method step 2")
            expect(ingredient).not.toBeNull()
        })
        afterAll(async () => {
            console.log("after all create method")
        })
    })
})

