import { myCache } from './myCache';
import { VenueVendorInfo } from './yummodule/VendorBase';
import { getVendor } from './yummodule/Vendors';

const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const DataLoader = require('dataloader');
const dayjs = require("dayjs");

const slot_required_fields = ' @requires(columns: ["key", "timezone", "reservation", "name", "businessid", "businessgroupid", "resy_city_code","urlSlug", "longitude", "latitude"])';

// dayjs('2019-01-25').daysInMonth()

const getRequiredFieldsFromQuery = (_query: any): VenueVendorInfo => {
    const venue: VenueVendorInfo = {
        // these  came from the @requires above
        reservation: _query.reservation,
        name: _query.name,
        key: _query.key,
        businessid: _query.businessid,
        businessgroupid: _query.businessgroupid,
        timezone: _query.timezone,
        url_slug: _query.urlSlug,
        latitude: _query.latitude,
        longitude: _query.longitude,
        resy_city_code: _query.resyCityCode,
    };
    return venue;
}

const getReservationUrl = (_query: any, args: any): string | null => {
    const venue = getRequiredFieldsFromQuery(_query);
    const vendor = getVendor(venue.reservation);
    const url = vendor?.getReservationUrl(venue, args.date, args.party_size, args.timeOption);
    console.log(args.date)
    return url;
}

export const YumYumVenueAvailabilityPlugin = makeExtendSchemaPlugin((build: any) => {
    const { pgSql: sql } = build;
    return {
        typeDefs: gql`
      type DateAvailability {
        date: String
        slots: [String]
        url: String
      }

      extend type Venue {
        slots (date:String!, party_size:Int=2, timeOption:String = "dinner" ): [String!]
        ${slot_required_fields}
        monthlySlots(date:String!, party_size:Int=2, timeOption:String = "dinner" ): [DateAvailability!]
        ${slot_required_fields}
        myReservationUrl (date:String!, party_size:Int=2, timeOption:String = "dinner" ): String
        ${slot_required_fields}
      }
    `,
        resolvers: {
            Venue: {
                slots: async (_query: any, args: any, context: any, resolveInfo: any) => {
                    const venue = getRequiredFieldsFromQuery(_query);
                    args.venue = venue;
                    const result = await AvailablilityLoader.load(JSON.stringify(args));
                    return result;
                },

                monthlySlots: async (_query: any, args: any, context: any, resolveInfo: any) => {
                    const venue = getRequiredFieldsFromQuery(_query);
                    // console.log(dayjs(args.date).daysInMonth());
                    const numdays = dayjs(args.date).daysInMonth();
                    const days: string[] = [];
                    for (var i = 1; i <= numdays; i++) {
                        const newdate = dayjs(args.date).set("date", i);
                        if (newdate.isAfter(dayjs().subtract(1, 'day'))) {
                            console.log(newdate.format("YYYY-MM-DD"));
                            days.push(newdate.format("YYYY-MM-DD"));
                        }
                    }

                    const handles = days.map(async date => {
                        args.venue = venue;
                        args.date = date;
                        const newargs = JSON.parse(JSON.stringify(args));
                        console.log(date)
                        return {
                            date: date,
                            slots: await AvailablilityLoader.load(JSON.stringify(args)),
                            url: getReservationUrl(_query, newargs),
                        }
                    });
                    return await Promise.all(handles);
                },

                myReservationUrl: (_query: any, args: any, context: any, resolveInfo: any) => {
                    return getReservationUrl(_query, args);
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
        return result;
    });

    return await Promise.all(handles);
};

const AvailablilityLoader = new DataLoader(batchGetUserById, {
    cacheMap: myCache,
});

async function singleVenueSearch(
    venue: VenueVendorInfo, date: string, party_size: number, timeOption: string
): Promise<string[]> {
    const vendor = getVendor(venue.reservation);
    if (venue.reservation === "none") {
        return [];
    }
    if (!vendor) {
        console.log('XXXX missssssssssssssssssssssing ' + venue.reservation);
        return [];
    }
    const result = await vendor.venueSearchSafe(venue, date, party_size, timeOption);
    const return_v = result?.map(t => t.time) || [];
    return return_v;
}