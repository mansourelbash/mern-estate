import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import { Popups } from '../components/Popups'; // Importing the Popups component
import 'mapbox-gl/dist/mapbox-gl.css';
import { polygonData } from '../data/dummy';
import proj4 from 'proj4';

const mapBoxAccessKey = import.meta.env.VITE_REACT_APP_MAPBOX_API;

const dataToGeoJSON = (polygons) => {
  return {
    type: 'FeatureCollection',
    features: polygonData.map((polygon) => ({
      type: 'Feature',
      properties: {
        id: polygon.id,
        color: polygon.color,
        border: polygon.borderColor,
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
      10, ['get', 'color'],
    ],
    'fill-opacity': 0.8,
    'fill-outline-color': '#000',
  },
};

const MapInit = () => {
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11');
  const [currentPolygonIndex, setCurrentPolygonIndex] = useState(0);
  const [bbox, setBbox] = useState(null);
  const mapRef = useRef(null);
  proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"); // WGS84 (latitude/longitude)
  proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"); // Web Mercator

  const handleThemeChange = (event) => {
    setMapStyle(event.target.value);
  };

  const handleMapHover = useCallback((event) => {
    const features = event?.features;
    if (features && features.length) {
      const hoveredFeature = features[0];
      setHoveredPolygon({
        coordinates: hoveredFeature.geometry.coordinates[0][0],
        accountStatus: hoveredFeature.properties.accountStatus,
        id: hoveredFeature.properties.id,
      });
    } else {
      setHoveredPolygon(null);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPolygonIndex((prevIndex) => (prevIndex + 1) % polygonData.length);
    }, 3000); // Change the polygon every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const getBoundingBox = () => {
    const map = mapRef.current?.getMap();
    if (map) {
      const bounds = map.getBounds();
      const bbox = [
        bounds.getWest(), // Min Longitude
        bounds.getSouth(), // Min Latitude
        bounds.getEast(), // Max Longitude
        bounds.getNorth(), // Max Latitude
      ];
      return bbox;
    }
    return null;
  };

  const convertToProjectedCoordinates = (bbox) => {
    const [lon_min, lat_min, lon_max, lat_max] = bbox;
    const [x_min, y_min] = proj4('EPSG:4326', 'EPSG:3857', [lon_min, lat_min]);
    const [x_max, y_max] = proj4('EPSG:4326', 'EPSG:3857', [lon_max, lat_max]);
    return [x_min, y_min, x_max, y_max];
  };

  const createDynamicUrl = () => {
    const bbox = getBoundingBox();
    if (bbox) {
      const projectedBbox = convertToProjectedCoordinates(bbox);
      const baseUrl = "https://maps.dls.gov.jo/DotNet/proxy.ashx?https%3A%2F%2Fmaps.dls.gov.jo%2Farcgis%2Frest%2Fservices%2FDLS%2FDLS_Cassini%2FMapServer%2Fexport";
      const params = new URLSearchParams({
        bbox: projectedBbox.join(','),
        bboxSR: 102100,
        imageSR: 102100,
        size: "1280,352",
        dpi: 96,
        format: "png32",
        transparent: true,
        layers: "show:0,1,2,6",
        f: "image",
      });

      const dynamicUrl = `${baseUrl}?${params.toString()}`;
      return dynamicUrl;
    }
    return null;
  };

  // Effect to fetch data and update bounding box and layer URL on map move
  useEffect(() => {
    const handleMoveEnd = () => {
      const newBbox = getBoundingBox();
      if (newBbox) {
        setBbox(newBbox); // Update the bbox state
      }
    };

    const map = mapRef.current?.getMap();
    if (map) {
      map.on('moveend', handleMoveEnd); // Listen for moveend events
    }

    return () => {
      if (map) {
        map.off('moveend', handleMoveEnd); // Cleanup event listener
      }
    };
  }, [mapRef]);

  const dynamicUrl = createDynamicUrl();

  console.log(dynamicUrl, 'dynamicUrldynamicUrldynamicUrl');

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
        <option value="mapbox://styles/mansouralbash/cm1gkfmci003001qveipsgrie">Custom Theme</option>
        <option value="mapbox://styles/mapbox/streets-v11">Street</option>
        <option value="mapbox://styles/mapbox/satellite-streets-v12">Satellite</option>
        <option value="mapbox://styles/mapbox/dark-v11">Dark</option>
        <option value="mapbox://styles/mapbox/outdoors-v12">Outdoors</option>
        <option value="mapbox://styles/mapbox/light-v11">Light</option>
      </select>

      <Map
        ref={mapRef}
        mapboxAccessToken={mapBoxAccessKey}
        initialViewState={{
          longitude: 36.004,
          latitude: 32.562,
          zoom: 14,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        interactiveLayerIds={['polygons-layer']}
        onMouseMove={handleMapHover}
      >
        <Source
          id="arcgis-layer"
          type="image"
          url={`http://localhost:3000/proxy?bbox=${bbox || ''}`}
          coordinates={[
            [34.955417, 29.197495], // Southwest corner
            [38.993572, 29.197495], // Southeast corner
            [38.993572, 33.378686], // Northeast corner
            [34.955417, 33.378686], // Northwest corner
          ]}
        />


        <Source id="polygons-source" type="geojson" data={dataToGeoJSON([polygonData[currentPolygonIndex]])}>
          <Layer {...polygonLayerStyle} />
        </Source>

        {hoveredPolygon && (
          <Popups
            longitude={hoveredPolygon.coordinates[0]}
            latitude={hoveredPolygon.coordinates[1]}
            accountStatus={hoveredPolygon.accountStatus}
          />
        )}
      </Map>
    </div>
  );
};

export default MapInit;