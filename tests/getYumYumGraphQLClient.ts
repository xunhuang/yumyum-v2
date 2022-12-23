import { ApolloClient, ApolloQueryResult, InMemoryCache } from '@apollo/client';
import { MetroReservationDocument, MetroReservationQuery, UpdateVenueInfoDocument, UpdateVenueInfoMutation, Venue, VenueByKeyDocument, VenueByKeyQuery } from '../src/generated/graphql';
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

export async function getMetroReservationList(metro: string, reservation: string) {
    return await client.query<MetroReservationQuery>({
        query: MetroReservationDocument,
        variables: {
            metro: metro,
            reservation: reservation,
        },
    });
}

export async function updateVenueReservation(key: string,
    reservationInfo: any,
) {
    const b = JSON.parse(JSON.stringify(reservationInfo));
    b.key = key;
    b.close = false;
    b.withOnlineReservation = "true";
    return await client.mutate<UpdateVenueInfoMutation>({
        mutation: UpdateVenueInfoDocument,
        variables: b,
    });
}

export async function setVenueReservationToTBD(key: string) {
    const tbd = {
        key: key,
        reservation: "TBD",
        close: false,
        withOnlineReservation: "true",
    }
    return await client.mutate<UpdateVenueInfoMutation>({
        mutation: UpdateVenueInfoDocument,
        variables: tbd,
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