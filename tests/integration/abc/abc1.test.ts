import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { describe, expect } from '@jest/globals';

describe('Ingredient DAL', () => {
    beforeAll(async () => {

        const cache = new InMemoryCache();

        const client = new ApolloClient({
            uri:
                process.env.REACT_APP_GRAPHQL_ENDPOINT ||
                "https://graph-3khoexoznq-uc.a.run.app/graphql",
            cache: cache,
            connectToDevTools: true,
        });
        const result = await client.query({
            query: gql`
               query LookupReservationInfo($url: String!) {
  reservationInfo(url: $url) {
    businessid
    urlSlug
    resyCityCode
    latitude
    longitude
    reservation
  }
}
        `, variables: { url: "https://www.exploretock.com/theshotasf/" }
        });
        console.log(result);


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

