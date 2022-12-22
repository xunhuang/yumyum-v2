import { ApolloClient, InMemoryCache } from '@apollo/client';
import { VenueByKeyDocument, VenueByKeyQuery } from '../src/generated/graphql';

const cache = new InMemoryCache();
const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT ||
        "https://graph-3khoexoznq-uc.a.run.app/graphql",
    cache: cache,
    connectToDevTools: true,
});

export function getYumYumGraphQLClient() {
    return client;
}

export async function yumyumVenueByKey(key: string) {
    return await client.query<VenueByKeyQuery>({
        query: VenueByKeyDocument,
        variables: {
            key: key
        },
    });
}