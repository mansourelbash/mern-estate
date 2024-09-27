
import React, { useState, useCallback, useRef } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
import { Popups } from '../components/Popups'; // Importing the Popups component
import 'mapbox-gl/dist/mapbox-gl.css';
import { polygonData } from '../data/dummy';

const mapBoxAccessKey = import.meta.env.VITE_REACT_APP_MAPBOX_API;

// Dummy polygons representing areas in different Jordanian cities with unique colors
const dummyPolygons = [
  {
    id: 'amman',
    accountStatus: 'active',
    color: '#00FF00', // Green for active
    coordinates: [
      [
        [35.9126, 31.9539],
        [35.9333, 31.9539],
        [35.9333, 31.9639],
        [35.9126, 31.9639],
        [35.9126, 31.9539],
      ],
    ],
  },
  {
    id: 'zarqa',
    accountStatus: 'inactive',
    color: '#FF0000', // Red for inactive
    coordinates: [
      [
        [36.0101, 32.0664],
        [36.0301, 32.0664],
        [36.0301, 32.0764],
        [36.0101, 32.0764],
        [36.0101, 32.0664],
      ],
    ],
  },
  {
    id: 'irbid',
    accountStatus: 'active',
    color: '#0000FF', // Blue for active
    coordinates: [
      [
        [35.8569, 32.5398],
        [35.8769, 32.5398],
        [35.8769, 32.5498],
        [35.8569, 32.5498],
        [35.8569, 32.5398],
      ],
    ],
  },
  {
    id: 'aqaba',
    accountStatus: 'inactive',
    color: '#FFFF00', // Yellow for inactive
    coordinates: [
      [
        [35.0000, 29.5000],
        [35.0200, 29.5000],
        [35.0200, 29.5100],
        [35.0000, 29.5100],
        [35.0000, 29.5000],
      ],
    ],
  },
];
const dataToGeoJSON = (polygons) => {
  return {
    type: 'FeatureCollection',
    features: polygonData.map((polygon) => ({
      type: 'Feature',
      properties: {
        id: polygon.id,
        // accountStatus: polygon.accountStatus,
        color: polygon.color,
        border: polygon.borderColor
      },
      geometry: {
        type: 'Polygon',
        coordinates: polygon.coordinates,
      },
    })),
  };
};

// Layer style for polygons
const polygonLayerStyle = {
  id: 'polygons-layer',
  type: 'fill',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['zoom'],
      5, 'rgba(255, 255, 255, 0)',
      10, ['get', 'color']
    ],
    'fill-opacity': 0.5,
    'fill-outline-color': '#000',
  },
};

const jordanBoundariesGeoJSON = {
  type: 'FeatureCollection',
  features: [
      {
          type: 'Feature',
          geometry: {
              type: 'Polygon',
              coordinates: [
                  [
                      [34.955417, 29.197495], // Southwest corner
                      [38.993572, 29.197495], // Southeast corner
                      [38.993572, 33.378686], // Northeast corner
                      [34.955417, 33.378686], // Northwest corner
                      [34.955417, 29.197495]  // Closing the polygon
                  ]
              ]
          },
          properties: {
              name: 'Jordan'
          }
      }
  ]
};

const jordanBoundaryLayerStyle = {
  id: 'jordan-boundaries-layer',
  type: 'fill', // Change to 'fill' for a filled polygon
  paint: {
      'fill-color': '#0000ff', // Fill color for the polygon (red)
      'fill-opacity': 0.05, // Opacity of the fill
  },
};

const MapInit = () => {
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [mapStyle, setMapStyle] = useState(
    'mapbox://styles/mansouralbash/cm1gkfmci003001qveipsgrie'
  ); // Set your default map style

  const mapRef = useRef(null); // Reference for the map

  const handleThemeChange = (event) => {
    setMapStyle(event.target.value); // Update the map style based on selected value
  };

  const handleMapHover = useCallback((event) => {
    const features = event?.features;
    if (features && features.length) {
      const hoveredFeature = features[0];
      setHoveredPolygon({
        coordinates: hoveredFeature.geometry.coordinates[0][0], // Taking the first coordinate for popup
        accountStatus: hoveredFeature.properties.accountStatus,
        id: hoveredFeature.properties.id,
      });
    } else {
      setHoveredPolygon(null);
    }
  }, []);

  const onMapLoad = useCallback(() => {
    const map = mapRef.current.getMap();
    map.addLayer(jordanBoundaryLayerStyle, 'waterway-label');
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <select
        value={mapStyle}
        onChange={handleThemeChange}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 1,
          padding: '8px',
          borderRadius: '4px',
        }}
      >
        <option value="mapbox://styles/mansouralbash/cm1gkfmci003001qveipsgrie">
          Custom Theme
        </option>
        <option value="mapbox://styles/mapbox/streets-v11">Street</option>
        <option value="mapbox://styles/mapbox/satellite-streets-v12">
          Satellite
        </option>
        <option value="mapbox://styles/mapbox/dark-v11">
          dark
        </option>
        <option value="mapbox://styles/mapbox/outdoors-v12">
        outdoors
        </option>
        <option value="mapbox://styles/mapbox/light-v11">
        light
        </option>
      </select>

      <Map
        ref={mapRef}
        mapboxAccessToken={mapBoxAccessKey}
        initialViewState={{
          longitude: 36.004, // Adjusted longitude for Ramtha
          latitude: 32.562,  // Adjusted latitude for Ramtha
          zoom: 14,          // Zoom level for detailed view
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle} // Set the dynamic map style here
        interactiveLayerIds={['polygons-layer']}
        onMouseMove={handleMapHover}
        onLoad={onMapLoad} // Trigger population layer addition
      >
        <Source id="polygons-source" type="geojson" data={dataToGeoJSON(dummyPolygons)}>
          <Layer {...polygonLayerStyle} />
        </Source>
        <Source id="polygons-jordan" type="geojson" data={jordanBoundariesGeoJSON}>
          <Layer {...jordanBoundaryLayerStyle} />
        </Source>

        {hoveredPolygon && (
          <Popups
            longitude={hoveredPolygon.coordinates[0]} // Taking first coordinate for longitude
            latitude={hoveredPolygon.coordinates[1]} // Taking first coordinate for latitude
            accountStatus={hoveredPolygon.accountStatus}
          />
        )}
      </Map>
    </div>
  );
};

export default MapInit;