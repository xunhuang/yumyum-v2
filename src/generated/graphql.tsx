import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** All input for the create `Venue` mutation. */
export type CreateVenueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
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
  orderBy?: InputMaybe<Array<VenuesOrderBy>>;
};

export type DateAvailability = {
  __typename?: 'DateAvailability';
  date?: Maybe<Scalars['String']>;
  slots?: Maybe<Array<Maybe<Scalars['String']>>>;
  url?: Maybe<Scalars['String']>;
};

/** All input for the `deleteVenueByKey` mutation. */
export type DeleteVenueByKeyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  key: Scalars['String'];
};

/** All input for the `deleteVenue` mutation. */
export type DeleteVenueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Venue` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Venue` mutation. */
export type DeleteVenuePayload = {
  __typename?: 'DeleteVenuePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedVenueId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Venue` that was deleted by this mutation. */
  venue?: Maybe<Venue>;
  /** An edge for our `Venue`. May be used by Relay 1. */
  venueEdge?: Maybe<VenuesEdge>;
};


/** The output of our delete `Venue` mutation. */
export type DeleteVenuePayloadVenueEdgeArgs = {
  orderBy?: InputMaybe<Array<VenuesOrderBy>>;
};

/** A filter to be used against Float fields. All fields are combined with a logical ‘and.’ */
export type FloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Float']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Float']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Float']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Float']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Float']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Float']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Float']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Float']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Float']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Float']>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Venue`. */
  createVenue?: Maybe<CreateVenuePayload>;
  /** Deletes a single `Venue` using its globally unique id. */
  deleteVenue?: Maybe<DeleteVenuePayload>;
  /** Deletes a single `Venue` using a unique key. */
  deleteVenueByKey?: Maybe<DeleteVenuePayload>;
  /** Updates a single `Venue` using its globally unique id and a patch. */
  updateVenue?: Maybe<UpdateVenuePayload>;
  /** Updates a single `Venue` using a unique key and a patch. */
  updateVenueByKey?: Maybe<UpdateVenuePayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateVenueArgs = {
  input: CreateVenueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteVenueArgs = {
  input: DeleteVenueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteVenueByKeyArgs = {
  input: DeleteVenueByKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVenueArgs = {
  input: UpdateVenueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVenueByKeyArgs = {
  input: UpdateVenueByKeyInput;
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
  reservationInfo?: Maybe<ReservationInfo>;
  /** Reads a single `Venue` using its globally unique `ID`. */
  venue?: Maybe<Venue>;
  venueByKey?: Maybe<Venue>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllVenuesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<VenueCondition>;
  filter?: InputMaybe<VenueFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<VenuesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReservationInfoArgs = {
  url: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVenueArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVenueByKeyArgs = {
  key: Scalars['String'];
};

export type ReservationInfo = {
  __typename?: 'ReservationInfo';
  businessid?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  reservation?: Maybe<Scalars['String']>;
  resyCityCode?: Maybe<Scalars['String']>;
  urlSlug?: Maybe<Scalars['String']>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']>;
};

/** All input for the `updateVenueByKey` mutation. */
export type UpdateVenueByKeyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  key: Scalars['String'];
  /** An object where the defined keys will be set on the `Venue` being updated. */
  venuePatch: VenuePatch;
};

/** All input for the `updateVenue` mutation. */
export type UpdateVenueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Venue` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Venue` being updated. */
  venuePatch: VenuePatch;
};

/** The output of our update `Venue` mutation. */
export type UpdateVenuePayload = {
  __typename?: 'UpdateVenuePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Venue` that was updated by this mutation. */
  venue?: Maybe<Venue>;
  /** An edge for our `Venue`. May be used by Relay 1. */
  venueEdge?: Maybe<VenuesEdge>;
};


/** The output of our update `Venue` mutation. */
export type UpdateVenuePayloadVenueEdgeArgs = {
  orderBy?: InputMaybe<Array<VenuesOrderBy>>;
};

export type Venue = Node & {
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
  key: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  localarea?: Maybe<Scalars['String']>;
  localname?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['Float']>;
  menuurl?: Maybe<Scalars['String']>;
  metro?: Maybe<Scalars['String']>;
  michelinId?: Maybe<Scalars['String']>;
  michelineOnlineReservation?: Maybe<Scalars['Boolean']>;
  michelinobjectid?: Maybe<Scalars['String']>;
  michelinslug?: Maybe<Scalars['String']>;
  monthlySlots?: Maybe<Array<DateAvailability>>;
  myReservationUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
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
  streetUsps?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  tockUrlSlug?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  urlSlug?: Maybe<Scalars['String']>;
  vintage?: Maybe<Scalars['String']>;
  withOnlineReservation?: Maybe<Scalars['String']>;
  workqueue?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};


export type VenueMonthlySlotsArgs = {
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
};


export type VenueMyReservationUrlArgs = {
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
};


export type VenueSlotsArgs = {
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
};

/** A condition to be used against `Venue` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type VenueCondition = {
  /** Checks for equality with the object’s `accomondation` field. */
  accomondation?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `address` field. */
  address?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `area` field. */
  area?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `autodetected` field. */
  autodetected?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `bookatableClientid` field. */
  bookatableClientid?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `bookatablePartnerCode` field. */
  bookatablePartnerCode?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `bookingnotes` field. */
  bookingnotes?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `businessId` field. */
  businessId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `businessid` field. */
  businessid?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `city` field. */
  city?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `close` field. */
  close?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `closehours` field. */
  closehours?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `connectionid` field. */
  connectionid?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `country` field. */
  country?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `countryIso` field. */
  countryIso?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `coverImage` field. */
  coverImage?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `creationTime` field. */
  creationTime?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `cuisine` field. */
  cuisine?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `currency` field. */
  currency?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `devnotes` field. */
  devnotes?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `distinction` field. */
  distinction?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `fulladdress` field. */
  fulladdress?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `guide` field. */
  guide?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `imageList` field. */
  imageList?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `key` field. */
  key?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `latitude` field. */
  latitude?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `localarea` field. */
  localarea?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `localname` field. */
  localname?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `longitude` field. */
  longitude?: InputMaybe<Scalars['Float']>;
  /** Checks for equality with the object’s `menuurl` field. */
  menuurl?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `metro` field. */
  metro?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `michelinId` field. */
  michelinId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `michelineOnlineReservation` field. */
  michelineOnlineReservation?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `michelinobjectid` field. */
  michelinobjectid?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `michelinslug` field. */
  michelinslug?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `oldImages` field. */
  oldImages?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `openhours` field. */
  openhours?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `otherReservation` field. */
  otherReservation?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `phone` field. */
  phone?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `priceline` field. */
  priceline?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `realurl` field. */
  realurl?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `region` field. */
  region?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `reservation` field. */
  reservation?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `reservationHint` field. */
  reservationHint?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `reservationUrl` field. */
  reservationUrl?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `resyCityCode` field. */
  resyCityCode?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `resyUrlSlug` field. */
  resyUrlSlug?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `rsvpSupport` field. */
  rsvpSupport?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `sf` field. */
  sf?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `showvenue` field. */
  showvenue?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `stars` field. */
  stars?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `streetUsps` field. */
  streetUsps?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `tags` field. */
  tags?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `timezone` field. */
  timezone?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `tockUrlSlug` field. */
  tockUrlSlug?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `url` field. */
  url?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `urlSlug` field. */
  urlSlug?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `vintage` field. */
  vintage?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `withOnlineReservation` field. */
  withOnlineReservation?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `workqueue` field. */
  workqueue?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `zip` field. */
  zip?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `Venue` object types. All fields are combined with a logical ‘and.’ */
export type VenueFilter = {
  /** Filter by the object’s `accomondation` field. */
  accomondation?: InputMaybe<StringFilter>;
  /** Filter by the object’s `address` field. */
  address?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<VenueFilter>>;
  /** Filter by the object’s `area` field. */
  area?: InputMaybe<StringFilter>;
  /** Filter by the object’s `autodetected` field. */
  autodetected?: InputMaybe<StringFilter>;
  /** Filter by the object’s `bookatableClientid` field. */
  bookatableClientid?: InputMaybe<StringFilter>;
  /** Filter by the object’s `bookatablePartnerCode` field. */
  bookatablePartnerCode?: InputMaybe<StringFilter>;
  /** Filter by the object’s `bookingnotes` field. */
  bookingnotes?: InputMaybe<StringFilter>;
  /** Filter by the object’s `businessId` field. */
  businessId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `businessid` field. */
  businessid?: InputMaybe<StringFilter>;
  /** Filter by the object’s `city` field. */
  city?: InputMaybe<StringFilter>;
  /** Filter by the object’s `close` field. */
  close?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `closehours` field. */
  closehours?: InputMaybe<StringFilter>;
  /** Filter by the object’s `connectionid` field. */
  connectionid?: InputMaybe<StringFilter>;
  /** Filter by the object’s `country` field. */
  country?: InputMaybe<StringFilter>;
  /** Filter by the object’s `countryIso` field. */
  countryIso?: InputMaybe<StringFilter>;
  /** Filter by the object’s `coverImage` field. */
  coverImage?: InputMaybe<StringFilter>;
  /** Filter by the object’s `creationTime` field. */
  creationTime?: InputMaybe<StringFilter>;
  /** Filter by the object’s `cuisine` field. */
  cuisine?: InputMaybe<StringFilter>;
  /** Filter by the object’s `currency` field. */
  currency?: InputMaybe<StringFilter>;
  /** Filter by the object’s `devnotes` field. */
  devnotes?: InputMaybe<StringFilter>;
  /** Filter by the object’s `distinction` field. */
  distinction?: InputMaybe<StringFilter>;
  /** Filter by the object’s `email` field. */
  email?: InputMaybe<StringFilter>;
  /** Filter by the object’s `fulladdress` field. */
  fulladdress?: InputMaybe<StringFilter>;
  /** Filter by the object’s `guide` field. */
  guide?: InputMaybe<StringFilter>;
  /** Filter by the object’s `imageList` field. */
  imageList?: InputMaybe<StringFilter>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Filter by the object’s `latitude` field. */
  latitude?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `localarea` field. */
  localarea?: InputMaybe<StringFilter>;
  /** Filter by the object’s `localname` field. */
  localname?: InputMaybe<StringFilter>;
  /** Filter by the object’s `longitude` field. */
  longitude?: InputMaybe<FloatFilter>;
  /** Filter by the object’s `menuurl` field. */
  menuurl?: InputMaybe<StringFilter>;
  /** Filter by the object’s `metro` field. */
  metro?: InputMaybe<StringFilter>;
  /** Filter by the object’s `michelinId` field. */
  michelinId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `michelineOnlineReservation` field. */
  michelineOnlineReservation?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `michelinobjectid` field. */
  michelinobjectid?: InputMaybe<StringFilter>;
  /** Filter by the object’s `michelinslug` field. */
  michelinslug?: InputMaybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<VenueFilter>;
  /** Filter by the object’s `oldImages` field. */
  oldImages?: InputMaybe<StringFilter>;
  /** Filter by the object’s `openhours` field. */
  openhours?: InputMaybe<StringFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<VenueFilter>>;
  /** Filter by the object’s `otherReservation` field. */
  otherReservation?: InputMaybe<StringFilter>;
  /** Filter by the object’s `phone` field. */
  phone?: InputMaybe<StringFilter>;
  /** Filter by the object’s `priceline` field. */
  priceline?: InputMaybe<StringFilter>;
  /** Filter by the object’s `realurl` field. */
  realurl?: InputMaybe<StringFilter>;
  /** Filter by the object’s `region` field. */
  region?: InputMaybe<StringFilter>;
  /** Filter by the object’s `reservation` field. */
  reservation?: InputMaybe<StringFilter>;
  /** Filter by the object’s `reservationHint` field. */
  reservationHint?: InputMaybe<StringFilter>;
  /** Filter by the object’s `reservationUrl` field. */
  reservationUrl?: InputMaybe<StringFilter>;
  /** Filter by the object’s `resyCityCode` field. */
  resyCityCode?: InputMaybe<StringFilter>;
  /** Filter by the object’s `resyUrlSlug` field. */
  resyUrlSlug?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rsvpSupport` field. */
  rsvpSupport?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sf` field. */
  sf?: InputMaybe<StringFilter>;
  /** Filter by the object’s `showvenue` field. */
  showvenue?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `stars` field. */
  stars?: InputMaybe<StringFilter>;
  /** Filter by the object’s `streetUsps` field. */
  streetUsps?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tags` field. */
  tags?: InputMaybe<StringFilter>;
  /** Filter by the object’s `timezone` field. */
  timezone?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tockUrlSlug` field. */
  tockUrlSlug?: InputMaybe<StringFilter>;
  /** Filter by the object’s `url` field. */
  url?: InputMaybe<StringFilter>;
  /** Filter by the object’s `urlSlug` field. */
  urlSlug?: InputMaybe<StringFilter>;
  /** Filter by the object’s `vintage` field. */
  vintage?: InputMaybe<StringFilter>;
  /** Filter by the object’s `withOnlineReservation` field. */
  withOnlineReservation?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workqueue` field. */
  workqueue?: InputMaybe<StringFilter>;
  /** Filter by the object’s `zip` field. */
  zip?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Venue` */
export type VenueInput = {
  accomondation?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  area?: InputMaybe<Scalars['String']>;
  autodetected?: InputMaybe<Scalars['String']>;
  bookatableClientid?: InputMaybe<Scalars['String']>;
  bookatablePartnerCode?: InputMaybe<Scalars['String']>;
  bookingnotes?: InputMaybe<Scalars['String']>;
  businessId?: InputMaybe<Scalars['String']>;
  businessid?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['Boolean']>;
  closehours?: InputMaybe<Scalars['String']>;
  connectionid?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  countryIso?: InputMaybe<Scalars['String']>;
  coverImage?: InputMaybe<Scalars['String']>;
  creationTime?: InputMaybe<Scalars['String']>;
  cuisine?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  devnotes?: InputMaybe<Scalars['String']>;
  distinction?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  fulladdress?: InputMaybe<Scalars['String']>;
  guide?: InputMaybe<Scalars['String']>;
  imageList?: InputMaybe<Scalars['String']>;
  key: Scalars['String'];
  latitude?: InputMaybe<Scalars['Float']>;
  localarea?: InputMaybe<Scalars['String']>;
  localname?: InputMaybe<Scalars['String']>;
  longitude?: InputMaybe<Scalars['Float']>;
  menuurl?: InputMaybe<Scalars['String']>;
  metro?: InputMaybe<Scalars['String']>;
  michelinId?: InputMaybe<Scalars['String']>;
  michelineOnlineReservation?: InputMaybe<Scalars['Boolean']>;
  michelinobjectid?: InputMaybe<Scalars['String']>;
  michelinslug?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  oldImages?: InputMaybe<Scalars['String']>;
  openhours?: InputMaybe<Scalars['String']>;
  otherReservation?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  priceline?: InputMaybe<Scalars['String']>;
  realurl?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  reservation?: InputMaybe<Scalars['String']>;
  reservationHint?: InputMaybe<Scalars['String']>;
  reservationUrl?: InputMaybe<Scalars['String']>;
  resyCityCode?: InputMaybe<Scalars['String']>;
  resyUrlSlug?: InputMaybe<Scalars['String']>;
  rsvpSupport?: InputMaybe<Scalars['String']>;
  sf?: InputMaybe<Scalars['String']>;
  showvenue?: InputMaybe<Scalars['Boolean']>;
  stars?: InputMaybe<Scalars['String']>;
  streetUsps?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  tockUrlSlug?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  urlSlug?: InputMaybe<Scalars['String']>;
  vintage?: InputMaybe<Scalars['String']>;
  withOnlineReservation?: InputMaybe<Scalars['String']>;
  workqueue?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};

/** Represents an update to a `Venue`. Fields that are set will be updated. */
export type VenuePatch = {
  accomondation?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  area?: InputMaybe<Scalars['String']>;
  autodetected?: InputMaybe<Scalars['String']>;
  bookatableClientid?: InputMaybe<Scalars['String']>;
  bookatablePartnerCode?: InputMaybe<Scalars['String']>;
  bookingnotes?: InputMaybe<Scalars['String']>;
  businessId?: InputMaybe<Scalars['String']>;
  businessid?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['Boolean']>;
  closehours?: InputMaybe<Scalars['String']>;
  connectionid?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  countryIso?: InputMaybe<Scalars['String']>;
  coverImage?: InputMaybe<Scalars['String']>;
  creationTime?: InputMaybe<Scalars['String']>;
  cuisine?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  devnotes?: InputMaybe<Scalars['String']>;
  distinction?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  fulladdress?: InputMaybe<Scalars['String']>;
  guide?: InputMaybe<Scalars['String']>;
  imageList?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  latitude?: InputMaybe<Scalars['Float']>;
  localarea?: InputMaybe<Scalars['String']>;
  localname?: InputMaybe<Scalars['String']>;
  longitude?: InputMaybe<Scalars['Float']>;
  menuurl?: InputMaybe<Scalars['String']>;
  metro?: InputMaybe<Scalars['String']>;
  michelinId?: InputMaybe<Scalars['String']>;
  michelineOnlineReservation?: InputMaybe<Scalars['Boolean']>;
  michelinobjectid?: InputMaybe<Scalars['String']>;
  michelinslug?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  oldImages?: InputMaybe<Scalars['String']>;
  openhours?: InputMaybe<Scalars['String']>;
  otherReservation?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  priceline?: InputMaybe<Scalars['String']>;
  realurl?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  reservation?: InputMaybe<Scalars['String']>;
  reservationHint?: InputMaybe<Scalars['String']>;
  reservationUrl?: InputMaybe<Scalars['String']>;
  resyCityCode?: InputMaybe<Scalars['String']>;
  resyUrlSlug?: InputMaybe<Scalars['String']>;
  rsvpSupport?: InputMaybe<Scalars['String']>;
  sf?: InputMaybe<Scalars['String']>;
  showvenue?: InputMaybe<Scalars['Boolean']>;
  stars?: InputMaybe<Scalars['String']>;
  streetUsps?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  tockUrlSlug?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  urlSlug?: InputMaybe<Scalars['String']>;
  vintage?: InputMaybe<Scalars['String']>;
  withOnlineReservation?: InputMaybe<Scalars['String']>;
  workqueue?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
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
  MichelinobjectidAsc = 'MICHELINOBJECTID_ASC',
  MichelinobjectidDesc = 'MICHELINOBJECTID_DESC',
  MichelinslugAsc = 'MICHELINSLUG_ASC',
  MichelinslugDesc = 'MICHELINSLUG_DESC',
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
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
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
  StreetUspsAsc = 'STREET_USPS_ASC',
  StreetUspsDesc = 'STREET_USPS_DESC',
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
  VintageAsc = 'VINTAGE_ASC',
  VintageDesc = 'VINTAGE_DESC',
  WithOnlineReservationAsc = 'WITH_ONLINE_RESERVATION_ASC',
  WithOnlineReservationDesc = 'WITH_ONLINE_RESERVATION_DESC',
  WorkqueueAsc = 'WORKQUEUE_ASC',
  WorkqueueDesc = 'WORKQUEUE_DESC',
  ZipAsc = 'ZIP_ASC',
  ZipDesc = 'ZIP_DESC'
}

export type BayAreaAllWithSlotsQueryVariables = Exact<{
  metro: Scalars['String'];
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type BayAreaAllWithSlotsQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', nodes: Array<{ __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type BayAreaStarredWithSlotsQueryVariables = Exact<{
  metro: Scalars['String'];
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type BayAreaStarredWithSlotsQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', totalCount: number, nodes: Array<{ __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type BayArea2021WithSlotsQueryVariables = Exact<{
  metro: Scalars['String'];
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type BayArea2021WithSlotsQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', totalCount: number, nodes: Array<{ __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type BayAreaBibWithSlotsQueryVariables = Exact<{
  metro: Scalars['String'];
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type BayAreaBibWithSlotsQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', totalCount: number, nodes: Array<{ __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type BayAreaLegacyWithSlotsQueryVariables = Exact<{
  metro: Scalars['String'];
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type BayAreaLegacyWithSlotsQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', totalCount: number, nodes: Array<{ __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type BayAreaPlatesWithSlotsQueryVariables = Exact<{
  metro: Scalars['String'];
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
}>;


export type BayAreaPlatesWithSlotsQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', totalCount: number, nodes: Array<{ __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type BayAreaNearbySlotsQueryVariables = Exact<{
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  maxLongitude: Scalars['Float'];
  minLongitude: Scalars['Float'];
  maxLatitude: Scalars['Float'];
  minLatitude: Scalars['Float'];
}>;


export type BayAreaNearbySlotsQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', totalCount: number, nodes: Array<{ __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type VenuAvailabilityFragment = { __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null };

export type BayAreaQueryVariables = Exact<{
  metro: Scalars['String'];
}>;


export type BayAreaQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', nodes: Array<{ __typename?: 'Venue', nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type BayAreaOfflineQueryVariables = Exact<{
  metro: Scalars['String'];
}>;


export type BayAreaOfflineQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', nodes: Array<{ __typename?: 'Venue', nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type MetroTbdQueryVariables = Exact<{
  metro: Scalars['String'];
}>;


export type MetroTbdQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', nodes: Array<{ __typename?: 'Venue', nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null } | null> } | null };

export type VenuMainInfoFragment = { __typename?: 'Venue', nodeId: string, name?: string | null, stars?: string | null, city?: string | null, cuisine?: string | null, priceline?: string | null, withOnlineReservation?: string | null, coverImage?: string | null, latitude?: number | null, longitude?: number | null, timezone?: string | null, michelinslug?: string | null, address?: string | null, reservation?: string | null, key: string, vintage?: string | null };

export type CreateVenueMutationVariables = Exact<{
  name: Scalars['String'];
  key: Scalars['String'];
  vintage: Scalars['String'];
  close: Scalars['Boolean'];
  metro: Scalars['String'];
  michelinslug: Scalars['String'];
  michelinobjectid: Scalars['String'];
  address: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  coverImage: Scalars['String'];
  cuisine: Scalars['String'];
  imageList: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  michelineOnlineReservation: Scalars['Boolean'];
  region: Scalars['String'];
  reservation: Scalars['String'];
  stars: Scalars['String'];
  timezone: Scalars['String'];
  url: Scalars['String'];
  zip: Scalars['String'];
}>;


export type CreateVenueMutation = { __typename?: 'Mutation', createVenue?: { __typename?: 'CreateVenuePayload', venue?: { __typename?: 'Venue', key: string, name?: string | null } | null } | null };

export type LookupReservationInfoQueryVariables = Exact<{
  url: Scalars['String'];
}>;


export type LookupReservationInfoQuery = { __typename?: 'Query', reservationInfo?: { __typename?: 'ReservationInfo', businessid?: string | null, urlSlug?: string | null, resyCityCode?: string | null, latitude?: number | null, longitude?: number | null, reservation?: string | null } | null };

export type MetroReservationQueryVariables = Exact<{
  metro: Scalars['String'];
  reservation: Scalars['String'];
}>;


export type MetroReservationQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', totalCount: number, nodes: Array<{ __typename?: 'Venue', key: string, name?: string | null, longitude?: number | null, latitude?: number | null, address?: string | null, city?: string | null, region?: string | null, businessid?: string | null, reservation?: string | null } | null> } | null };

export type RepopulateVenueInfoMutationVariables = Exact<{
  key: Scalars['String'];
  name: Scalars['String'];
  michelinslug: Scalars['String'];
  michelinobjectid: Scalars['String'];
  coverImage: Scalars['String'];
  cuisine: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  stars: Scalars['String'];
  url: Scalars['String'];
}>;


export type RepopulateVenueInfoMutation = { __typename?: 'Mutation', updateVenueByKey?: { __typename?: 'UpdateVenuePayload', clientMutationId?: string | null, venue?: { __typename?: 'Venue', key: string, name?: string | null, michelinslug?: string | null, michelinobjectid?: string | null, coverImage?: string | null, cuisine?: string | null, imageList?: string | null, latitude?: number | null, longitude?: number | null, stars?: string | null, url?: string | null } | null } | null };

export type UpdateVenueInfoMutationVariables = Exact<{
  key: Scalars['String'];
  businessid?: InputMaybe<Scalars['String']>;
  reservation?: InputMaybe<Scalars['String']>;
  resyCityCode?: InputMaybe<Scalars['String']>;
  urlSlug?: InputMaybe<Scalars['String']>;
  close: Scalars['Boolean'];
  withOnlineReservation: Scalars['String'];
}>;


export type UpdateVenueInfoMutation = { __typename?: 'Mutation', updateVenueByKey?: { __typename?: 'UpdateVenuePayload', clientMutationId?: string | null, venue?: { __typename?: 'Venue', close?: boolean | null } | null } | null };

export type UsaReservationTbdQueryVariables = Exact<{ [key: string]: never; }>;


export type UsaReservationTbdQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', totalCount: number, nodes: Array<{ __typename?: 'Venue', name?: string | null, region?: string | null, city?: string | null, longitude?: number | null, latitude?: number | null, address?: string | null, metro?: string | null, key: string } | null> } | null };

export type VenueByKeyWithSlotsQueryVariables = Exact<{
  key: Scalars['String'];
  date: Scalars['String'];
  party_size?: InputMaybe<Scalars['Int']>;
  timeOption?: InputMaybe<Scalars['String']>;
}>;


export type VenueByKeyWithSlotsQuery = { __typename?: 'Query', allVenues?: { __typename?: 'VenuesConnection', nodes: Array<{ __typename?: 'Venue', slots?: Array<string> | null, myReservationUrl?: string | null, nodeId: string, vintage?: string | null, accomondation?: string | null, address?: string | null, area?: string | null, autodetected?: string | null, bookatableClientid?: string | null, bookatablePartnerCode?: string | null, bookingnotes?: string | null, businessId?: string | null, businessid?: string | null, city?: string | null, close?: boolean | null, closehours?: string | null, connectionid?: string | null, country?: string | null, countryIso?: string | null, coverImage?: string | null, creationTime?: string | null, cuisine?: string | null, currency?: string | null, devnotes?: string | null, distinction?: string | null, email?: string | null, fulladdress?: string | null, guide?: string | null, imageList?: string | null, key: string, latitude?: number | null, localarea?: string | null, localname?: string | null, longitude?: number | null, menuurl?: string | null, metro?: string | null, michelinId?: string | null, michelineOnlineReservation?: boolean | null, name?: string | null, oldImages?: string | null, openhours?: string | null, otherReservation?: string | null, phone?: string | null, priceline?: string | null, realurl?: string | null, region?: string | null, reservation?: string | null, reservationHint?: string | null, reservationUrl?: string | null, resyCityCode?: string | null, resyUrlSlug?: string | null, rsvpSupport?: string | null, sf?: string | null, showvenue?: boolean | null, stars?: string | null, tags?: string | null, timezone?: string | null, tockUrlSlug?: string | null, url?: string | null, urlSlug?: string | null, withOnlineReservation?: string | null, workqueue?: string | null, zip?: string | null, monthlySlots?: Array<{ __typename?: 'DateAvailability', date?: string | null, slots?: Array<string | null> | null, url?: string | null }> | null } | null> } | null };

export type VenueByKeyQueryVariables = Exact<{
  key: Scalars['String'];
}>;


export type VenueByKeyQuery = { __typename?: 'Query', venueByKey?: { __typename?: 'Venue', nodeId: string, vintage?: string | null, accomondation?: string | null, address?: string | null, area?: string | null, autodetected?: string | null, bookatableClientid?: string | null, bookatablePartnerCode?: string | null, bookingnotes?: string | null, businessId?: string | null, businessid?: string | null, city?: string | null, close?: boolean | null, closehours?: string | null, connectionid?: string | null, country?: string | null, countryIso?: string | null, coverImage?: string | null, creationTime?: string | null, cuisine?: string | null, currency?: string | null, devnotes?: string | null, distinction?: string | null, email?: string | null, fulladdress?: string | null, guide?: string | null, imageList?: string | null, key: string, latitude?: number | null, localarea?: string | null, localname?: string | null, longitude?: number | null, menuurl?: string | null, metro?: string | null, michelinId?: string | null, michelineOnlineReservation?: boolean | null, name?: string | null, oldImages?: string | null, openhours?: string | null, otherReservation?: string | null, phone?: string | null, priceline?: string | null, realurl?: string | null, region?: string | null, reservation?: string | null, reservationHint?: string | null, reservationUrl?: string | null, resyCityCode?: string | null, resyUrlSlug?: string | null, rsvpSupport?: string | null, sf?: string | null, showvenue?: boolean | null, stars?: string | null, tags?: string | null, timezone?: string | null, tockUrlSlug?: string | null, url?: string | null, urlSlug?: string | null, withOnlineReservation?: string | null, workqueue?: string | null, zip?: string | null } | null };

export type VenueAllOtherFieldsFragment = { __typename?: 'Venue', nodeId: string, vintage?: string | null, accomondation?: string | null, address?: string | null, area?: string | null, autodetected?: string | null, bookatableClientid?: string | null, bookatablePartnerCode?: string | null, bookingnotes?: string | null, businessId?: string | null, businessid?: string | null, city?: string | null, close?: boolean | null, closehours?: string | null, connectionid?: string | null, country?: string | null, countryIso?: string | null, coverImage?: string | null, creationTime?: string | null, cuisine?: string | null, currency?: string | null, devnotes?: string | null, distinction?: string | null, email?: string | null, fulladdress?: string | null, guide?: string | null, imageList?: string | null, key: string, latitude?: number | null, localarea?: string | null, localname?: string | null, longitude?: number | null, menuurl?: string | null, metro?: string | null, michelinId?: string | null, michelineOnlineReservation?: boolean | null, name?: string | null, oldImages?: string | null, openhours?: string | null, otherReservation?: string | null, phone?: string | null, priceline?: string | null, realurl?: string | null, region?: string | null, reservation?: string | null, reservationHint?: string | null, reservationUrl?: string | null, resyCityCode?: string | null, resyUrlSlug?: string | null, rsvpSupport?: string | null, sf?: string | null, showvenue?: boolean | null, stars?: string | null, tags?: string | null, timezone?: string | null, tockUrlSlug?: string | null, url?: string | null, urlSlug?: string | null, withOnlineReservation?: string | null, workqueue?: string | null, zip?: string | null };

export const VenuMainInfoFragmentDoc = gql`
    fragment VenuMainInfo on Venue {
  nodeId
  name
  stars
  city
  cuisine
  priceline
  withOnlineReservation
  coverImage
  latitude
  longitude
  timezone
  michelinslug
  address
  reservation
  key
  vintage
}
    `;
export const VenuAvailabilityFragmentDoc = gql`
    fragment VenuAvailability on Venue {
  slots(date: $date, party_size: $party_size, timeOption: $timeOption)
  myReservationUrl(date: $date, party_size: $party_size, timeOption: $timeOption)
  ...VenuMainInfo
}
    ${VenuMainInfoFragmentDoc}`;
export const VenueAllOtherFieldsFragmentDoc = gql`
    fragment VenueAllOtherFields on Venue {
  nodeId
  vintage
  accomondation
  address
  area
  autodetected
  bookatableClientid
  bookatablePartnerCode
  bookingnotes
  businessId
  businessid
  city
  close
  closehours
  connectionid
  country
  countryIso
  coverImage
  creationTime
  cuisine
  currency
  devnotes
  distinction
  email
  fulladdress
  guide
  imageList
  key
  latitude
  localarea
  localname
  longitude
  menuurl
  metro
  michelinId
  michelineOnlineReservation
  name
  oldImages
  openhours
  otherReservation
  phone
  priceline
  realurl
  region
  reservation
  reservationHint
  reservationUrl
  resyCityCode
  resyUrlSlug
  rsvpSupport
  sf
  showvenue
  stars
  tags
  timezone
  tockUrlSlug
  url
  urlSlug
  withOnlineReservation
  workqueue
  zip
}
    `;
export const BayAreaAllWithSlotsDocument = gql`
    query BayAreaAllWithSlots($metro: String!, $date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: $metro, withOnlineReservation: "true", close: false}
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
 *      metro: // value for 'metro'
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
    query BayAreaStarredWithSlots($metro: String!, $date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: $metro, withOnlineReservation: "true"}
    filter: {stars: {in: ["1", "2", "3", "ONE_STAR", "TWO_STARS", "THREE_STARS"]}}
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
 *      metro: // value for 'metro'
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
export const BayArea2021WithSlotsDocument = gql`
    query BayArea2021WithSlots($metro: String!, $date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: $metro, withOnlineReservation: "true"}
    filter: {vintage: {in: ["2022", "2023", "2024", "2025", "2026"]}}
  ) {
    totalCount
    nodes {
      ...VenuAvailability
    }
  }
}
    ${VenuAvailabilityFragmentDoc}`;

/**
 * __useBayArea2021WithSlotsQuery__
 *
 * To run a query within a React component, call `useBayArea2021WithSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayArea2021WithSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayArea2021WithSlotsQuery({
 *   variables: {
 *      metro: // value for 'metro'
 *      date: // value for 'date'
 *      party_size: // value for 'party_size'
 *      timeOption: // value for 'timeOption'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useBayArea2021WithSlotsQuery(baseOptions: Apollo.QueryHookOptions<BayArea2021WithSlotsQuery, BayArea2021WithSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayArea2021WithSlotsQuery, BayArea2021WithSlotsQueryVariables>(BayArea2021WithSlotsDocument, options);
      }
export function useBayArea2021WithSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayArea2021WithSlotsQuery, BayArea2021WithSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayArea2021WithSlotsQuery, BayArea2021WithSlotsQueryVariables>(BayArea2021WithSlotsDocument, options);
        }
export type BayArea2021WithSlotsQueryHookResult = ReturnType<typeof useBayArea2021WithSlotsQuery>;
export type BayArea2021WithSlotsLazyQueryHookResult = ReturnType<typeof useBayArea2021WithSlotsLazyQuery>;
export type BayArea2021WithSlotsQueryResult = Apollo.QueryResult<BayArea2021WithSlotsQuery, BayArea2021WithSlotsQueryVariables>;
export const BayAreaBibWithSlotsDocument = gql`
    query BayAreaBibWithSlots($metro: String!, $date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: $metro, withOnlineReservation: "true", close: false}
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
 *      metro: // value for 'metro'
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
export const BayAreaLegacyWithSlotsDocument = gql`
    query BayAreaLegacyWithSlots($metro: String!, $date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: $metro, withOnlineReservation: "true", close: false}
    filter: {stars: {in: ["MICHELIN_FORMER"]}}
  ) {
    totalCount
    nodes {
      ...VenuAvailability
    }
  }
}
    ${VenuAvailabilityFragmentDoc}`;

/**
 * __useBayAreaLegacyWithSlotsQuery__
 *
 * To run a query within a React component, call `useBayAreaLegacyWithSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBayAreaLegacyWithSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBayAreaLegacyWithSlotsQuery({
 *   variables: {
 *      metro: // value for 'metro'
 *      date: // value for 'date'
 *      party_size: // value for 'party_size'
 *      timeOption: // value for 'timeOption'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useBayAreaLegacyWithSlotsQuery(baseOptions: Apollo.QueryHookOptions<BayAreaLegacyWithSlotsQuery, BayAreaLegacyWithSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BayAreaLegacyWithSlotsQuery, BayAreaLegacyWithSlotsQueryVariables>(BayAreaLegacyWithSlotsDocument, options);
      }
export function useBayAreaLegacyWithSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BayAreaLegacyWithSlotsQuery, BayAreaLegacyWithSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BayAreaLegacyWithSlotsQuery, BayAreaLegacyWithSlotsQueryVariables>(BayAreaLegacyWithSlotsDocument, options);
        }
export type BayAreaLegacyWithSlotsQueryHookResult = ReturnType<typeof useBayAreaLegacyWithSlotsQuery>;
export type BayAreaLegacyWithSlotsLazyQueryHookResult = ReturnType<typeof useBayAreaLegacyWithSlotsLazyQuery>;
export type BayAreaLegacyWithSlotsQueryResult = Apollo.QueryResult<BayAreaLegacyWithSlotsQuery, BayAreaLegacyWithSlotsQueryVariables>;
export const BayAreaPlatesWithSlotsDocument = gql`
    query BayAreaPlatesWithSlots($metro: String!, $date: String!, $party_size: Int = 2, $timeOption: String = "dinner", $first: Int = 1000) {
  allVenues(
    first: $first
    condition: {metro: $metro, withOnlineReservation: "true"}
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
 *      metro: // value for 'metro'
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
    query BayArea($metro: String!) {
  allVenues(condition: {metro: $metro, close: false}) {
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
 *      metro: // value for 'metro'
 *   },
 * });
 */
export function useBayAreaQuery(baseOptions: Apollo.QueryHookOptions<BayAreaQuery, BayAreaQueryVariables>) {
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
    query BayAreaOffline($metro: String!) {
  allVenues(condition: {metro: $metro, withOnlineReservation: "false"}) {
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
 *      metro: // value for 'metro'
 *   },
 * });
 */
export function useBayAreaOfflineQuery(baseOptions: Apollo.QueryHookOptions<BayAreaOfflineQuery, BayAreaOfflineQueryVariables>) {
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
export const MetroTbdDocument = gql`
    query MetroTBD($metro: String!) {
  allVenues(condition: {metro: $metro, reservation: "TBD", close: false}) {
    nodes {
      ...VenuMainInfo
    }
  }
}
    ${VenuMainInfoFragmentDoc}`;

/**
 * __useMetroTbdQuery__
 *
 * To run a query within a React component, call `useMetroTbdQuery` and pass it any options that fit your needs.
 * When your component renders, `useMetroTbdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMetroTbdQuery({
 *   variables: {
 *      metro: // value for 'metro'
 *   },
 * });
 */
export function useMetroTbdQuery(baseOptions: Apollo.QueryHookOptions<MetroTbdQuery, MetroTbdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MetroTbdQuery, MetroTbdQueryVariables>(MetroTbdDocument, options);
      }
export function useMetroTbdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MetroTbdQuery, MetroTbdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MetroTbdQuery, MetroTbdQueryVariables>(MetroTbdDocument, options);
        }
export type MetroTbdQueryHookResult = ReturnType<typeof useMetroTbdQuery>;
export type MetroTbdLazyQueryHookResult = ReturnType<typeof useMetroTbdLazyQuery>;
export type MetroTbdQueryResult = Apollo.QueryResult<MetroTbdQuery, MetroTbdQueryVariables>;
export const CreateVenueDocument = gql`
    mutation CreateVenue($name: String!, $key: String!, $vintage: String!, $close: Boolean!, $metro: String!, $michelinslug: String!, $michelinobjectid: String!, $address: String!, $city: String!, $country: String!, $coverImage: String!, $cuisine: String!, $imageList: String!, $latitude: Float!, $longitude: Float!, $michelineOnlineReservation: Boolean!, $region: String!, $reservation: String!, $stars: String!, $timezone: String!, $url: String!, $zip: String!) {
  createVenue(
    input: {venue: {key: $key, vintage: $vintage, close: $close, name: $name, metro: $metro, michelinslug: $michelinslug, michelinobjectid: $michelinobjectid, address: $address, city: $city, country: $country, coverImage: $coverImage, cuisine: $cuisine, imageList: $imageList, latitude: $latitude, longitude: $longitude, michelineOnlineReservation: $michelineOnlineReservation, region: $region, reservation: $reservation, stars: $stars, timezone: $timezone, url: $url, zip: $zip}}
  ) {
    venue {
      key
      name
    }
  }
}
    `;
export type CreateVenueMutationFn = Apollo.MutationFunction<CreateVenueMutation, CreateVenueMutationVariables>;

/**
 * __useCreateVenueMutation__
 *
 * To run a mutation, you first call `useCreateVenueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVenueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVenueMutation, { data, loading, error }] = useCreateVenueMutation({
 *   variables: {
 *      name: // value for 'name'
 *      key: // value for 'key'
 *      vintage: // value for 'vintage'
 *      close: // value for 'close'
 *      metro: // value for 'metro'
 *      michelinslug: // value for 'michelinslug'
 *      michelinobjectid: // value for 'michelinobjectid'
 *      address: // value for 'address'
 *      city: // value for 'city'
 *      country: // value for 'country'
 *      coverImage: // value for 'coverImage'
 *      cuisine: // value for 'cuisine'
 *      imageList: // value for 'imageList'
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      michelineOnlineReservation: // value for 'michelineOnlineReservation'
 *      region: // value for 'region'
 *      reservation: // value for 'reservation'
 *      stars: // value for 'stars'
 *      timezone: // value for 'timezone'
 *      url: // value for 'url'
 *      zip: // value for 'zip'
 *   },
 * });
 */
export function useCreateVenueMutation(baseOptions?: Apollo.MutationHookOptions<CreateVenueMutation, CreateVenueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateVenueMutation, CreateVenueMutationVariables>(CreateVenueDocument, options);
      }
export type CreateVenueMutationHookResult = ReturnType<typeof useCreateVenueMutation>;
export type CreateVenueMutationResult = Apollo.MutationResult<CreateVenueMutation>;
export type CreateVenueMutationOptions = Apollo.BaseMutationOptions<CreateVenueMutation, CreateVenueMutationVariables>;
export const LookupReservationInfoDocument = gql`
    query LookupReservationInfo($url: String!) {
  reservationInfo(url: $url) {
    businessid
    urlSlug
    resyCityCode
    latitude
    longitude
    reservation
  }
}
    `;

/**
 * __useLookupReservationInfoQuery__
 *
 * To run a query within a React component, call `useLookupReservationInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useLookupReservationInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLookupReservationInfoQuery({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useLookupReservationInfoQuery(baseOptions: Apollo.QueryHookOptions<LookupReservationInfoQuery, LookupReservationInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LookupReservationInfoQuery, LookupReservationInfoQueryVariables>(LookupReservationInfoDocument, options);
      }
export function useLookupReservationInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LookupReservationInfoQuery, LookupReservationInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LookupReservationInfoQuery, LookupReservationInfoQueryVariables>(LookupReservationInfoDocument, options);
        }
export type LookupReservationInfoQueryHookResult = ReturnType<typeof useLookupReservationInfoQuery>;
export type LookupReservationInfoLazyQueryHookResult = ReturnType<typeof useLookupReservationInfoLazyQuery>;
export type LookupReservationInfoQueryResult = Apollo.QueryResult<LookupReservationInfoQuery, LookupReservationInfoQueryVariables>;
export const MetroReservationDocument = gql`
    query MetroReservation($metro: String!, $reservation: String!) {
  allVenues(condition: {close: false, reservation: $reservation, metro: $metro}) {
    totalCount
    nodes {
      key
      name
      longitude
      latitude
      address
      city
      region
      businessid
      reservation
    }
  }
}
    `;

/**
 * __useMetroReservationQuery__
 *
 * To run a query within a React component, call `useMetroReservationQuery` and pass it any options that fit your needs.
 * When your component renders, `useMetroReservationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMetroReservationQuery({
 *   variables: {
 *      metro: // value for 'metro'
 *      reservation: // value for 'reservation'
 *   },
 * });
 */
export function useMetroReservationQuery(baseOptions: Apollo.QueryHookOptions<MetroReservationQuery, MetroReservationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MetroReservationQuery, MetroReservationQueryVariables>(MetroReservationDocument, options);
      }
export function useMetroReservationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MetroReservationQuery, MetroReservationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MetroReservationQuery, MetroReservationQueryVariables>(MetroReservationDocument, options);
        }
export type MetroReservationQueryHookResult = ReturnType<typeof useMetroReservationQuery>;
export type MetroReservationLazyQueryHookResult = ReturnType<typeof useMetroReservationLazyQuery>;
export type MetroReservationQueryResult = Apollo.QueryResult<MetroReservationQuery, MetroReservationQueryVariables>;
export const RepopulateVenueInfoDocument = gql`
    mutation RepopulateVenueInfo($key: String!, $name: String!, $michelinslug: String!, $michelinobjectid: String!, $coverImage: String!, $cuisine: String!, $latitude: Float!, $longitude: Float!, $stars: String!, $url: String!) {
  updateVenueByKey(
    input: {venuePatch: {michelinslug: $michelinslug, michelinobjectid: $michelinobjectid, name: $name, coverImage: $coverImage, cuisine: $cuisine, latitude: $latitude, longitude: $longitude, stars: $stars, url: $url}, key: $key}
  ) {
    clientMutationId
    venue {
      key
      name
      michelinslug
      michelinobjectid
      coverImage
      cuisine
      imageList
      latitude
      longitude
      stars
      url
    }
  }
}
    `;
export type RepopulateVenueInfoMutationFn = Apollo.MutationFunction<RepopulateVenueInfoMutation, RepopulateVenueInfoMutationVariables>;

/**
 * __useRepopulateVenueInfoMutation__
 *
 * To run a mutation, you first call `useRepopulateVenueInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRepopulateVenueInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [repopulateVenueInfoMutation, { data, loading, error }] = useRepopulateVenueInfoMutation({
 *   variables: {
 *      key: // value for 'key'
 *      name: // value for 'name'
 *      michelinslug: // value for 'michelinslug'
 *      michelinobjectid: // value for 'michelinobjectid'
 *      coverImage: // value for 'coverImage'
 *      cuisine: // value for 'cuisine'
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      stars: // value for 'stars'
 *      url: // value for 'url'
 *   },
 * });
 */
export function useRepopulateVenueInfoMutation(baseOptions?: Apollo.MutationHookOptions<RepopulateVenueInfoMutation, RepopulateVenueInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RepopulateVenueInfoMutation, RepopulateVenueInfoMutationVariables>(RepopulateVenueInfoDocument, options);
      }
export type RepopulateVenueInfoMutationHookResult = ReturnType<typeof useRepopulateVenueInfoMutation>;
export type RepopulateVenueInfoMutationResult = Apollo.MutationResult<RepopulateVenueInfoMutation>;
export type RepopulateVenueInfoMutationOptions = Apollo.BaseMutationOptions<RepopulateVenueInfoMutation, RepopulateVenueInfoMutationVariables>;
export const UpdateVenueInfoDocument = gql`
    mutation UpdateVenueInfo($key: String!, $businessid: String, $reservation: String, $resyCityCode: String, $urlSlug: String, $close: Boolean!, $withOnlineReservation: String!) {
  updateVenueByKey(
    input: {venuePatch: {businessid: $businessid, reservation: $reservation, resyCityCode: $resyCityCode, urlSlug: $urlSlug, close: $close, withOnlineReservation: $withOnlineReservation}, key: $key}
  ) {
    clientMutationId
    venue {
      close
    }
  }
}
    `;
export type UpdateVenueInfoMutationFn = Apollo.MutationFunction<UpdateVenueInfoMutation, UpdateVenueInfoMutationVariables>;

/**
 * __useUpdateVenueInfoMutation__
 *
 * To run a mutation, you first call `useUpdateVenueInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVenueInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVenueInfoMutation, { data, loading, error }] = useUpdateVenueInfoMutation({
 *   variables: {
 *      key: // value for 'key'
 *      businessid: // value for 'businessid'
 *      reservation: // value for 'reservation'
 *      resyCityCode: // value for 'resyCityCode'
 *      urlSlug: // value for 'urlSlug'
 *      close: // value for 'close'
 *      withOnlineReservation: // value for 'withOnlineReservation'
 *   },
 * });
 */
export function useUpdateVenueInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVenueInfoMutation, UpdateVenueInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVenueInfoMutation, UpdateVenueInfoMutationVariables>(UpdateVenueInfoDocument, options);
      }
export type UpdateVenueInfoMutationHookResult = ReturnType<typeof useUpdateVenueInfoMutation>;
export type UpdateVenueInfoMutationResult = Apollo.MutationResult<UpdateVenueInfoMutation>;
export type UpdateVenueInfoMutationOptions = Apollo.BaseMutationOptions<UpdateVenueInfoMutation, UpdateVenueInfoMutationVariables>;
export const UsaReservationTbdDocument = gql`
    query USAReservationTBD {
  allVenues(condition: {close: false, reservation: "TBD", country: "USA"}) {
    totalCount
    nodes {
      name
      region
      city
      longitude
      latitude
      address
      metro
      key
    }
  }
}
    `;

/**
 * __useUsaReservationTbdQuery__
 *
 * To run a query within a React component, call `useUsaReservationTbdQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsaReservationTbdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsaReservationTbdQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsaReservationTbdQuery(baseOptions?: Apollo.QueryHookOptions<UsaReservationTbdQuery, UsaReservationTbdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsaReservationTbdQuery, UsaReservationTbdQueryVariables>(UsaReservationTbdDocument, options);
      }
export function useUsaReservationTbdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsaReservationTbdQuery, UsaReservationTbdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsaReservationTbdQuery, UsaReservationTbdQueryVariables>(UsaReservationTbdDocument, options);
        }
export type UsaReservationTbdQueryHookResult = ReturnType<typeof useUsaReservationTbdQuery>;
export type UsaReservationTbdLazyQueryHookResult = ReturnType<typeof useUsaReservationTbdLazyQuery>;
export type UsaReservationTbdQueryResult = Apollo.QueryResult<UsaReservationTbdQuery, UsaReservationTbdQueryVariables>;
export const VenueByKeyWithSlotsDocument = gql`
    query VenueByKeyWithSlots($key: String!, $date: String!, $party_size: Int = 2, $timeOption: String = "dinner") {
  allVenues(condition: {key: $key}) {
    nodes {
      slots(date: $date, party_size: $party_size, timeOption: $timeOption)
      monthlySlots(date: $date, party_size: $party_size, timeOption: $timeOption) {
        date
        slots
        url
      }
      myReservationUrl(date: $date, party_size: $party_size, timeOption: $timeOption)
      ...VenueAllOtherFields
    }
  }
}
    ${VenueAllOtherFieldsFragmentDoc}`;

/**
 * __useVenueByKeyWithSlotsQuery__
 *
 * To run a query within a React component, call `useVenueByKeyWithSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVenueByKeyWithSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVenueByKeyWithSlotsQuery({
 *   variables: {
 *      key: // value for 'key'
 *      date: // value for 'date'
 *      party_size: // value for 'party_size'
 *      timeOption: // value for 'timeOption'
 *   },
 * });
 */
export function useVenueByKeyWithSlotsQuery(baseOptions: Apollo.QueryHookOptions<VenueByKeyWithSlotsQuery, VenueByKeyWithSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VenueByKeyWithSlotsQuery, VenueByKeyWithSlotsQueryVariables>(VenueByKeyWithSlotsDocument, options);
      }
export function useVenueByKeyWithSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VenueByKeyWithSlotsQuery, VenueByKeyWithSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VenueByKeyWithSlotsQuery, VenueByKeyWithSlotsQueryVariables>(VenueByKeyWithSlotsDocument, options);
        }
export type VenueByKeyWithSlotsQueryHookResult = ReturnType<typeof useVenueByKeyWithSlotsQuery>;
export type VenueByKeyWithSlotsLazyQueryHookResult = ReturnType<typeof useVenueByKeyWithSlotsLazyQuery>;
export type VenueByKeyWithSlotsQueryResult = Apollo.QueryResult<VenueByKeyWithSlotsQuery, VenueByKeyWithSlotsQueryVariables>;
export const VenueByKeyDocument = gql`
    query VenueByKey($key: String!) {
  venueByKey(key: $key) {
    ...VenueAllOtherFields
  }
}
    ${VenueAllOtherFieldsFragmentDoc}`;

/**
 * __useVenueByKeyQuery__
 *
 * To run a query within a React component, call `useVenueByKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `useVenueByKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVenueByKeyQuery({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useVenueByKeyQuery(baseOptions: Apollo.QueryHookOptions<VenueByKeyQuery, VenueByKeyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VenueByKeyQuery, VenueByKeyQueryVariables>(VenueByKeyDocument, options);
      }
export function useVenueByKeyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VenueByKeyQuery, VenueByKeyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VenueByKeyQuery, VenueByKeyQueryVariables>(VenueByKeyDocument, options);
        }
export type VenueByKeyQueryHookResult = ReturnType<typeof useVenueByKeyQuery>;
export type VenueByKeyLazyQueryHookResult = ReturnType<typeof useVenueByKeyLazyQuery>;
export type VenueByKeyQueryResult = Apollo.QueryResult<VenueByKeyQuery, VenueByKeyQueryVariables>;