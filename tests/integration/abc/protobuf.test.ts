import { deserializeTockSearchResponseProtoToMsg, newTockSearchRequest, serializeMsgToProto } from '../../../src/yummodule/tockRequestMsg'

const fetch = require('node-fetch');

describe('serialize and deserialize protobuf message', () => {

    async function abc(): Promise<void> {
    }

    it('should serialize to a protobuf and then deserialize to the same AddressBook message', async () => {
        const request = newTockSearchRequest("French Laundary", -122.4194155, 37.7749295);
        const proto = serializeMsgToProto(request);

        const yo = await fetch("https://www.exploretock.com/api/consumer/suggest/nav", {
            "headers": {
                "accept": "application/octet-stream",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "content-type": "application/octet-stream",
                "dpr": "1",
                "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "traceparent": "00-400e11eb8419a806155f36a25597cf4f-a17fbac6ab977cba-01",
                "viewport-width": "1334",
                "x-tock-authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXRyb25JZCI6IjYwNDI5OTUiLCJleHAiOjE2OTU0MDYzMTUsImlhdCI6MTY2Mzg3MDMxNX0.uPsjE4DWHj7zyQyvFP7fXCdV3nyzDxHYlzQq18OtkIA",
                "x-tock-build-number": "601230",
                "x-tock-experimentvariantlist": "WidgetBusinessNeighborhood:0,ExperienceTagFilter:1,AddToCartButtonLinkToCart:1,ShopShippingAdditionalItemsText:0,ShopShippingAdditionalItemsCartText:1,ProductCardPaletteLabelsText:0",
                "x-tock-fingerprint": "f258321c9354e0143b65c2d4c519b455",
                "x-tock-path": "/city/san-francisco",
                "x-tock-scope": "{\"site\":\"EXPLORETOCK\"}",
                "x-tock-session": "client_WhnD25irJMRW46cnipy5ATxW3hSDEENATiAiy6gF",
                "x-tock-shipping-state": "CA",
                "x-tock-stream-format": "proto2",
                "cookie": "_gcl_au=1.1.84428837.1663010872; _fbp=fb.1.1663010872979.1367840335; tock_access=\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXRyb25JZCI6IjYwNDI5OTUiLCJleHAiOjE2OTU0MDYzMTUsImlhdCI6MTY2Mzg3MDMxNX0.uPsjE4DWHj7zyQyvFP7fXCdV3nyzDxHYlzQq18OtkIA\"; __stripe_mid=11e2e112-d24a-4114-9731-c38e93fbb80e079015; tock_geo=10; __cf_bm=ll1c9hfIGaeQ_akUuSFmb5YfW9ytnzjtZP3zsSekEHw-1669681555-0-Ab1LNrhsQIv+i/ngmUOMMWWx707qiZ6A8GYUC775VjsvdJvfuX5Gebb0RfCBzE7qLTL9gJ4HLJg6/OBc0xd1/J4=; notice_behavior=implied,us; tock_exp=WidgetBusinessNeighborhood:0,ExperienceTagFilter:1,AddToCartButtonLinkToCart:1,ShopShippingAdditionalItemsText:0,ShopShippingAdditionalItemsCartText:1,ProductCardPaletteLabelsText:0; tock_shipping_state=\"CA\"; JSESSIONID=loPN9-0mhPNcU0_xbGmvkqCdAQpsrJzIMNWLLOBm; _gid=GA1.2.2126522280.1669681557; _ga_9JVND3LQW4=GS1.1.1669681557.3.0.1669681557.0.0.0; _ga=GA1.1.1027086921.1663010873; _gat=1; amp_6fd667=csTpuy3ZAAyiOyzHA-lqk3...1gj0cdb4r.1gj0cdc4b.0.5.5",
                "Referer": "https://www.exploretock.com/city/san-francisco",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": proto,
            "method": "POST"
        });


        const buffer = await yo.arrayBuffer();

        const response = deserializeTockSearchResponseProtoToMsg(new Uint8Array(buffer));

        function buf2hex(buffer: any) { // buffer is an ArrayBuffer
            return [...new Uint8Array(buffer)]
                .map(x => x.toString(16).padStart(2, '0'))
                .join('');
        }

        // const buffer = await yo.arrayBuffer();
        // console.log(buf2hex(buffer));
        console.log(JSON.stringify(response, null, 2));
    })
})
