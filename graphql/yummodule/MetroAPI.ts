import { MetroDefiniton } from "./metro_def";
const MetroCommonNavList = [
    { label: "Nearby", url: "/nearby", iconName: "nearby", description: "Places Closet To You" },
    {
        label: "Favorites",
        url: "/personal/list/favorites",
        iconName: "favorite",
        type: "favorite",
        description: "Your Favorites",
    },
    {
        label: "Stars",
        named: true,
        iconName: "stars",
        type: "stars",
        navList:
            [
                { label: "Any Star", url: "/list/anystar" },
                { label: "1 Star", url: "/list/1star" },
                { label: "2 Stars", url: "/list/2star" },
                { label: "3 Stars", url: "/list/3star" },
                { label: "My Stars History", url: "/personal/list/visited", description: "My Stars (placed I have visited)" },
            ]
    },
    { label: "Plate", url: "/list/plate", iconName: "plate", description: "Michelin Plate: Rated by Michelin, Almost A Star" },
    { label: "BIB", url: "/list/bib", iconName: "bib", description: "Bib Gourmand: Quality Food At Good Value" },
    { label: "Offline", url: "/offline", iconName: "offline", description: "Places without online reservation, or unsupported system." },
];

export const MetroAPI = {
    all: function () { return MetroDefiniton },
    getMetro: function (metrokey: string) {
        let map = MetroDefiniton.reduce((m: any, i: any) => {
            m[i.key] = i;
            return m;
        }, {});
        return map[metrokey];
    },
    getMetroLocalArea: function (metrokey: string, area: string) {
        let metro = MetroAPI.getMetro(metrokey);
        if (!metro) {
            return null;
        }
        let list = metro.navList[0];
        if (!list.named) {
            return null;
        }
        let map = list.navList.reduce((m: any, i: any) => {
            let urlparts = i.url.split("/");
            let last = urlparts[urlparts.length - 1];
            m[last] = i;
            return m;
        }, {});
        return map[area];
    },
    MetroCommonNavList,
}
