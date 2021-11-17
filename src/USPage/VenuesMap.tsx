import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

import { Venue } from '../generated/graphql';
import { VenueAvailabilityList, VenueDescription, VenueTitle } from './VenueItems';

const containerStyle = {
  minWidth: "400px",
  height: "400px",
};

type VenueMarkerProp = {
  venue: Venue;
};

const VenueMarker = ({ venue }: VenueMarkerProp) => {
  const [infoOpen, setInfoOpen] = useState(false);
  // if (isNaN(venue.latitude!) || isNaN(venue.longitude!)) {
  if (venue.latitude! === null || venue.longitude! === null) {
    console.log("skip");
    return null;
  }

  // console.log(venue.name);
  // console.log(venue.latitude);
  // console.log(venue.longitude);
  return (
    <Marker
      key={venue.key}
      position={{
        lat: venue.latitude!,
        lng: venue.longitude!,
      }}
      onClick={() => setInfoOpen(!infoOpen)}
    >
      {infoOpen && (
        <InfoWindow
          position={{
            lat: venue.latitude!,
            lng: venue.longitude!,
          }}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div>
            <VenueTitle venue={venue} />
            <VenueDescription venue={venue} />
            <VenueAvailabilityList venue={venue} />
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

type VenuesMapProp = {
  venues: Array<Venue>;
};

export const VenuesMap = React.memo(({ venues }: VenuesMapProp) => {
  // Iterate myPlaces to size, center, and zoom map to contain all markers
  const fitBounds = (map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    venues.map((place) => {
      if (place.latitude === null || place.longitude === null) {
        console.log(place.name + " lng/lat missing");
        return place.name;
      }
      bounds.extend({
        lat: place.latitude!,
        lng: place.longitude!,
      });
      return place.name;
    });
    map.fitBounds(bounds);
  };

  const loadHandler = (map: google.maps.Map) => {
    // Fit map bounds to contain all markers
    fitBounds(map);
  };

  if (venues === undefined) {
    return <p>WTF, no venues</p>;
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ""}
    >
      <GoogleMap
        onLoad={loadHandler}
        mapContainerStyle={containerStyle}
        zoom={10}
      >
        {venues.map((venue) => (
          <VenueMarker key={venue.key} venue={venue} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
});
