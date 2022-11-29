import { TockSearchRequest, Request_RequestType } from '../generated/proto/TockRequests'

function doubleToByteArray(number: number) {
  var buffer = new ArrayBuffer(8);         // JS numbers are 8 bytes long, or 64 bits
  var longNum = new Float64Array(buffer);  // so equivalent to Float64
  longNum[0] = number;
  return Array.from(new Int8Array(buffer)).reverse();  // reverse to get little endian
}

function doubleToFloat64(number: number) {
  const bytes = doubleToByteArray(number);
  return bytes.map(b => (b >>> 0).toString(16).slice(-2)).join("");
}

export function newTockSearchRequest(term: string, longitude: number, latitude: number): TockSearchRequest {

  const request: TockSearchRequest = {
    request: {
      name: term,
      longitude: parseInt("0x" + doubleToFloat64(longitude)),
      latitude: parseInt("0x" + doubleToFloat64(latitude)),
      // longitude: parseInt("0x" + doubleToFloat64(-122.4194155)),
      // latitude: parseInt("0x" + doubleToFloat64(37.7749295)),
      requestType: {
        requestType: Request_RequestType.THISWORKS
      }
    }
  };

  return request;
}

export function serializeMsgToProto(request: TockSearchRequest): Uint8Array {
  return TockSearchRequest.encode(request).finish()
}

// export function deserializeProtoToMsg(serializedMessage: Uint8Array): TockSearchRequest {
//   return TockSearchRequest.decode(serializedMessage)
// }
