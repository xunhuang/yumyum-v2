// const MetroCommonNavList = [
//   {
//     label: "Nearby",
//     url: "/nearby",
//     iconName: "nearby",
//     description: "Places Closet To You",
//   },
//   {
//     label: "Favorites",
//     url: "/personal/list/favorites",
//     iconName: "favorite",
//     type: "favorite",
//     description: "Your Favorites",
//   },
//   {
//     label: "Stars",
//     named: true,
//     iconName: "stars",
//     type: "stars",
//     navList: [
//       { label: "Any Star", url: "/list/anystar" },
//       { label: "1 Star", url: "/list/1star" },
//       { label: "2 Stars", url: "/list/2star" },
//       { label: "3 Stars", url: "/list/3star" },
//       {
//         label: "My Stars History",
//         url: "/personal/list/visited",
//         description: "My Stars (placed I have visited)",
//       },
//     ],
//   },
//   {
//     label: "Plate",
//     url: "/list/plate",
//     iconName: "plate",
//     description: "Michelin Plate: Rated by Michelin, Almost A Star",
//   },
//   {
//     label: "BIB",
//     url: "/list/bib",
//     iconName: "bib",
//     description: "Bib Gourmand: Quality Food At Good Value",
//   },
//   {
//     label: "Offline",
//     url: "/offline",
//     iconName: "offline",
//     description: "Places without online reservation, or unsupported system.",
//   },
// ];

export const MetroDefiniton = [
  {
    key: "bayarea",
    name: "Bay Area",
    latitude: 37.7609902,
    longitude: -122.4452644,
    timezone: "America/Los_Angeles",
    zoom: 8,
    startList: "anystar",
    navList: [
      {
        label: "SF Areas",
        named: true,
        iconName: "areas",
        navList: [
          { url: "/list/sf", label: "San Francisco" },
          { url: "/list/pensouth", label: "Pen/South Bay" },
          { url: "/list/eastbay", label: "East Bay" },
          { url: "/list/napa", label: "Napa/Sonoma" },
        ],
      },
      { label: "SF 100", url: "/list/sf100", iconName: "sf100" },
    ],
  },
  {
    key: "nyc",
    name: "New York City",
    latitude: 40.732583,
    longitude: -73.921802,
    timezone: "America/New_York",
    zoom: 11,
    startList: "anystar",
    navList: [
      {
        label: "NYC Boroughs",
        named: true,
        iconName: "areas",
        navList: [
          { url: "/list/Manhattan", label: "Manhattan" },
          { url: "/list/Brooklyn", label: "Brooklyn" },
          { url: "/list/Queens", label: "Queens" },
          { url: "/list/Staten_Island", label: "Staten Island" },
          { url: "/list/White_Plains", label: "White Plains" },
        ],
      },
    ],
  },
  {
    key: "london",
    name: "London",
    latitude: 51.5073859,
    longitude: -0.1277987,
    zoom: 11,
    timezone: "Europe/London",
    startList: "anystar",
    navList: [
      {
        label: "London Areas",
        iconName: "areas",
        navList: [
          { url: "/list/soho?lat=51.5137003&lng=-0.137082", label: "Soho" },
          {
            url: "/list/CoventGarden?lat=51.5110973&lng=-0.12677",
            label: "Covent Garden",
          },
          {
            url: "/list/Mayfair?lat=51.510435&lng=-0.148056",
            label: "Mayfair",
          },
          {
            url: "/list/Chelsea?lat=51.488010&lng=-0.169268",
            label: "Chelsea",
          },
          {
            url: "/list/CityOfLondon?lat=51.513782&lng=-0.089875",
            label: "City of London",
          },
        ],
      },
    ],
  },
  {
    key: "chicago",
    name: "Chicago",
    latitude: 41.849269,
    longitude: -87.674167,
    zoom: 11,
    timezone: "America/Chicago",
    startList: "anystar",
    navList: [
      {
        label: "Chicago Areas",
        iconName: "areas",
        navList: [
          {
            url: "/list/RiverNorth?lat=41.891892&lng=-87.633322",
            label: "River North",
          },
          {
            url: "/list/WestLoop?lat=41.884388&lng=-87.653893",
            label: "West Loop",
          },
          {
            url: "/list/LoganSquare?lat=41.921060&lng=-87.701703",
            label: "Logan Square",
          },
          {
            url: "/list/LincolnPark?lat=41.921504&lng=-87.647000",
            label: "Lincoln Park ",
          },
        ],
      },
    ],
  },
  {
    key: "washingtondc",
    name: "Washington DC",
    latitude: 38.900246,
    longitude: -77.036545,
    zoom: 12,
    timezone: "America/New_York",
    startList: "anystar",
    navList: [],
  },
  {
    key: "losangeles",
    name: "Los Angeles",
    latitude: 34.0719,
    longitude: -118.255457,
    timezone: "America/Los_Angeles",
    zoom: 9,
    startList: "anystar",
    navList: [
      {
        label: "LA Areas",
        iconName: "areas",
        navList: [
          {
            url: "/list/DowntownLA?lat=34.045763&lng=-118.250638",
            label: "Downtown LA",
          },
          {
            url: "/list/Hollywood?lat=34.086172&lng=-118.331637",
            label: "Hollywood",
          },
          {
            url: "/list/SantaMonica?lat=34.011648&lng=-118.493042",
            label: "Santa Monica",
          },
          {
            url: "/list/Pasadena?lat=34.151776&lng=-118.144878",
            label: "Pasadena",
          },
          {
            url: "/list/SantaAna?lat=33.781369&lng=-117.880802",
            label: "Santa Ana",
          },
        ],
      },
    ],
  },
  {
    key: "sandiego",
    name: "San Diego",
    latitude: 32.862886,
    longitude: -117.129935,
    zoom: 10,
    timezone: "America/Los_Angeles",
    startList: "any",
    navList: [],
  },
  {
    key: "sacramento",
    name: "Sacramento",
    latitude: 38.567313,
    longitude: -121.473808,
    timezone: "America/Los_Angeles",
    zoom: 12,
    startList: "any",
    navList: [],
  },
  {
    key: "tokyo",
    name: "Tokyo, Japan",
    latitude: 35.680828,
    longitude: 139.767245,
    zoom: 12,
    timezone: "Asia/Tokyo",
    startList: "anystar",
    navList: [],
  },
  {
    key: "kyoto",
    name: "Kyoto, Japan",
    latitude: 34.998828,
    longitude: 135.755325,
    zoom: 12,
    timezone: "Asia/Tokyo",
    startList: "any",
    navList: [],
  },
  {
    key: "osaka",
    name: "Osaka, Japan",
    latitude: 34.662093,
    longitude: 135.496706,
    zoom: 12,
    timezone: "Asia/Tokyo",
    startList: "any",
    navList: [],
  },
  {
    key: "iceland",
    name: "Iceland",
    latitude: 64.140662,
    longitude: -21.920078,
    timezone: "Atlantic/Reykjavik",
    zoom: 8,
    startList: "any",
    navList: [],
  },
  {
    key: "whistler",
    name: "Whistler BC",
    timezone: "America/Los_Angeles",
    latitude: 50.1041269,
    longitude: -123.0715545,
    zoom: 8,
    startList: "any",
    navList: [],
  },
  {
    key: "paris",
    name: "Paris (beta)",
    timezone: "Europe/Paris",
    latitude: 48.862452,
    longitude: 2.346715,
    zoom: 8,
    startList: "anystar",
    navList: [],
  },
  {
    key: "denmark",
    name: "Denmark (alpha)",
    timezone: "Europe/Copenhagen",
    latitude: 55.681351,
    longitude: 12.590557,
    zoom: 8,
    query: [["country", "==", "Denmark"]],
    startList: "any",
    navList: [],
  },
  {
    key: "HongKong",
    name: "Hong Kong",
    timezone: "Asia/Hong_Kong",
    latitude: 22.281337,
    longitude: 114.175219,
    zoom: 10,
    startList: "any",
    navList: [],
  },

  {
    key: "Macau",
    name: "Macau",
    timezone: "Asia/Macau",
    latitude: 22.187739,
    longitude: 113.551956,
    zoom: 11,
    startList: "any",
    navList: [],
  },
  {
    key: "Thailand",
    name: "Thailand (beta)",
    timezone: "Asia/Bangkok",
    latitude: 13.737901,
    longitude: 100.522553,
    zoom: 8,
    startList: "anystar",
    navList: [],
  },
  {
    key: "Taipei",
    name: "Taipei",
    timezone: "Asia/Taipei",
    latitude: 25.047813,
    longitude: 121.513366,
    zoom: 10,
    startList: "any",
    navList: [],
  },
  {
    key: "Singapore",
    name: "Singapore",
    timezone: "Asia/Singapore",
    latitude: 1.345573,
    longitude: 103.843555,
    zoom: 11,
    startList: "anystar",
    navList: [],
  },
  {
    key: "finland",
    name: "Finland (alpha)",
    timezone: "Europe/Helsinki",
    latitude: 60.165936,
    longitude: 24.942356,
    zoom: 8,
    query: [["country", "==", "Finland"]],
    startList: "any",
    navList: [],
  },
];

/*
const MetroAPI = {
  all: function () {
    return MetroDefiniton;
  },
  getMetro: function (metrokey) {
    let map = MetroDefiniton.reduce((m, i) => {
      m[i.key] = i;
      return m;
    }, {});
    return map[metrokey];
  },
  getMetroLocalArea: function (metrokey, area) {
    let metro = MetroAPI.getMetro(metrokey);
    if (!metro) {
      return null;
    }
    let list = metro.navList[0];
    if (!list.named) {
      return null;
    }
    let map = list.navList.reduce((m, i) => {
      let urlparts = i.url.split("/");
      let last = urlparts[urlparts.length - 1];
      m[last] = i;
      return m;
    }, {});
    return map[area];
  },
  MetroCommonNavList,
};
*/