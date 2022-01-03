import { myCache } from './myCache';
import { VenueReservationInfo, VenueVendorInfo } from './yummodule/VendorBase';
import { getVendor } from './yummodule/Vendors';


const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const DataLoader = require('dataloader');
const dayjs = require("dayjs");

const slot_required_fields = ' @requires(columns: ["key", "timezone", "reservation", "name", "businessid", "businessgroupid", "resy_city_code","url_slug", "longitude", "latitude"])';

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
    try {
        const vendor = getVendor(venue.reservation);
        if (!vendor) {
            return null;
        }
        const url = vendor?.getReservationUrl(venue, args.date, args.party_size, args.timeOption);
    return url;
    } catch (err) {
        console.error(`${venue.reservation} Error searching for ${venue.name} (${venue.key}) ${err}`);
        return null;
    }
}

const getReservationInfo = async (_query: any, args: any): Promise<VenueReservationInfo | null> => {
    const url: string = args.url;
    try {
        let reservation: string;
        if (url.includes("opentable.com")) {
            reservation = "opentable";
        } else if (url.includes("yelp.com")) {
            reservation = "yelp";
        } else if (url.includes("resy.com")) {
            reservation = "resy";
        } else if (url.includes("exploretock.com")) {
            reservation = "tock";
        }

        const vendor = getVendor(reservation!);
        const info = await vendor.fetchReservationInfoFromURL(url);
        console.log(info);
        return info;


    } catch (err) {
        console.error(`Error injesting for ${url} ${err}`);
        return null;
    }
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

      type ReservationInfo {
          reservation:String
          businessid:String
          urlSlug:String
          resyCityCode:String
          longitude:Float
          latitude:Float
      }

      extend type Query {
          reservationInfo(url:String!): ReservationInfo
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
            Query: {
                reservationInfo: (_query: any, args: any, context: any, resolveInfo: any) => {
                    const ret = getReservationInfo(_query, args);
                    console.log(ret);
                    return ret;
                },

            }
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
    cacheMap: myCache, // disable for dev
});

async function singleVenueSearch(
    venue: VenueVendorInfo, date: string, party_size: number, timeOption: string
): Promise<string[] | null> {
    const vendor = getVendor(venue.reservation);
    if (venue.reservation === "none") {
        console.log(venue.name, 'has no reservation system');
        return null;
    }
    if (!vendor) {
        console.log('XXXX miss vendor implementation ' + venue.reservation);
        return null;
    }
    const result = await vendor.venueSearchSafe(venue, date, party_size, timeOption);
    const return_v = result?.map(t => t.time) || null;
    return return_v;
}