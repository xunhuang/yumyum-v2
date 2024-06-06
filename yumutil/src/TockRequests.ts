/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "tutorial";

export interface TockSearchRequest {
  request: TockSearchRequest_Request | undefined;
}

export interface TockSearchRequest_Request {
  name: string;
  requestType: TockSearchRequest_Request_RequestField | undefined;
  latitude: number;
  longitude: number;
}

export enum TockSearchRequest_Request_RequestType {
  NOTWORK = 0,
  THISWORKS = 20,
  UNRECOGNIZED = -1,
}

export function tockSearchRequest_Request_RequestTypeFromJSON(object: any): TockSearchRequest_Request_RequestType {
  switch (object) {
    case 0:
    case "NOTWORK":
      return TockSearchRequest_Request_RequestType.NOTWORK;
    case 20:
    case "THISWORKS":
      return TockSearchRequest_Request_RequestType.THISWORKS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TockSearchRequest_Request_RequestType.UNRECOGNIZED;
  }
}

export function tockSearchRequest_Request_RequestTypeToJSON(object: TockSearchRequest_Request_RequestType): string {
  switch (object) {
    case TockSearchRequest_Request_RequestType.NOTWORK:
      return "NOTWORK";
    case TockSearchRequest_Request_RequestType.THISWORKS:
      return "THISWORKS";
    case TockSearchRequest_Request_RequestType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface TockSearchRequest_Request_RequestField {
  requestType: TockSearchRequest_Request_RequestType;
}

export interface TockSearchResponse {
  r1: TockSearchResponse_Response1 | undefined;
}

export interface TockSearchResponse_ResponseRow {
  slug?: string | undefined;
  name?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
  unknownField?: string | undefined;
}

export interface TockSearchResponse_Response3 {
  searchResults: TockSearchResponse_ResponseRow[];
}

export interface TockSearchResponse_Response2 {
  r3: TockSearchResponse_Response3 | undefined;
}

export interface TockSearchResponse_Response1 {
  r2: TockSearchResponse_Response2 | undefined;
}

function createBaseTockSearchRequest(): TockSearchRequest {
  return { request: undefined };
}

export const TockSearchRequest = {
  encode(message: TockSearchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.request !== undefined) {
      TockSearchRequest_Request.encode(message.request, writer.uint32(482658).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TockSearchRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTockSearchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 60332:
          message.request = TockSearchRequest_Request.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchRequest {
    return { request: isSet(object.request) ? TockSearchRequest_Request.fromJSON(object.request) : undefined };
  },

  toJSON(message: TockSearchRequest): unknown {
    const obj: any = {};
    message.request !== undefined &&
      (obj.request = message.request ? TockSearchRequest_Request.toJSON(message.request) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchRequest>, I>>(object: I): TockSearchRequest {
    const message = createBaseTockSearchRequest();
    message.request = (object.request !== undefined && object.request !== null)
      ? TockSearchRequest_Request.fromPartial(object.request)
      : undefined;
    return message;
  },
};

function createBaseTockSearchRequest_Request(): TockSearchRequest_Request {
  return { name: "", requestType: undefined, latitude: 0, longitude: 0 };
}

export const TockSearchRequest_Request = {
  encode(message: TockSearchRequest_Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.requestType !== undefined) {
      TockSearchRequest_Request_RequestField.encode(message.requestType, writer.uint32(26).fork()).ldelim();
    }
    if (message.latitude !== 0) {
      writer.uint32(33).fixed64(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(41).fixed64(message.longitude);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TockSearchRequest_Request {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTockSearchRequest_Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 3:
          message.requestType = TockSearchRequest_Request_RequestField.decode(reader, reader.uint32());
          break;
        case 4:
          message.latitude = longToNumber(reader.fixed64() as Long);
          break;
        case 5:
          message.longitude = longToNumber(reader.fixed64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchRequest_Request {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      requestType: isSet(object.requestType)
        ? TockSearchRequest_Request_RequestField.fromJSON(object.requestType)
        : undefined,
      latitude: isSet(object.latitude) ? Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? Number(object.longitude) : 0,
    };
  },

  toJSON(message: TockSearchRequest_Request): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.requestType !== undefined && (obj.requestType = message.requestType
      ? TockSearchRequest_Request_RequestField.toJSON(message.requestType)
      : undefined);
    message.latitude !== undefined && (obj.latitude = Math.round(message.latitude));
    message.longitude !== undefined && (obj.longitude = Math.round(message.longitude));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchRequest_Request>, I>>(object: I): TockSearchRequest_Request {
    const message = createBaseTockSearchRequest_Request();
    message.name = object.name ?? "";
    message.requestType = (object.requestType !== undefined && object.requestType !== null)
      ? TockSearchRequest_Request_RequestField.fromPartial(object.requestType)
      : undefined;
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    return message;
  },
};

function createBaseTockSearchRequest_Request_RequestField(): TockSearchRequest_Request_RequestField {
  return { requestType: 0 };
}

export const TockSearchRequest_Request_RequestField = {
  encode(message: TockSearchRequest_Request_RequestField, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestType !== 0) {
      writer.uint32(8).int32(message.requestType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TockSearchRequest_Request_RequestField {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTockSearchRequest_Request_RequestField();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchRequest_Request_RequestField {
    return {
      requestType: isSet(object.requestType) ? tockSearchRequest_Request_RequestTypeFromJSON(object.requestType) : 0,
    };
  },

  toJSON(message: TockSearchRequest_Request_RequestField): unknown {
    const obj: any = {};
    message.requestType !== undefined &&
      (obj.requestType = tockSearchRequest_Request_RequestTypeToJSON(message.requestType));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchRequest_Request_RequestField>, I>>(
    object: I,
  ): TockSearchRequest_Request_RequestField {
    const message = createBaseTockSearchRequest_Request_RequestField();
    message.requestType = object.requestType ?? 0;
    return message;
  },
};

function createBaseTockSearchResponse(): TockSearchResponse {
  return { r1: undefined };
}

export const TockSearchResponse = {
  encode(message: TockSearchResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.r1 !== undefined) {
      TockSearchResponse_Response1.encode(message.r1, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TockSearchResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTockSearchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.r1 = TockSearchResponse_Response1.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchResponse {
    return { r1: isSet(object.r1) ? TockSearchResponse_Response1.fromJSON(object.r1) : undefined };
  },

  toJSON(message: TockSearchResponse): unknown {
    const obj: any = {};
    message.r1 !== undefined && (obj.r1 = message.r1 ? TockSearchResponse_Response1.toJSON(message.r1) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchResponse>, I>>(object: I): TockSearchResponse {
    const message = createBaseTockSearchResponse();
    message.r1 = (object.r1 !== undefined && object.r1 !== null)
      ? TockSearchResponse_Response1.fromPartial(object.r1)
      : undefined;
    return message;
  },
};

function createBaseTockSearchResponse_ResponseRow(): TockSearchResponse_ResponseRow {
  return {
    slug: undefined,
    name: undefined,
    city: undefined,
    state: undefined,
    country: undefined,
    unknownField: undefined,
  };
}

export const TockSearchResponse_ResponseRow = {
  encode(message: TockSearchResponse_ResponseRow, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.slug !== undefined) {
      writer.uint32(18).string(message.slug);
    }
    if (message.name !== undefined) {
      writer.uint32(26).string(message.name);
    }
    if (message.city !== undefined) {
      writer.uint32(34).string(message.city);
    }
    if (message.state !== undefined) {
      writer.uint32(42).string(message.state);
    }
    if (message.country !== undefined) {
      writer.uint32(50).string(message.country);
    }
    if (message.unknownField !== undefined) {
      writer.uint32(58).string(message.unknownField);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TockSearchResponse_ResponseRow {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTockSearchResponse_ResponseRow();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.slug = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.city = reader.string();
          break;
        case 5:
          message.state = reader.string();
          break;
        case 6:
          message.country = reader.string();
          break;
        case 7:
          message.unknownField = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchResponse_ResponseRow {
    return {
      slug: isSet(object.slug) ? String(object.slug) : undefined,
      name: isSet(object.name) ? String(object.name) : undefined,
      city: isSet(object.city) ? String(object.city) : undefined,
      state: isSet(object.state) ? String(object.state) : undefined,
      country: isSet(object.country) ? String(object.country) : undefined,
      unknownField: isSet(object.unknownField) ? String(object.unknownField) : undefined,
    };
  },

  toJSON(message: TockSearchResponse_ResponseRow): unknown {
    const obj: any = {};
    message.slug !== undefined && (obj.slug = message.slug);
    message.name !== undefined && (obj.name = message.name);
    message.city !== undefined && (obj.city = message.city);
    message.state !== undefined && (obj.state = message.state);
    message.country !== undefined && (obj.country = message.country);
    message.unknownField !== undefined && (obj.unknownField = message.unknownField);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchResponse_ResponseRow>, I>>(
    object: I,
  ): TockSearchResponse_ResponseRow {
    const message = createBaseTockSearchResponse_ResponseRow();
    message.slug = object.slug ?? undefined;
    message.name = object.name ?? undefined;
    message.city = object.city ?? undefined;
    message.state = object.state ?? undefined;
    message.country = object.country ?? undefined;
    message.unknownField = object.unknownField ?? undefined;
    return message;
  },
};

function createBaseTockSearchResponse_Response3(): TockSearchResponse_Response3 {
  return { searchResults: [] };
}

export const TockSearchResponse_Response3 = {
  encode(message: TockSearchResponse_Response3, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.searchResults) {
      TockSearchResponse_ResponseRow.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TockSearchResponse_Response3 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTockSearchResponse_Response3();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.searchResults.push(TockSearchResponse_ResponseRow.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchResponse_Response3 {
    return {
      searchResults: Array.isArray(object?.searchResults)
        ? object.searchResults.map((e: any) => TockSearchResponse_ResponseRow.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TockSearchResponse_Response3): unknown {
    const obj: any = {};
    if (message.searchResults) {
      obj.searchResults = message.searchResults.map((e) => e ? TockSearchResponse_ResponseRow.toJSON(e) : undefined);
    } else {
      obj.searchResults = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchResponse_Response3>, I>>(object: I): TockSearchResponse_Response3 {
    const message = createBaseTockSearchResponse_Response3();
    message.searchResults = object.searchResults?.map((e) => TockSearchResponse_ResponseRow.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTockSearchResponse_Response2(): TockSearchResponse_Response2 {
  return { r3: undefined };
}

export const TockSearchResponse_Response2 = {
  encode(message: TockSearchResponse_Response2, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.r3 !== undefined) {
      TockSearchResponse_Response3.encode(message.r3, writer.uint32(482666).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TockSearchResponse_Response2 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTockSearchResponse_Response2();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 60333:
          message.r3 = TockSearchResponse_Response3.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchResponse_Response2 {
    return { r3: isSet(object.r3) ? TockSearchResponse_Response3.fromJSON(object.r3) : undefined };
  },

  toJSON(message: TockSearchResponse_Response2): unknown {
    const obj: any = {};
    message.r3 !== undefined && (obj.r3 = message.r3 ? TockSearchResponse_Response3.toJSON(message.r3) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchResponse_Response2>, I>>(object: I): TockSearchResponse_Response2 {
    const message = createBaseTockSearchResponse_Response2();
    message.r3 = (object.r3 !== undefined && object.r3 !== null)
      ? TockSearchResponse_Response3.fromPartial(object.r3)
      : undefined;
    return message;
  },
};

function createBaseTockSearchResponse_Response1(): TockSearchResponse_Response1 {
  return { r2: undefined };
}

export const TockSearchResponse_Response1 = {
  encode(message: TockSearchResponse_Response1, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.r2 !== undefined) {
      TockSearchResponse_Response2.encode(message.r2, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TockSearchResponse_Response1 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTockSearchResponse_Response1();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.r2 = TockSearchResponse_Response2.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchResponse_Response1 {
    return { r2: isSet(object.r2) ? TockSearchResponse_Response2.fromJSON(object.r2) : undefined };
  },

  toJSON(message: TockSearchResponse_Response1): unknown {
    const obj: any = {};
    message.r2 !== undefined && (obj.r2 = message.r2 ? TockSearchResponse_Response2.toJSON(message.r2) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchResponse_Response1>, I>>(object: I): TockSearchResponse_Response1 {
    const message = createBaseTockSearchResponse_Response1();
    message.r2 = (object.r2 !== undefined && object.r2 !== null)
      ? TockSearchResponse_Response2.fromPartial(object.r2)
      : undefined;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
