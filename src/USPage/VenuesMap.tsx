import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

import { Venue } from '../generated/graphql';
import { VenueAvailabilityList, VenueDescription, VenueTitle } from './VenueProp';

const containerStyle = {
  minWidth: "400px",
  height: "400px",
};

type VenueMarkerProp = {
  venue: Venue;
};

const VenueMarker = ({ venue }: VenueMarkerProp) => {
  const [infoOpen, setInfoOpen] = useState(false);
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

  return (
    <LoadScript googleMapsApiKey="AIzaSyBHf0MsAA7fjPVdPIdoRxGIj5AVmYZfelo">
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
