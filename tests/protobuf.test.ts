import {
    deserializeTockSearchResponseProtoToMsg,
    newTockSearchRequest,
    serializeMsgToProto,
} from '../yumutil/src';
import { gotScraping } from 'got-scraping';

describe('Tock search API with protobuf', () => {

    it('looking up French Laundary should find matching slug tfl', async () => {
        const request = newTockSearchRequest("French Laundary", -122.4194155, 37.7749295);
        const proto = serializeMsgToProto(request);

        const url = "https://www.exploretock.com/api/consumer/suggest/nav";

        const yo: any = await gotScraping.post({
            url: url,
            "headers": {
                "accept": "application/octet-stream",
                "content-type": "application/octet-stream",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "x-tock-stream-format": "proto2",
                "Accept-Encoding": "identity",
            },
            "body": proto,
            "method": "POST",
            responseType: 'buffer',
            headerGeneratorOptions: {
                browsers: [
                    {
                        name: 'chrome',
                        minVersion: 87,
                        maxVersion: 89
                    }
                ],
                devices: ['desktop'],
                locales: ['de-DE', 'en-US'],
                operatingSystems: ['windows', 'linux'],
            },
        });

        const buffer = yo.body;
        const response = deserializeTockSearchResponseProtoToMsg(new Uint8Array(buffer));

        // debug tools
        // function buf2hex(buffer: any) { // buffer is an ArrayBuffer
        //     return [...new Uint8Array(buffer)]
        //         .map(x => x.toString(16).padStart(2, '0'))
        //         .join('');
        // }
        // const buffer = await yo.arrayBuffer();
        // console.log(buf2hex(buffer));
        // console.log(JSON.stringify(response, null, 2));

        expect(response?.r1!.r2!.r3!.searchResults[0].slug).toEqual("tfl");
    })
})
