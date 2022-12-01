import { VendorBase } from './VendorBase';
import { VendorBookarestaurant } from './VendorBookarestaurant';
import { VendorBookatable } from './VendorBookatable';
import { VendorChope } from './VendorChope';
import { VendorCovermanager } from './VendorCovermanager';
import { VendorDineout } from './VendorDineout';
import { VendorDinesuperb } from './VendorDinesuperb';
import { VendorEat2Eat } from './VendorEat2Eat';
import { VendorEztable } from './VendorEztable';
import { VendorFunNow } from './VendorFunNow';
import { VendorIkyu } from './VendorIkyu';
import { VendorInlineApp } from './VendorInlineApp';
import { VendorLafourchette } from './VendorLafourchette';
import { VendorOmakase } from './VendorOmakase';
import { VendorOpentable } from './VendorOpentable';
import { VendorPocketConcierge } from './VendorPocketConcierge';
import { VendorQuandoo } from './VendorQuandoo';
import { VendorResdiary } from './VendorResdiary';
import { VendorResengo } from './VendorResengo';
import { VendorRestaurantes } from './VendorRestaurantes';
import { VendorResy } from './VendorResy';
import { VendorSevenrooms } from './VendorSevenrooms';
import { VendorTabelog } from './VendorTabelog';
import { VendorTock } from './VendorTock';
import { VendorToreta } from './VendorToreta';
import { VendorYelp } from './VendorYelp';
import { VendorZenchef } from './VendorZenchef';

type tplotOptions = {
    [key: string]: VendorBase
};

export const VendorMap: tplotOptions = {
    opentable: new VendorOpentable(),
    resy: new VendorResy(),
    tock: new VendorTock(),
    bookarestaurant: new VendorBookarestaurant(),
    bookatable: new VendorBookatable(),
    dinesuperb: new VendorDinesuperb(),
    resdiary: new VendorResdiary(),
    sevenrooms: new VendorSevenrooms(),
    yelp: new VendorYelp(),
    // tablecheck: new VendorTablecheck(),
    "pocket-concierge": new VendorPocketConcierge(),
    toreta: new VendorToreta(),
    omakase: new VendorOmakase(),
    ikyu: new VendorIkyu(),
    chope: new VendorChope(),
    funnow: new VendorFunNow(),
    dineout: new VendorDineout(),
    tabelog: new VendorTabelog(),
    eat2eat: new VendorEat2Eat(),
    quandoo: new VendorQuandoo(),
    inline: new VendorInlineApp(),
    eztable: new VendorEztable(),
    lafourchette: new VendorLafourchette(),
    zenchef: new VendorZenchef(),
    covermanager: new VendorCovermanager(),
    restaurantes: new VendorRestaurantes(),
    "resengo.com": new VendorResengo(),
}

export const getVendor = (type: string): VendorBase => {
    return VendorMap[type];
}