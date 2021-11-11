import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /** A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Boolean']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Boolean']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Boolean']>>;
};

/** All input for the create `Global11042021` mutation. */
export type CreateGlobal11042021Input = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Global11042021` to be created by this mutation. */
  global11042021: Global11042021Input;
};

/** The output of our create `Global11042021` mutation. */
export type CreateGlobal11042021Payload = {
  __typename?: 'CreateGlobal11042021Payload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Global11042021` that was created by this mutation. */
  global11042021?: Maybe<Global11042021>;
  /** An edge for our `Global11042021`. May be used by Relay 1. */
  global11042021Edge?: Maybe<Global11042021SEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Global11042021` mutation. */
export type CreateGlobal11042021PayloadGlobal11042021EdgeArgs = {
  orderBy?: Maybe<Array<Global11042021SOrderBy>>;
};

/** All input for the create `T1` mutation. */
export type CreateT1Input = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `T1` to be created by this mutation. */
  t1: T1Input;
};

/** The output of our create `T1` mutation. */
export type CreateT1Payload = {
  __typename?: 'CreateT1Payload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `T1` that was created by this mutation. */
  t1?: Maybe<T1>;
  /** An edge for our `T1`. May be used by Relay 1. */
  t1Edge?: Maybe<T1SEdge>;
};


/** The output of our create `T1` mutation. */
export type CreateT1PayloadT1EdgeArgs = {
  orderBy?: Maybe<Array<T1SOrderBy>>;
};

/** All input for the create `T` mutation. */
export type CreateTInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `T` to be created by this mutation. */
  t: TInput;
};

/** The output of our create `T` mutation. */
export type CreateTPayload = {
  __typename?: 'CreateTPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `T` that was created by this mutation. */
  t?: Maybe<T>;
  /** An edge for our `T`. May be used by Relay 1. */
  tEdge?: Maybe<TsEdge>;
};


/** The output of our create `T` mutation. */
export type CreateTPayloadTEdgeArgs = {
  orderBy?: Maybe<Array<TsOrderBy>>;
};

/** All input for the create `Venue` mutation. */
export type CreateVenueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Venue` to be created by this mutation. */
  venue: VenueInput;
};

/** The output of our create `Venue` mutation. */
export type CreateVenuePayload = {
  __typename?: 'CreateVenuePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Venue` that was created by this mutation. */
  venue?: Maybe<Venue>;
  /** An edge for our `Venue`. May be used by Relay 1. */
  venueEdge?: Maybe<VenuesEdge>;
};


/** The output of our create `Venue` mutation. */
export type CreateVenuePayloadVenueEdgeArgs = {
  orderBy?: Maybe<Array<VenuesOrderBy>>;
};

/** A filter to be used against Float fields. All fields are combined with a logical ‘and.’ */
export type FloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Float']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Float']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Float']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Float']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Float']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Float']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Float']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Float']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Float']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Float']>>;
};

export type Global11042021 = {
  __typename?: 'Global11042021';
  area?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  cuisines?: Maybe<Scalars['String']>;
  imageList?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  mainImage?: Maybe<Scalars['String']>;
  michelinAward?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  objectId?: Maybe<Scalars['String']>;
  onlineBooking?: Maybe<Scalars['Boolean']>;
  otherUrls?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  siteName?: Maybe<Scalars['String']>;
  siteSlug?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  takeAway?: Maybe<Scalars['Boolean']>;
  url?: Maybe<Scalars['String']>;
};

/**
 * A condition to be used against `Global11042021` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type Global11042021Condition = {
  /** Checks for equality with the object’s `area` field. */
  area?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `city` field. */
  city?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `country` field. */
  country?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `cuisines` field. */
  cuisines?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `imageList` field. */
  imageList?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `latitude` field. */
  latitude?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `longitude` field. */
  longitude?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `mainImage` field. */
  mainImage?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `michelinAward` field. */
  michelinAward?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `objectId` field. */
  objectId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `onlineBooking` field. */
  onlineBooking?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `otherUrls` field. */
  otherUrls?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `postcode` field. */
  postcode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `region` field. */
  region?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `siteName` field. */
  siteName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `siteSlug` field. */
  siteSlug?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `slug` field. */
  slug?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `street` field. */
  street?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `takeAway` field. */
  takeAway?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `url` field. */
  url?: Maybe<Scalars['String']>;
};

/** A filter to be used against `Global11042021` object types. All fields are combined with a logical ‘and.’ */
export type Global11042021Filter = {
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<Global11042021Filter>>;
  /** Filter by the object’s `area` field. */
  area?: Maybe<StringFilter>;
  /** Filter by the object’s `city` field. */
  city?: Maybe<StringFilter>;
  /** Filter by the object’s `country` field. */
  country?: Maybe<StringFilter>;
  /** Filter by the object’s `cuisines` field. */
  cuisines?: Maybe<StringFilter>;
  /** Filter by the object’s `imageList` field. */
  imageList?: Maybe<StringFilter>;
  /** Filter by the object’s `latitude` field. */
  latitude?: Maybe<StringFilter>;
  /** Filter by the object’s `longitude` field. */
  longitude?: Maybe<StringFilter>;
  /** Filter by the object’s `mainImage` field. */
  mainImage?: Maybe<StringFilter>;
  /** Filter by the object’s `michelinAward` field. */
  michelinAward?: Maybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Negates the expression. */
  not?: Maybe<Global11042021Filter>;
  /** Filter by the object’s `objectId` field. */
  objectId?: Maybe<StringFilter>;
  /** Filter by the object’s `onlineBooking` field. */
  onlineBooking?: Maybe<BooleanFilter>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<Global11042021Filter>>;
  /** Filter by the object’s `otherUrls` field. */
  otherUrls?: Maybe<StringFilter>;
  /** Filter by the object’s `postcode` field. */
  postcode?: Maybe<StringFilter>;
  /** Filter by the object’s `region` field. */
  region?: Maybe<StringFilter>;
  /** Filter by the object’s `siteName` field. */
  siteName?: Maybe<StringFilter>;
  /** Filter by the object’s `siteSlug` field. */
  siteSlug?: Maybe<StringFilter>;
  /** Filter by the object’s `slug` field. */
  slug?: Maybe<StringFilter>;
  /** Filter by the object’s `street` field. */
  street?: Maybe<StringFilter>;
  /** Filter by the object’s `takeAway` field. */
  takeAway?: Maybe<BooleanFilter>;
  /** Filter by the object’s `url` field. */
  url?: Maybe<StringFilter>;
};

/** An input for mutations affecting `Global11042021` */
export type Global11042021Input = {
  area?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  cuisines?: Maybe<Scalars['String']>;
  imageList?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  mainImage?: Maybe<Scalars['String']>;
  michelinAward?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  objectId?: Maybe<Scalars['String']>;
  onlineBooking?: Maybe<Scalars['Boolean']>;
  otherUrls?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  siteName?: Maybe<Scalars['String']>;
  siteSlug?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  takeAway?: Maybe<Scalars['Boolean']>;
  url?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Global11042021` values. */
export type Global11042021SConnection = {
  __typename?: 'Global11042021SConnection';
  /** A list of edges which contains the `Global11042021` and cursor to aid in pagination. */
  edges: Array<Global11042021SEdge>;
  /** A list of `Global11042021` objects. */
  nodes: Array<Maybe<Global11042021>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Global11042021` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Global11042021` edge in the connection. */
export type Global11042021SEdge = {
  __typename?: 'Global11042021SEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Global11042021` at the end of the edge. */
  node?: Maybe<Global11042021>;
};

/** Methods to use when ordering `Global11042021`. */
export enum Global11042021SOrderBy {
  AreaAsc = 'AREA_ASC',
  AreaDesc = 'AREA_DESC',
  CityAsc = 'CITY_ASC',
  CityDesc = 'CITY_DESC',
  CountryAsc = 'COUNTRY_ASC',
  CountryDesc = 'COUNTRY_DESC',
  CuisinesAsc = 'CUISINES_ASC',
  CuisinesDesc = 'CUISINES_DESC',
  ImageListAsc = 'IMAGE_LIST_ASC',
  ImageListDesc = 'IMAGE_LIST_DESC',
  LatitudeAsc = 'LATITUDE_ASC',
  LatitudeDesc = 'LATITUDE_DESC',
  LongitudeAsc = 'LONGITUDE_ASC',
  LongitudeDesc = 'LONGITUDE_DESC',
  MainImageAsc = 'MAIN_IMAGE_ASC',
  MainImageDesc = 'MAIN_IMAGE_DESC',
  MichelinAwardAsc = 'MICHELIN_AWARD_ASC',
  MichelinAwardDesc = 'MICHELIN_AWARD_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  ObjectIdAsc = 'OBJECT_ID_ASC',
  ObjectIdDesc = 'OBJECT_ID_DESC',
  OnlineBookingAsc = 'ONLINE_BOOKING_ASC',
  OnlineBookingDesc = 'ONLINE_BOOKING_DESC',
  OtherUrlsAsc = 'OTHER_URLS_ASC',
  OtherUrlsDesc = 'OTHER_URLS_DESC',
  PostcodeAsc = 'POSTCODE_ASC',
  PostcodeDesc = 'POSTCODE_DESC',
  RegionAsc = 'REGION_ASC',
  RegionDesc = 'REGION_DESC',
  SiteNameAsc = 'SITE_NAME_ASC',
  SiteNameDesc = 'SITE_NAME_DESC',
  SiteSlugAsc = 'SITE_SLUG_ASC',
  SiteSlugDesc = 'SITE_SLUG_DESC',
  SlugAsc = 'SLUG_ASC',
  SlugDesc = 'SLUG_DESC',
  StreetAsc = 'STREET_ASC',
  StreetDesc = 'STREET_DESC',
  TakeAwayAsc = 'TAKE_AWAY_ASC',
  TakeAwayDesc = 'TAKE_AWAY_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC'
}

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: Maybe<Scalars['JSON']>;
  /** Contains the specified JSON. */
  contains?: Maybe<Scalars['JSON']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: Maybe<Array<Scalars['String']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: Maybe<Array<Scalars['String']>>;
  /** Contains the specified key. */
  containsKey?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['JSON']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['JSON']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['JSON']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['JSON']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['JSON']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['JSON']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['JSON']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['JSON']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['JSON']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['JSON']>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Global11042021`. */
  createGlobal11042021?: Maybe<CreateGlobal11042021Payload>;
  /** Creates a single `T`. */
  createT?: Maybe<CreateTPayload>;
  /** Creates a single `T1`. */
  createT1?: Maybe<CreateT1Payload>;
  /** Creates a single `Venue`. */
  createVenue?: Maybe<CreateVenuePayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGlobal11042021Args = {
  input: CreateGlobal11042021Input;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTArgs = {
  input: CreateTInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateT1Args = {
  input: CreateT1Input;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateVenueArgs = {
  input: CreateVenueInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Reads and enables pagination through a set of `Global11042021`. */
  allGlobal11042021S?: Maybe<Global11042021SConnection>;
  /** Reads and enables pagination through a set of `T1`. */
  allT1S?: Maybe<T1SConnection>;
  /** Reads and enables pagination through a set of `T`. */
  allTs?: Maybe<TsConnection>;
  /** Reads and enables pagination through a set of `Venue`. */
  allVenues?: Maybe<VenuesConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllGlobal11042021SArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<Global11042021Condition>;
  filter?: Maybe<Global11042021Filter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Global11042021SOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllT1SArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<T1Condition>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<T1SOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<TCondition>;
  filter?: Maybe<TFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<TsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllVenuesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<VenueCondition>;
  filter?: Maybe<VenueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<VenuesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: Maybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['String']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: Maybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: Maybe<Scalars['String']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['String']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: Maybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: Maybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: Maybe<Scalars['String']>;
};

export type T = {
  __typename?: 'T';
  j?: Maybe<Scalars['JSON']>;
};

export type T1 = {
  __typename?: 'T1';
  j?: Maybe<Scalars['JSON']>;
};

/** A condition to be used against `T1` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type T1Condition = {
  /** Checks for equality with the object’s `j` field. */
  j?: Maybe<Scalars['JSON']>;
};

/** An input for mutations affecting `T1` */
export type T1Input = {
  j?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `T1` values. */
export type T1SConnection = {
  __typename?: 'T1SConnection';
  /** A list of edges which contains the `T1` and cursor to aid in pagination. */
  edges: Array<T1SEdge>;
  /** A list of `T1` objects. */
  nodes: Array<Maybe<T1>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `T1` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `T1` edge in the connection. */
export type T1SEdge = {
  __typename?: 'T1SEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `T1` at the end of the edge. */
  node?: Maybe<T1>;
};

/** Methods to use when ordering `T1`. */
export enum T1SOrderBy {
  JAsc = 'J_ASC',
  JDesc = 'J_DESC',
  Natural = 'NATURAL'
}

/** A condition to be used against `T` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TCondition = {
  /** Checks for equality with the object’s `j` field. */
  j?: Maybe<Scalars['JSON']>;
};

/** A filter to be used against `T` object types. All fields are combined with a logical ‘and.’ */
export type TFilter = {
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<TFilter>>;
  /** Filter by the object’s `j` field. */
  j?: Maybe<JsonFilter>;
  /** Negates the expression. */
  not?: Maybe<TFilter>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<TFilter>>;
};

/** An input for mutations affecting `T` */
export type TInput = {
  j?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `T` values. */
export type TsConnection = {
  __typename?: 'TsConnection';
  /** A list of edges which contains the `T` and cursor to aid in pagination. */
  edges: Array<TsEdge>;
  /** A list of `T` objects. */
  nodes: Array<Maybe<T>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `T` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `T` edge in the connection. */
export type TsEdge = {
  __typename?: 'TsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `T` at the end of the edge. */
  node?: Maybe<T>;
};

/** Methods to use when ordering `T`. */
export enum TsOrderBy {
  JAsc = 'J_ASC',
  JDesc = 'J_DESC',
  Natural = 'NATURAL'
}

export type Venue = {
  __typename?: 'Venue';
  accomondation?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  area?: Maybe<Scalars['String']>;
  autodetected?: Maybe<Scalars['String']>;
  bookatableClientid?: Maybe<Scalars['String']>;
  bookatablePartnerCode?: Maybe<Scalars['String']>;
  bookingnotes?: Maybe<Scalars['String']>;
  businessId?: Maybe<Scalars['String']>;
  businessid?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  close?: Maybe<Scalars['Boolean']>;
  closed?: Maybe<Scalars['Boolean']>;
  closehours?: Maybe<Scalars['String']>;
  connectionid?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  countryIso?: Maybe<Scalars['String']>;
  coverImage?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  cuisine?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  devnotes?: Maybe<Scalars['String']>;
  distinction?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  fulladdress?: Maybe<Scalars['String']>;
  guide?: Maybe<Scalars['String']>;
  imageList?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  localarea?: Maybe<Scalars['String']>;
  localname?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['Float']>;
  menuurl?: Maybe<Scalars['String']>;
  metro?: Maybe<Scalars['String']>;
  michelinId?: Maybe<Scalars['String']>;
  michelineOnlineReservation?: Maybe<Scalars['Boolean']>;
  myReservationUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  oldImages?: Maybe<Scalars['String']>;
  openhours?: Maybe<Scalars['String']>;
  otherReservation?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  priceline?: Maybe<Scalars['String']>;
  realurl?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  reservation?: Maybe<Scalars['String']>;
  reservationHint?: Maybe<Scalars['String']>;
  reservationUrl?: Maybe<Scalars['String']>;
  resyCityCode?: Maybe<Scalars['String']>;
  resyUrlSlug?: Maybe<Scalars['String']>;
  rsvpSupport?: Maybe<Scalars['String']>;
  sf?: Maybe<Scalars['String']>;
  showvenue?: Maybe<Scalars['Boolean']>;
  slots?: Maybe<Array<Scalars['String']>>;
  stars?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  tockUrlSlug?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  urlSlug?: Maybe<Scalars['String']>;
  withOnlineReservation?: Maybe<Scalars['String']>;
  workqueue?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};


export type VenueMyReservationUrlArgs = {
  date: Scalars['String'];
  party_size?: Maybe<Scalars['Int']>;
  timeOption?: Maybe<Scalars['String']>;
};


export type VenueSlotsArgs = {
  date: Scalars['String'];
  party_size?: Maybe<Scalars['Int']>;
  timeOption?: Maybe<Scalars['String']>;
};

/** A condition to be used against `Venue` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type VenueCondition = {
  /** Checks for equality with the object’s `accomondation` field. */
  accomondation?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `address` field. */
  address?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `area` field. */
  area?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `autodetected` field. */
  autodetected?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `bookatableClientid` field. */
  bookatableClientid?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `bookatablePartnerCode` field. */
  bookatablePartnerCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `bookingnotes` field. */
  bookingnotes?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `businessId` field. */
  businessId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `businessid` field. */
  businessid?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `city` field. */
  city?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `close` field. */
  close?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `closed` field. */
  closed?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `closehours` field. */
  closehours?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `connectionid` field. */
  connectionid?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `country` field. */
  country?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `countryIso` field. */
  countryIso?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `coverImage` field. */
  coverImage?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `creationTime` field. */
  creationTime?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `cuisine` field. */
  cuisine?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `currency` field. */
  currency?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `devnotes` field. */
  devnotes?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `distinction` field. */
  distinction?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `fulladdress` field. */
  fulladdress?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `guide` field. */
  guide?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `imageList` field. */
  imageList?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `key` field. */
  key?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `latitude` field. */
  latitude?: Maybe<Scalars['Float']>;
  /** Checks for equality with the object’s `localarea` field. */
  localarea?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `localname` field. */
  localname?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `longitude` field. */
  longitude?: Maybe<Scalars['Float']>;
  /** Checks for equality with the object’s `menuurl` field. */
  menuurl?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `metro` field. */
  metro?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `michelinId` field. */
  michelinId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `michelineOnlineReservation` field. */
  michelineOnlineReservation?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `oldImages` field. */
  oldImages?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `openhours` field. */
  openhours?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `otherReservation` field. */
  otherReservation?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `phone` field. */
  phone?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `priceline` field. */
  priceline?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `realurl` field. */
  realurl?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `region` field. */
  region?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `reservation` field. */
  reservation?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `reservationHint` field. */
  reservationHint?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `reservationUrl` field. */
  reservationUrl?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `resyCityCode` field. */
  resyCityCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `resyUrlSlug` field. */
  resyUrlSlug?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `rsvpSupport` field. */
  rsvpSupport?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `sf` field. */
  sf?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `showvenue` field. */
  showvenue?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `stars` field. */
  stars?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `tags` field. */
  tags?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `timezone` field. */
  timezone?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `tockUrlSlug` field. */
  tockUrlSlug?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `url` field. */
  url?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `urlSlug` field. */
  urlSlug?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `withOnlineReservation` field. */
  withOnlineReservation?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `workqueue` field. */
  workqueue?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `zip` field. */
  zip?: Maybe<Scalars['String']>;
};

/** A filter to be used against `Venue` object types. All fields are combined with a logical ‘and.’ */
export type VenueFilter = {
  /** Filter by the object’s `accomondation` field. */
  accomondation?: Maybe<StringFilter>;
  /** Filter by the object’s `address` field. */
  address?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<VenueFilter>>;
  /** Filter by the object’s `area` field. */
  area?: Maybe<StringFilter>;
  /** Filter by the object’s `autodetected` field. */
  autodetected?: Maybe<StringFilter>;
  /** Filter by the object’s `bookatableClientid` field. */
  bookatableClientid?: Maybe<StringFilter>;
  /** Filter by the object’s `bookatablePartnerCode` field. */
  bookatablePartnerCode?: Maybe<StringFilter>;
  /** Filter by the object’s `bookingnotes` field. */
  bookingnotes?: Maybe<StringFilter>;
  /** Filter by the object’s `businessId` field. */
  businessId?: Maybe<StringFilter>;
  /** Filter by the object’s `businessid` field. */
  businessid?: Maybe<StringFilter>;
  /** Filter by the object’s `city` field. */
  city?: Maybe<StringFilter>;
  /** Filter by the object’s `close` field. */
  close?: Maybe<BooleanFilter>;
  /** Filter by the object’s `closed` field. */
  closed?: Maybe<BooleanFilter>;
  /** Filter by the object’s `closehours` field. */
  closehours?: Maybe<StringFilter>;
  /** Filter by the object’s `connectionid` field. */
  connectionid?: Maybe<StringFilter>;
  /** Filter by the object’s `country` field. */
  country?: Maybe<StringFilter>;
  /** Filter by the object’s `countryIso` field. */
  countryIso?: Maybe<StringFilter>;
  /** Filter by the object’s `coverImage` field. */
  coverImage?: Maybe<StringFilter>;
  /** Filter by the object’s `creationTime` field. */
  creationTime?: Maybe<StringFilter>;
  /** Filter by the object’s `cuisine` field. */
  cuisine?: Maybe<StringFilter>;
  /** Filter by the object’s `currency` field. */
  currency?: Maybe<StringFilter>;
  /** Filter by the object’s `devnotes` field. */
  devnotes?: Maybe<StringFilter>;
  /** Filter by the object’s `distinction` field. */
  distinction?: Maybe<StringFilter>;
  /** Filter by the object’s `email` field. */
  email?: Maybe<StringFilter>;
  /** Filter by the object’s `fulladdress` field. */
  fulladdress?: Maybe<StringFilter>;
  /** Filter by the object’s `guide` field. */
  guide?: Maybe<StringFilter>;
  /** Filter by the object’s `imageList` field. */
  imageList?: Maybe<StringFilter>;
  /** Filter by the object’s `key` field. */
  key?: Maybe<StringFilter>;
  /** Filter by the object’s `latitude` field. */
  latitude?: Maybe<FloatFilter>;
  /** Filter by the object’s `localarea` field. */
  localarea?: Maybe<StringFilter>;
  /** Filter by the object’s `localname` field. */
  localname?: Maybe<StringFilter>;
  /** Filter by the object’s `longitude` field. */
  longitude?: Maybe<FloatFilter>;
  /** Filter by the object’s `menuurl` field. */
  menuurl?: Maybe<StringFilter>;
  /** Filter by the object’s `metro` field. */
  metro?: Maybe<StringFilter>;
  /** Filter by the object’s `michelinId` field. */
  michelinId?: Maybe<StringFilter>;
  /** Filter by the object’s `michelineOnlineReservation` field. */
  michelineOnlineReservation?: Maybe<BooleanFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Negates the expression. */
  not?: Maybe<VenueFilter>;
  /** Filter by the object’s `oldImages` field. */
  oldImages?: Maybe<StringFilter>;
  /** Filter by the object’s `openhours` field. */
  openhours?: Maybe<StringFilter>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<VenueFilter>>;
  /** Filter by the object’s `otherReservation` field. */
  otherReservation?: Maybe<StringFilter>;
  /** Filter by the object’s `phone` field. */
  phone?: Maybe<StringFilter>;
  /** Filter by the object’s `priceline` field. */
  priceline?: Maybe<StringFilter>;
  /** Filter by the object’s `realurl` field. */
  realurl?: Maybe<StringFilter>;
  /** Filter by the object’s `region` field. */
  region?: Maybe<StringFilter>;
  /** Filter by the object’s `reservation` field. */
  reservation?: Maybe<StringFilter>;
  /** Filter by the object’s `reservationHint` field. */
  reservationHint?: Maybe<StringFilter>;
  /** Filter by the object’s `reservationUrl` field. */
  reservationUrl?: Maybe<StringFilter>;
  /** Filter by the object’s `resyCityCode` field. */
  resyCityCode?: Maybe<StringFilter>;
  /** Filter by the object’s `resyUrlSlug` field. */
  resyUrlSlug?: Maybe<StringFilter>;
  /** Filter by the object’s `rsvpSupport` field. */
  rsvpSupport?: Maybe<StringFilter>;
  /** Filter by the object’s `sf` field. */
  sf?: Maybe<StringFilter>;
  /** Filter by the object’s `showvenue` field. */
  showvenue?: Maybe<BooleanFilter>;
  /** Filter by the object’s `stars` field. */
  stars?: Maybe<StringFilter>;
  /** Filter by the object’s `tags` field. */
  tags?: Maybe<StringFilter>;
  /** Filter by the object’s `timezone` field. */
  timezone?: Maybe<StringFilter>;
  /** Filter by the object’s `tockUrlSlug` field. */
  tockUrlSlug?: Maybe<StringFilter>;
  /** Filter by the object’s `url` field. */
  url?: Maybe<StringFilter>;
  /** Filter by the object’s `urlSlug` field. */
  urlSlug?: Maybe<StringFilter>;
  /** Filter by the object’s `withOnlineReservation` field. */
  withOnlineReservation?: Maybe<StringFilter>;
  /** Filter by the object’s `workqueue` field. */
  workqueue?: Maybe<StringFilter>;
  /** Filter by the object’s `zip` field. */
  zip?: Maybe<StringFilter>;
};

/** An input for mutations affecting `Venue` */
export type VenueInput = {
  accomondation?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  area?: Maybe<Scalars['String']>;
  autodetected?: Maybe<Scalars['String']>;
  bookatableClientid?: Maybe<Scalars['String']>;
  bookatablePartnerCode?: Maybe<Scalars['String']>;
  bookingnotes?: Maybe<Scalars['String']>;
  businessId?: Maybe<Scalars['String']>;
  businessid?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  close?: Maybe<Scalars['Boolean']>;
  closed?: Maybe<Scalars['Boolean']>;
  closehours?: Maybe<Scalars['String']>;
  connectionid?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  countryIso?: Maybe<Scalars['String']>;
  coverImage?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  cuisine?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  devnotes?: Maybe<Scalars['String']>;
  distinction?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  fulladdress?: Maybe<Scalars['String']>;
  guide?: Maybe<Scalars['String']>;
  imageList?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  localarea?: Maybe<Scalars['String']>;
  localname?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['Float']>;
  menuurl?: Maybe<Scalars['String']>;
  metro?: Maybe<Scalars['String']>;
  michelinId?: Maybe<Scalars['String']>;
  michelineOnlineReservation?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  oldImages?: Maybe<Scalars['String']>;
  openhours?: Maybe<Scalars['String']>;
  otherReservation?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  priceline?: Maybe<Scalars['String']>;
  realurl?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  reservation?: Maybe<Scalars['String']>;
  reservationHint?: Maybe<Scalars['String']>;
  reservationUrl?: Maybe<Scalars['String']>;
  resyCityCode?: Maybe<Scalars['String']>;
  resyUrlSlug?: Maybe<Scalars['String']>;
  rsvpSupport?: Maybe<Scalars['String']>;
  sf?: Maybe<Scalars['String']>;
  showvenue?: Maybe<Scalars['Boolean']>;
  stars?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  tockUrlSlug?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  urlSlug?: Maybe<Scalars['String']>;
  withOnlineReservation?: Maybe<Scalars['String']>;
  workqueue?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Venue` values. */
export type VenuesConnection = {
  __typename?: 'VenuesConnection';
  /** A list of edges which contains the `Venue` and cursor to aid in pagination. */
  edges: Array<VenuesEdge>;
  /** A list of `Venue` objects. */
  nodes: Array<Maybe<Venue>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Venue` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Venue` edge in the connection. */
export type VenuesEdge = {
  __typename?: 'VenuesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Venue` at the end of the edge. */
  node?: Maybe<Venue>;
};

/** Methods to use when ordering `Venue`. */
export enum VenuesOrderBy {
  AccomondationAsc = 'ACCOMONDATION_ASC',
  AccomondationDesc = 'ACCOMONDATION_DESC',
  AddressAsc = 'ADDRESS_ASC',
  AddressDesc = 'ADDRESS_DESC',
  AreaAsc = 'AREA_ASC',
  AreaDesc = 'AREA_DESC',
  AutodetectedAsc = 'AUTODETECTED_ASC',
  AutodetectedDesc = 'AUTODETECTED_DESC',
  BookatableClientidAsc = 'BOOKATABLE_CLIENTID_ASC',
  BookatableClientidDesc = 'BOOKATABLE_CLIENTID_DESC',
  BookatablePartnerCodeAsc = 'BOOKATABLE_PARTNER_CODE_ASC',
  BookatablePartnerCodeDesc = 'BOOKATABLE_PARTNER_CODE_DESC',
  BookingnotesAsc = 'BOOKINGNOTES_ASC',
  BookingnotesDesc = 'BOOKINGNOTES_DESC',
  BusinessidAsc = 'BUSINESSID_ASC',
  BusinessidDesc = 'BUSINESSID_DESC',
  BusinessIdAsc = 'BUSINESS_ID_ASC',
  BusinessIdDesc = 'BUSINESS_ID_DESC',
  CityAsc = 'CITY_ASC',
  CityDesc = 'CITY_DESC',
  ClosedAsc = 'CLOSED_ASC',
  ClosedDesc = 'CLOSED_DESC',
  ClosehoursAsc = 'CLOSEHOURS_ASC',
  ClosehoursDesc = 'CLOSEHOURS_DESC',
  CloseAsc = 'CLOSE_ASC',
  CloseDesc = 'CLOSE_DESC',
  ConnectionidAsc = 'CONNECTIONID_ASC',
  ConnectionidDesc = 'CONNECTIONID_DESC',
  CountryAsc = 'COUNTRY_ASC',
  CountryDesc = 'COUNTRY_DESC',
  CountryIsoAsc = 'COUNTRY_ISO_ASC',
  CountryIsoDesc = 'COUNTRY_ISO_DESC',
  CoverImageAsc = 'COVER_IMAGE_ASC',
  CoverImageDesc = 'COVER_IMAGE_DESC',
  CreationTimeAsc = 'CREATION_TIME_ASC',
  CreationTimeDesc = 'CREATION_TIME_DESC',
  CuisineAsc = 'CUISINE_ASC',
  CuisineDesc = 'CUISINE_DESC',
  CurrencyAsc = 'CURRENCY_ASC',
  CurrencyDesc = 'CURRENCY_DESC',
  DevnotesAsc = 'DEVNOTES_ASC',
  DevnotesDesc = 'DEVNOTES_DESC',
  DistinctionAsc = 'DISTINCTION_ASC',
  DistinctionDesc = 'DISTINCTION_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  FulladdressAsc = 'FULLADDRESS_ASC',
  FulladdressDesc = 'FULLADDRESS_DESC',
  GuideAsc = 'GUIDE_ASC',
  GuideDesc = 'GUIDE_DESC',
  ImageListAsc = 'IMAGE_LIST_ASC',
  ImageListDesc = 'IMAGE_LIST_DESC',
  KeyAsc = 'KEY_ASC',
  KeyDesc = 'KEY_DESC',
  LatitudeAsc = 'LATITUDE_ASC',
  LatitudeDesc = 'LATITUDE_DESC',
  LocalareaAsc = 'LOCALAREA_ASC',
  LocalareaDesc = 'LOCALAREA_DESC',
  LocalnameAsc = 'LOCALNAME_ASC',
  LocalnameDesc = 'LOCALNAME_DESC',
  LongitudeAsc = 'LONGITUDE_ASC',
  LongitudeDesc = 'LONGITUDE_DESC',
  MenuurlAsc = 'MENUURL_ASC',
  MenuurlDesc = 'MENUURL_DESC',
  MetroAsc = 'METRO_ASC',
  MetroDesc = 'METRO_DESC',
  MichelineOnlineReservationAsc = 'MICHELINE_ONLINE_RESERVATION_ASC',
  MichelineOnlineReservationDesc = 'MICHELINE_ONLINE_RESERVATION_DESC',
  MichelinIdAsc = 'MICHELIN_ID_ASC',
  MichelinIdDesc = 'MICHELIN_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  OldImagesAsc = 'OLD_IMAGES_ASC',
  OldImagesDesc = 'OLD_IMAGES_DESC',
  OpenhoursAsc = 'OPENHOURS_ASC',
  OpenhoursDesc = 'OPENHOURS_DESC',
  OtherReservationAsc = 'OTHER_RESERVATION_ASC',
  OtherReservationDesc = 'OTHER_RESERVATION_DESC',
  PhoneAsc = 'PHONE_ASC',
  PhoneDesc = 'PHONE_DESC',
  PricelineAsc = 'PRICELINE_ASC',
  PricelineDesc = 'PRICELINE_DESC',
  RealurlAsc = 'REALURL_ASC',
  RealurlDesc = 'REALURL_DESC',
  RegionAsc = 'REGION_ASC',
  RegionDesc = 'REGION_DESC',
  ReservationAsc = 'RESERVATION_ASC',
  ReservationDesc = 'RESERVATION_DESC',
  ReservationHintAsc = 'RESERVATION_HINT_ASC',
  ReservationHintDesc = 'RESERVATION_HINT_DESC',
  ReservationUrlAsc = 'RESERVATION_URL_ASC',
  ReservationUrlDesc = 'RESERVATION_URL_DESC',
  ResyCityCodeAsc = 'RESY_CITY_CODE_ASC',
  ResyCityCodeDesc = 'RESY_CITY_CODE_DESC',
  ResyUrlSlugAsc = 'RESY_URL_SLUG_ASC',
  ResyUrlSlugDesc = 'RESY_URL_SLUG_DESC',
  RsvpSupportAsc = 'RSVP_SUPPORT_ASC',
  RsvpSupportDesc = 'RSVP_SUPPORT_DESC',
  SfAsc = 'SF_ASC',
  SfDesc = 'SF_DESC',
  ShowvenueAsc = 'SHOWVENUE_ASC',
  ShowvenueDesc = 'SHOWVENUE_DESC',
  StarsAsc = 'STARS_ASC',
  StarsDesc = 'STARS_DESC',
  TagsAsc = 'TAGS_ASC',
  TagsDesc = 'TAGS_DESC',
  TimezoneAsc = 'TIMEZONE_ASC',
  TimezoneDesc = 'TIMEZONE_DESC',
  TockUrlSlugAsc = 'TOCK_URL_SLUG_ASC',
  TockUrlSlugDesc = 'TOCK_URL_SLUG_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
  UrlSlugAsc = 'URL_SLUG_ASC',
  UrlSlugDesc = 'URL_SLUG_DESC',
  WithOnlineReservationAsc = 'WITH_ONLINE_RESERVATION_ASC',
  WithOnlineReservationDesc = 'WITH_ONLINE_RESERVATION_DESC',
  WorkqueueAsc = 'WORKQUEUE_ASC',
  WorkqueueDesc = 'WORKQUEUE_DESC',
  ZipAsc = 'ZIP_ASC',
  ZipDesc = 'ZIP_DESC'
}

export type BayAreaAllWithSlotsQueryVariables = Exact<{
  date: Scalars['String'];
  party_size?: Maybe<Scalars['Int']>;
  timeOption?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
}>;


export type BayAreaAllWithSlotsQuery = { __typename?: 'Query', allVenues?: Maybe<{ __typename?: 'VenuesConnection', nodes: Array<Maybe<{ __typename?: 'Venue', slots?: Maybe<Array<string>>, myReservationUrl?: Maybe<string>, name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> }>> }> };

export type BayAreaStarredWithSlotsQueryVariables = Exact<{
  date: Scalars['String'];
  party_size?: Maybe<Scalars['Int']>;
  timeOption?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
}>;


export type BayAreaStarredWithSlotsQuery = { __typename?: 'Query', allVenues?: Maybe<{ __typename?: 'VenuesConnection', totalCount: number, nodes: Array<Maybe<{ __typename?: 'Venue', slots?: Maybe<Array<string>>, myReservationUrl?: Maybe<string>, name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> }>> }> };

export type BayAreaBibWithSlotsQueryVariables = Exact<{
  date: Scalars['String'];
  party_size?: Maybe<Scalars['Int']>;
  timeOption?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
}>;


export type BayAreaBibWithSlotsQuery = { __typename?: 'Query', allVenues?: Maybe<{ __typename?: 'VenuesConnection', totalCount: number, nodes: Array<Maybe<{ __typename?: 'Venue', slots?: Maybe<Array<string>>, myReservationUrl?: Maybe<string>, name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> }>> }> };

export type BayAreaPlatesWithSlotsQueryVariables = Exact<{
  date: Scalars['String'];
  party_size?: Maybe<Scalars['Int']>;
  timeOption?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
}>;


export type BayAreaPlatesWithSlotsQuery = { __typename?: 'Query', allVenues?: Maybe<{ __typename?: 'VenuesConnection', totalCount: number, nodes: Array<Maybe<{ __typename?: 'Venue', slots?: Maybe<Array<string>>, myReservationUrl?: Maybe<string>, name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> }>> }> };

export type BayAreaNearbySlotsQueryVariables = Exact<{
  date: Scalars['String'];
  party_size?: Maybe<Scalars['Int']>;
  timeOption?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  maxLongitude: Scalars['Float'];
  minLongitude: Scalars['Float'];
  maxLatitude: Scalars['Float'];
  minLatitude: Scalars['Float'];
}>;


export type BayAreaNearbySlotsQuery = { __typename?: 'Query', allVenues?: Maybe<{ __typename?: 'VenuesConnection', totalCount: number, nodes: Array<Maybe<{ __typename?: 'Venue', slots?: Maybe<Array<string>>, myReservationUrl?: Maybe<string>, name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> }>> }> };

export type VenuAvailabilityFragment = { __typename?: 'Venue', slots?: Maybe<Array<string>>, myReservationUrl?: Maybe<string>, name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> };

export type BayAreaQueryVariables = Exact<{ [key: string]: never; }>;


export type BayAreaQuery = { __typename?: 'Query', allVenues?: Maybe<{ __typename?: 'VenuesConnection', nodes: Array<Maybe<{ __typename?: 'Venue', name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> }>> }> };

export type BayAreaOfflineQueryVariables = Exact<{ [key: string]: never; }>;


export type BayAreaOfflineQuery = { __typename?: 'Query', allVenues?: Maybe<{ __typename?: 'VenuesConnection', nodes: Array<Maybe<{ __typename?: 'Venue', name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> }>> }> };

export type VenuMainInfoFragment = { __typename?: 'Venue', name?: Maybe<string>, stars?: Maybe<string>, city?: Maybe<string>, cuisine?: Maybe<string>, priceline?: Maybe<string>, withOnlineReservation?: Maybe<string>, coverImage?: Maybe<string>, latitude?: Maybe<number>, longitude?: Maybe<number> };

export const VenuMainInfoFragmentDoc = gql`
    fragment VenuMainInfo on Venue {
  name
  stars
  city
  cuisine
  priceline
  withOnlineReservation
  coverImage
  latitude
  longitude
}
    `;
export const VenuAvailabilityFragmentDoc = gql`
    fragment VenuAvailability on Venue {
  slots(date: $date, party_size: $party_size, timeOption: $timeOption)
  myReservationUrl(date: $date, party_size: $party_size, timeOption: $timeOption)
  ...VenuMainInfo
}
    ${VenuMainInfoFragmentDoc}`;
export const BayAreaAllWithSlotsDocument = gql`
    query BayAreaAllWithSlots($date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: "bayarea", withOnlineReservation: "true"}
  ) {
    nodes {
      ...VenuAvailability
    }
  }
}
    ${VenuAvailabilityFragmentDoc}`;

/**
 * __useBayAreaAllWithSlotsQuery__
 *
 * To run a query within a React component, call `useBayAreaAllWithSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayAreaAllWithSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayAreaAllWithSlotsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      party_size: // value for 'party_size'
 *      timeOption: // value for 'timeOption'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useBayAreaAllWithSlotsQuery(baseOptions: Apollo.QueryHookOptions<BayAreaAllWithSlotsQuery, BayAreaAllWithSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayAreaAllWithSlotsQuery, BayAreaAllWithSlotsQueryVariables>(BayAreaAllWithSlotsDocument, options);
      }
export function useBayAreaAllWithSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayAreaAllWithSlotsQuery, BayAreaAllWithSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayAreaAllWithSlotsQuery, BayAreaAllWithSlotsQueryVariables>(BayAreaAllWithSlotsDocument, options);
        }
export type BayAreaAllWithSlotsQueryHookResult = ReturnType<typeof useBayAreaAllWithSlotsQuery>;
export type BayAreaAllWithSlotsLazyQueryHookResult = ReturnType<typeof useBayAreaAllWithSlotsLazyQuery>;
export type BayAreaAllWithSlotsQueryResult = Apollo.QueryResult<BayAreaAllWithSlotsQuery, BayAreaAllWithSlotsQueryVariables>;
export const BayAreaStarredWithSlotsDocument = gql`
    query BayAreaStarredWithSlots($date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: "bayarea", withOnlineReservation: "true"}
    filter: {stars: {in: ["1", "2", "3"]}}
  ) {
    totalCount
    nodes {
      ...VenuAvailability
    }
  }
}
    ${VenuAvailabilityFragmentDoc}`;

/**
 * __useBayAreaStarredWithSlotsQuery__
 *
 * To run a query within a React component, call `useBayAreaStarredWithSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayAreaStarredWithSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayAreaStarredWithSlotsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      party_size: // value for 'party_size'
 *      timeOption: // value for 'timeOption'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useBayAreaStarredWithSlotsQuery(baseOptions: Apollo.QueryHookOptions<BayAreaStarredWithSlotsQuery, BayAreaStarredWithSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayAreaStarredWithSlotsQuery, BayAreaStarredWithSlotsQueryVariables>(BayAreaStarredWithSlotsDocument, options);
      }
export function useBayAreaStarredWithSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayAreaStarredWithSlotsQuery, BayAreaStarredWithSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayAreaStarredWithSlotsQuery, BayAreaStarredWithSlotsQueryVariables>(BayAreaStarredWithSlotsDocument, options);
        }
export type BayAreaStarredWithSlotsQueryHookResult = ReturnType<typeof useBayAreaStarredWithSlotsQuery>;
export type BayAreaStarredWithSlotsLazyQueryHookResult = ReturnType<typeof useBayAreaStarredWithSlotsLazyQuery>;
export type BayAreaStarredWithSlotsQueryResult = Apollo.QueryResult<BayAreaStarredWithSlotsQuery, BayAreaStarredWithSlotsQueryVariables>;
export const BayAreaBibWithSlotsDocument = gql`
    query BayAreaBibWithSlots($date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: "bayarea", withOnlineReservation: "true"}
    filter: {stars: {in: ["BIB_GOURMAND"]}}
  ) {
    totalCount
    nodes {
      ...VenuAvailability
    }
  }
}
    ${VenuAvailabilityFragmentDoc}`;

/**
 * __useBayAreaBibWithSlotsQuery__
 *
 * To run a query within a React component, call `useBayAreaBibWithSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayAreaBibWithSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayAreaBibWithSlotsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      party_size: // value for 'party_size'
 *      timeOption: // value for 'timeOption'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useBayAreaBibWithSlotsQuery(baseOptions: Apollo.QueryHookOptions<BayAreaBibWithSlotsQuery, BayAreaBibWithSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayAreaBibWithSlotsQuery, BayAreaBibWithSlotsQueryVariables>(BayAreaBibWithSlotsDocument, options);
      }
export function useBayAreaBibWithSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayAreaBibWithSlotsQuery, BayAreaBibWithSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayAreaBibWithSlotsQuery, BayAreaBibWithSlotsQueryVariables>(BayAreaBibWithSlotsDocument, options);
        }
export type BayAreaBibWithSlotsQueryHookResult = ReturnType<typeof useBayAreaBibWithSlotsQuery>;
export type BayAreaBibWithSlotsLazyQueryHookResult = ReturnType<typeof useBayAreaBibWithSlotsLazyQuery>;
export type BayAreaBibWithSlotsQueryResult = Apollo.QueryResult<BayAreaBibWithSlotsQuery, BayAreaBibWithSlotsQueryVariables>;
export const BayAreaPlatesWithSlotsDocument = gql`
    query BayAreaPlatesWithSlots($date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: "bayarea", withOnlineReservation: "true"}
    filter: {stars: {in: ["MICHELIN_PLATE"]}}
  ) {
    totalCount
    nodes {
      ...VenuAvailability
    }
  }
}
    ${VenuAvailabilityFragmentDoc}`;

/**
 * __useBayAreaPlatesWithSlotsQuery__
 *
 * To run a query within a React component, call `useBayAreaPlatesWithSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayAreaPlatesWithSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayAreaPlatesWithSlotsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      party_size: // value for 'party_size'
 *      timeOption: // value for 'timeOption'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useBayAreaPlatesWithSlotsQuery(baseOptions: Apollo.QueryHookOptions<BayAreaPlatesWithSlotsQuery, BayAreaPlatesWithSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayAreaPlatesWithSlotsQuery, BayAreaPlatesWithSlotsQueryVariables>(BayAreaPlatesWithSlotsDocument, options);
      }
export function useBayAreaPlatesWithSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayAreaPlatesWithSlotsQuery, BayAreaPlatesWithSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayAreaPlatesWithSlotsQuery, BayAreaPlatesWithSlotsQueryVariables>(BayAreaPlatesWithSlotsDocument, options);
        }
export type BayAreaPlatesWithSlotsQueryHookResult = ReturnType<typeof useBayAreaPlatesWithSlotsQuery>;
export type BayAreaPlatesWithSlotsLazyQueryHookResult = ReturnType<typeof useBayAreaPlatesWithSlotsLazyQuery>;
export type BayAreaPlatesWithSlotsQueryResult = Apollo.QueryResult<BayAreaPlatesWithSlotsQuery, BayAreaPlatesWithSlotsQueryVariables>;
export const BayAreaNearbySlotsDocument = gql`
    query BayAreaNearbySlots($date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 100, $maxLongitude: Float!, $minLongitude: Float!, $maxLatitude: Float!, $minLatitude: Float!) {
  allVenues(
    first: $first
    filter: {longitude: {lessThan: $maxLongitude, greaterThan: $minLongitude}, latitude: {lessThan: $maxLatitude, greaterThan: $minLatitude}}
  ) {
    totalCount
    nodes {
      ...VenuAvailability
    }
  }
}
    ${VenuAvailabilityFragmentDoc}`;

/**
 * __useBayAreaNearbySlotsQuery__
 *
 * To run a query within a React component, call `useBayAreaNearbySlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayAreaNearbySlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayAreaNearbySlotsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      party_size: // value for 'party_size'
 *      timeOption: // value for 'timeOption'
 *      first: // value for 'first'
 *      maxLongitude: // value for 'maxLongitude'
 *      minLongitude: // value for 'minLongitude'
 *      maxLatitude: // value for 'maxLatitude'
 *      minLatitude: // value for 'minLatitude'
 *   },
 * });
 */
export function useBayAreaNearbySlotsQuery(baseOptions: Apollo.QueryHookOptions<BayAreaNearbySlotsQuery, BayAreaNearbySlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayAreaNearbySlotsQuery, BayAreaNearbySlotsQueryVariables>(BayAreaNearbySlotsDocument, options);
      }
export function useBayAreaNearbySlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayAreaNearbySlotsQuery, BayAreaNearbySlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayAreaNearbySlotsQuery, BayAreaNearbySlotsQueryVariables>(BayAreaNearbySlotsDocument, options);
        }
export type BayAreaNearbySlotsQueryHookResult = ReturnType<typeof useBayAreaNearbySlotsQuery>;
export type BayAreaNearbySlotsLazyQueryHookResult = ReturnType<typeof useBayAreaNearbySlotsLazyQuery>;
export type BayAreaNearbySlotsQueryResult = Apollo.QueryResult<BayAreaNearbySlotsQuery, BayAreaNearbySlotsQueryVariables>;
export const BayAreaDocument = gql`
    query BayArea {
  allVenues(condition: {metro: "bayarea", withOnlineReservation: "true"}) {
    nodes {
      ...VenuMainInfo
    }
  }
}
    ${VenuMainInfoFragmentDoc}`;

/**
 * __useBayAreaQuery__
 *
 * To run a query within a React component, call `useBayAreaQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayAreaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayAreaQuery({
 *   variables: {
 *   },
 * });
 */
export function useBayAreaQuery(baseOptions?: Apollo.QueryHookOptions<BayAreaQuery, BayAreaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayAreaQuery, BayAreaQueryVariables>(BayAreaDocument, options);
      }
export function useBayAreaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayAreaQuery, BayAreaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayAreaQuery, BayAreaQueryVariables>(BayAreaDocument, options);
        }
export type BayAreaQueryHookResult = ReturnType<typeof useBayAreaQuery>;
export type BayAreaLazyQueryHookResult = ReturnType<typeof useBayAreaLazyQuery>;
export type BayAreaQueryResult = Apollo.QueryResult<BayAreaQuery, BayAreaQueryVariables>;
export const BayAreaOfflineDocument = gql`
    query BayAreaOffline {
  allVenues(condition: {metro: "bayarea", withOnlineReservation: "false"}) {
    nodes {
      ...VenuMainInfo
    }
  }
}
    ${VenuMainInfoFragmentDoc}`;

/**
 * __useBayAreaOfflineQuery__
 *
 * To run a query within a React component, call `useBayAreaOfflineQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayAreaOfflineQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayAreaOfflineQuery({
 *   variables: {
 *   },
 * });
 */
export function useBayAreaOfflineQuery(baseOptions?: Apollo.QueryHookOptions<BayAreaOfflineQuery, BayAreaOfflineQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayAreaOfflineQuery, BayAreaOfflineQueryVariables>(BayAreaOfflineDocument, options);
      }
export function useBayAreaOfflineLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayAreaOfflineQuery, BayAreaOfflineQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayAreaOfflineQuery, BayAreaOfflineQueryVariables>(BayAreaOfflineDocument, options);
        }
export type BayAreaOfflineQueryHookResult = ReturnType<typeof useBayAreaOfflineQuery>;
export type BayAreaOfflineLazyQueryHookResult = ReturnType<typeof useBayAreaOfflineLazyQuery>;
export type BayAreaOfflineQueryResult = Apollo.QueryResult<BayAreaOfflineQuery, BayAreaOfflineQueryVariables>;