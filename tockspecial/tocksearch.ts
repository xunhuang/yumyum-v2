import {
  yumyumGraphQLCall,
  newTockSearchRequest,
  serializeMsgToProto,
  deserializeTockSearchResponseProtoToMsg,
} from "yumutil";

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from "puppeteer-extra";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
import { buffer } from "stream/consumers";
puppeteer.use(StealthPlugin());

(async function main(): Promise<void> {
  console.log("hello");
  const browser = await puppeteer.launch({
    executablePath: executablePath(),
    headless: false,
  });
  const searchUrl = "https://www.exploretock.com/api/consumer/suggest/nav";
  const page = await browser.newPage();
  const url = `https://www.exploretock.com`;
  console.log(`going to ${url}`);
  await page.goto(url);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const term = "SSAL";
    const longitude = -121.8892769;
    const latitude = 37.3348779;
    const requestData = newTockSearchRequest(term, longitude, latitude);
    const proto = serializeMsgToProto(requestData);
    const protoBase64 = Buffer.from(proto).toString("base64");
    // Send the POST request
    const response = await page.evaluate((data: any) => {
      console.log(data);

      // Decode the Base64-encoded binary data back to binary
      const binaryString = atob(data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const searchUrl = "https://www.exploretock.com/api/consumer/suggest/nav";
      return fetch(searchUrl, {
        method: "POST",
        headers: {
          accept: "application/octet-stream",
          "content-type": "application/octet-stream",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          "x-tock-stream-format": "proto2",
          "Accept-Encoding": "identity",
        },
        body: bytes,
      })
        .then((response) => response.arrayBuffer())
        .then((k) => {
          const uint8Array = new Uint8Array(k);
          let binaryString = "";
          for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
          }
          // Encode binary string to Base64
          const base64Encoded = btoa(binaryString);
          return base64Encoded;
        });
    }, protoBase64);
    const binaryResponse = Buffer.from(response, "base64");
    const final = deserializeTockSearchResponseProtoToMsg(binaryResponse);
    console.log(final.r1?.r2?.r3);
  } catch (e) {
    console.log(e);
  }
  console.log("done");
})();
