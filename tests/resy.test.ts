import { describe, expect } from '@jest/globals';

import { VendorResy } from '../src/yummodule/VendorResy';
import { VenueSearchInput } from '../src/yummodule/VenueSearchInput';

const nyc = require("./nyc-tbd.json");

var resy = new VendorResy();
describe('Resy System Test', () => {
    const AurumData: VenueSearchInput = {
        "name": "Aurum",
        "latitude": 37.3801255,
        "longitude": -122.1156105,
        "address": "132 State St",
        "city": "Los Altos",
        "state": "CA"
    }

    beforeAll(async () => {
        return;
    })

    afterAll(async () => {
        // await dbTeardown()
    })

    describe('Search entity by name and long/lat', () => {
        it('should find an entity with exact match', async () => {
            const search_result = await resy.entitySearchExactTerm("Aurum", -122.1156105, 37.3801255, AurumData);
            expect(search_result.businessid).toEqual(49088);
            expect(search_result.urlSlug).toEqual("aurum");
            expect(search_result.resyCityCode).toEqual("lsl");
        })

        it('should not find an entity with complete garbage', async () => {
            const search_result = await resy.entitySearchExactTerm("adadadfsfsdf2weweweAurum", -122.1156105, 37.3801255, AurumData);
            expect(search_result).toBeNull()
        })

        // disableing these two tests. becuase we are doing exact matchings now, validating
        // the name or address are needed.
        // it('should find an entity with fuzzzy match', async () => {
        //     const search_result = await resy.entitySearchExactTerm("Au", -122.1156105, 37.3801255, AurumData);
        //     expect(search_result.urlSlug).toEqual("aurum");
        // })

        // it('should find an entity with fuzzzy match, case not match', async () => {
        //     const search_result = await resy.entitySearchExactTerm("au", -122.1156105, 37.3801255, AurumData);
        //     expect(search_result.urlSlug).toEqual("aurum");
        // })

        it('list of entity (like fail because 5 second limit)', async () => {
            for (const entity of nyc) {
                const search_result = await resy.entitySearchExactTerm(entity.name, entity.longitude, entity.latitude, AurumData);
                if (search_result) {
                    console.log(entity.name, search_result)
                }
            }
        }, 100000)
    })
})
