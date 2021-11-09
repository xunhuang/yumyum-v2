import superagent = require('superagent');

import { myCache } from './myCache';
import { VenueVendorInfo } from './yummodule/VendorBase';
import { getVendor } from './yummodule/Vendors';

const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const DataLoader = require('dataloader');

export const YumYumVenueAvailabilityPlugin = makeExtendSchemaPlugin((build: any) => {
    const { pgSql: sql } = build;
    return {
        typeDefs: gql`
      extend type Venue {
        slots (date:String!, party_size:Int=2, timeOption:String = "dinner" ): [String!]
        @requires(columns: ["key", "timezone", "reservation", "name", "businessid", "businessgroupid"])

        myReservationUrl (date:String!, party_size:Int=2, timeOption:String = "dinner" ): String!  @requires(columns: ["key", "timezone", "reservation", "name", "businessid", "businessgroupid", "resy_city_code", "url_slug"])
      }
    `,
        resolvers: {
            Venue: {
                slots: async (_query: any, args: any, context: any, resolveInfo: any) => {
                    console.log(args);
                    const venue: VenueVendorInfo = {
                        // these  came from the @requires above
                        reservation: _query.reservation,
                        name: _query.name,
                        key: _query.key,
                        businessid: _query.businessid,
                        businessgroupid: _query.businessgroupid,
                        timezone: _query.timezone,
                    };
                    args.venue = venue;
                    const result = await AvailablilityLoader.load(JSON.stringify(args));
                    return result;
                },

                myReservationUrl: (_query: any, args: any, context: any, resolveInfo: any) => {
                    const venue: VenueVendorInfo = {
                        key: _query.key,
                        reservation: _query.reservation,
                        name: _query.name,
                        businessid: _query.businessid,
                        businessgroupid: _query.businessgroupid,
                        timezone: _query.timezone,
                        resy_city_code: _query.resyCityCode,
                        url_slug: _query.urlSlug,
                    };
                    console.log(venue);
                    const vendor = getVendor(venue.reservation);
                    const url = vendor.getReservationUrl(venue, args.date, args.party_size, args.timeOption);
                    return url;
                },
            },
        },
    };
});

const batchGetUserById = async (ids: string[]) => {
    console.log('called once per tick:', ids);
    const handles = ids.map(async (id) => {
        // console.log("Cache miss hit for " + id);
        // this is not a m-get so this use of batching is kind of pointless
        // except for using the cache
        const args = JSON.parse(id);
        const result = await singleVenueSearch(args.venue, args.date, args.party_size, args.timeOption);
        console.log(result);
        return result;
    });

    return await Promise.all(handles);
};

const AvailablilityLoader = new DataLoader(batchGetUserById, {
    cacheMap: myCache,
});

async function singleVenueSearch(venue: VenueVendorInfo, date: string, party_size: number, timeOption: string): Promise<string[]> {
    const vendor = getVendor(venue.reservation);
    const result = await vendor.venueSearchSafe(venue, date, party_size, timeOption);
    const return_v = result?.map(t => t.time) || [];
    console.log(return_v);
    return return_v;
}
async function singleVenueSearchold(key: string, date: string, party_size: number, timeOption: string): Promise<string[]> {
    const a = getVendor("opentable");

    const url = 'https://us-central1-yumyumlife.cloudfunctions.net/singleVenueSearch';
    return await superagent.post(url)
        .set('Content-Type', 'application/json')
        .send({
            data: {
                venue: {
                    key: key
                },
                date: date,
                timeOption: timeOption,
                party_size: party_size, // 2
            },
        })
        .then((res: superagent.Response) => {
            const result = JSON.parse(res.text);
            return result.result.slots?.map((a: any) => a.time);
        }, (err: any) => {
            console.log(err);
            return null;
        });
}