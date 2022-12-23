import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Venue, VenueByKeyDocument, VenueByKeyQuery } from '../src/generated/graphql';
import { VenueVendorInfo } from '../src/yummodule/VendorBase';

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

export function venueToVendorInfo(venue: Venue): VenueVendorInfo {
    return {
        key: venue.key!,
        name: venue.name!,
        reservation: venue.reservation!,
        businessid: venue.businessid!,
        timezone: venue.timezone!,
    };
}