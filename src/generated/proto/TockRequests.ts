/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "tutorial";

export interface Request {
  name: string;
  requestType: Request_RequestField | undefined;
  latitude: number;
  longitude: number;
}

export enum Request_RequestType {
  NOTWORK = 0,
  THISWORKS = 20,
  UNRECOGNIZED = -1,
}

export function request_RequestTypeFromJSON(object: any): Request_RequestType {
  switch (object) {
    case 0:
    case "NOTWORK":
      return Request_RequestType.NOTWORK;
    case 20:
    case "THISWORKS":
      return Request_RequestType.THISWORKS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Request_RequestType.UNRECOGNIZED;
  }
}

export function request_RequestTypeToJSON(object: Request_RequestType): string {
  switch (object) {
    case Request_RequestType.NOTWORK:
      return "NOTWORK";
    case Request_RequestType.THISWORKS:
      return "THISWORKS";
    case Request_RequestType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Request_RequestField {
  requestType: Request_RequestType;
}

export interface TockSearchRequest {
  request: Request | undefined;
}

function createBaseRequest(): Request {
  return { name: "", requestType: undefined, latitude: 0, longitude: 0 };
}

export const Request = {
  encode(message: Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.requestType !== undefined) {
      Request_RequestField.encode(message.requestType, writer.uint32(26).fork()).ldelim();
    }
    if (message.latitude !== 0) {
      writer.uint32(33).fixed64(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(41).fixed64(message.longitude);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Request {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 3:
          message.requestType = Request_RequestField.decode(reader, reader.uint32());
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

  fromJSON(object: any): Request {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      requestType: isSet(object.requestType) ? Request_RequestField.fromJSON(object.requestType) : undefined,
      latitude: isSet(object.latitude) ? Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? Number(object.longitude) : 0,
    };
  },

  toJSON(message: Request): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.requestType !== undefined &&
      (obj.requestType = message.requestType ? Request_RequestField.toJSON(message.requestType) : undefined);
    message.latitude !== undefined && (obj.latitude = Math.round(message.latitude));
    message.longitude !== undefined && (obj.longitude = Math.round(message.longitude));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Request>, I>>(object: I): Request {
    const message = createBaseRequest();
    message.name = object.name ?? "";
    message.requestType = (object.requestType !== undefined && object.requestType !== null)
      ? Request_RequestField.fromPartial(object.requestType)
      : undefined;
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    return message;
  },
};

function createBaseRequest_RequestField(): Request_RequestField {
  return { requestType: 0 };
}

export const Request_RequestField = {
  encode(message: Request_RequestField, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestType !== 0) {
      writer.uint32(8).int32(message.requestType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Request_RequestField {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequest_RequestField();
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

  fromJSON(object: any): Request_RequestField {
    return { requestType: isSet(object.requestType) ? request_RequestTypeFromJSON(object.requestType) : 0 };
  },

  toJSON(message: Request_RequestField): unknown {
    const obj: any = {};
    message.requestType !== undefined && (obj.requestType = request_RequestTypeToJSON(message.requestType));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Request_RequestField>, I>>(object: I): Request_RequestField {
    const message = createBaseRequest_RequestField();
    message.requestType = object.requestType ?? 0;
    return message;
  },
};

function createBaseTockSearchRequest(): TockSearchRequest {
  return { request: undefined };
}

export const TockSearchRequest = {
  encode(message: TockSearchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.request !== undefined) {
      Request.encode(message.request, writer.uint32(482658).fork()).ldelim();
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
          message.request = Request.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TockSearchRequest {
    return { request: isSet(object.request) ? Request.fromJSON(object.request) : undefined };
  },

  toJSON(message: TockSearchRequest): unknown {
    const obj: any = {};
    message.request !== undefined && (obj.request = message.request ? Request.toJSON(message.request) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TockSearchRequest>, I>>(object: I): TockSearchRequest {
    const message = createBaseTockSearchRequest();
    message.request = (object.request !== undefined && object.request !== null)
      ? Request.fromPartial(object.request)
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
