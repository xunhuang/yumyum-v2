import { ApolloClient, InMemoryCache } from '@apollo/client';
import dayjs from 'dayjs';

import {
    MetroReservationDocument,
    MetroReservationQuery,
    UpdateVenueInfoDocument,
    UpdateVenueInfoMutation,
    Venue,
    VenueByKeyDocument,
    VenueByKeyQuery,
} from '../src/generated/graphql';
import { VenueVendorInfo } from '../src/yummodule/VendorBase';
import { getVendor } from '../src/yummodule/Vendors';

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
        longitude: venue.longitude!.toString(),
        latitude: venue.latitude!.toString(),
        url_slug: venue.urlSlug!,
    };
}


export async function venueReservationSearchByKey(key: string) {
    const result = await yumyumVenueByKey(key);
    const vendorInfo = venueToVendorInfo(result?.data?.venueByKey!);
    const vendor = getVendor(vendorInfo.reservation)
    return await vendor.venueSearchSafe(
        vendorInfo,
        dayjs().add(7, 'day').format('YYYY-MM-DD'),
        2, "dinner", true
    );
}