import { describe, expect } from '@jest/globals';
import { VendorResy } from '../../../src/yummodule/VendorResy';

const nyc = require("./nyc-tbd.json");

var resy = new VendorResy();
describe('Resy System Test', () => {
    beforeAll(async () => {
        return;
    })

    afterAll(async () => {
        // await dbTeardown()
    })

    describe('Search entity by name and long/lat', () => {
        it('should find an entity with exact match', async () => {
            const search_result = await resy.entitySearchExactTerm("Aurum", -122.1156105, 37.3801255);
            expect(search_result.businessid).toEqual(49088);
            expect(search_result.urlSlug).toEqual("aurum");
            expect(search_result.resyCityCode).toEqual("lsl");
        })

        it('should not find an entity with complete garbage', async () => {
            const search_result = await resy.entitySearchExactTerm("adadadfsfsdf2weweweAurum", -122.1156105, 37.3801255);
            expect(search_result).toBeNull()
        })

        it('should find an entity with fuzzzy match', async () => {
            const search_result = await resy.entitySearchExactTerm("Au", -122.1156105, 37.3801255);
            expect(search_result.urlSlug).toEqual("aurum");
        })

        it('should find an entity with fuzzzy match', async () => {
            const search_result = await resy.entitySearchExactTerm("au", -122.1156105, 37.3801255);
            expect(search_result.urlSlug).toEqual("aurum");
        })
        it('should find an entity with fuzzzy match', async () => {

            // const search_result = await resy.entitySearchExactTerm("Coarse", -74.0034825, 40.7392199);
            // console.log(search_result)

            for (const entity of nyc) {
                const search_result = await resy.entitySearchExactTerm(entity.name, entity.longitude, entity.latitude);
                console.log(entity.name, search_result)
            }
        })
    })
})

