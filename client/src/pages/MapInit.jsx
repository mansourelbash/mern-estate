import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import { Popups } from '../components/Popups'; // Importing the Popups component
import 'mapbox-gl/dist/mapbox-gl.css';
import { polygonData as initialPolygonData } from '../data/dummy';
import proj4 from 'proj4';
import MapboxDraw from '@mapbox/mapbox-gl-draw'; 
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'; 
import ModalDetails from '../components/ModalDetails';

const mapBoxAccessKey = import.meta.env.VITE_REACT_APP_MAPBOX_API;

const dataToGeoJSON = (polygons) => {
  return {
    type: 'FeatureCollection',
    features: polygons.map((polygon) => ({
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
  const [polygonData, setPolygonData] = useState(initialPolygonData);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [allPolygon, setAllPolygon] = useState(null);

  const [bbox, setBbox] = useState(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null); // To persist the draw instance

  proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"); // WGS84 (latitude/longitude)
  proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"); // Web Mercator

  const handleThemeChange = (event) => {
    setMapStyle(event.target.value);
  };

  useEffect(() => {
    // Load polygon data from local storage if available
    const savedPolygons = localStorage.getItem('polygons');
    console.log(polygonData,'savedPolygons')
    if (savedPolygons) {
      setPolygonData(JSON.parse(savedPolygons));
    } else {
      // Initialize with initial data if no saved data
      setPolygonData(savedPolygons);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('polygons', JSON.stringify(polygonData));
  }, [polygonData]);

  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (map) {
      // Initialize the Draw tool
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          line_string: true,
          point: true,
          trash: true,
        },
      });

      drawRef.current = draw; // Store reference to Draw tool
      map.addControl(draw, 'top-right'); // Add Draw control to the map


      map.on('draw.update', (event) => {
        console.log('Feature updated:', event.features);
      });

      map.on('draw.delete', (event) => {
        console.log('Feature deleted:', event.features);
      });

      map.on('draw.create', (event) => {
        const newPolygon = event.features[0];
        const userConfirmed = window.confirm('Do you want to save this polygon?');
        if (userConfirmed) {
          const newPolygonData = {
            id: newPolygon.id,
            color: '#FF0000', // Example color
            borderColor: '#000000', // Example border color
            coordinates: newPolygon.geometry.coordinates,
          };
          setAllPolygon(newPolygon.geometry.coordinates)
          setPolygonData((prevData) => [...prevData, newPolygonData]);
          console.log('Feature created:', event.features);

        }
      });


      return () => {
        // Cleanup the Draw control when the component unmounts
        if (drawRef.current) {
          map.removeControl(drawRef.current);
          drawRef.current = null; // Reset drawRef
        }
      };
    }
  }, [mapRef]); // Only run when mapRef changes

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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentPolygonIndex((prevIndex) => (prevIndex + 1) % polygonData.length);
  //   }, 3000); // Change the polygon every 3 seconds

  //   return () => clearInterval(interval); // Cleanup interval on component unmount
  // }, []);

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


  const handlePolygonClick = (event) => {
    const clickedFeature = event.features[0];
    console.log(clickedFeature,'clickedFeature')
    if (clickedFeature && clickedFeature.layer.id === 'polygons-layer') {
      const polygonId = clickedFeature.properties.id;
      const coordinates = clickedFeature._geometry.coordinates;
      setSelectedPolygon({ id: polygonId, coordinates });
      openModal();
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    if (selectedPolygon) {
      const updatedPolygons = polygonData.filter(polygon => polygon.id !== selectedPolygon.id);
      setPolygonData(updatedPolygons);
      console.log(`Polygon with ID ${selectedPolygon.id} deleted.`);
      closeModal(); // Close the modal after deletion
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
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

        onClick={handlePolygonClick} // Attach the click handler here
      >
        <Source id="polygons" type="geojson" data={dataToGeoJSON(polygonData)}>
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
      {isModalOpen && (
        <ModalDetails 
          onDelete={handleDelete} 
          closeModal={closeModal} 
          polygonId={selectedPolygon?.id}
          polygonData={selectedPolygon} // Pass the selected polygon ID to the modal
        />
      )}
    </div>
  );
};

export default MapInit;