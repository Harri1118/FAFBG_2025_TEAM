/**
 * Albany Rural Cemetery Interactive Map Application
 * 
 * This React application provides an interactive map interface for the Albany Rural Cemetery,
 * featuring search capabilities, tour routes, burial locations, and navigation assistance.
 * The application integrates various mapping technologies and UI components to create
 * a user-friendly cemetery exploration tool.
 */

//=============================================================================
// External Dependencies
//=============================================================================

// React and Core Dependencies
import { React, useState, useEffect, useMemo, useRef, useCallback } from "react";

// Leaflet and Map-related Dependencies
import { MapContainer, Popup, Marker, GeoJSON, LayersControl, LayerGroup, useMap } from "react-leaflet";
import L from 'leaflet';  // Core Leaflet library for map functionality
import "../styling/index.css";
import 'leaflet.markercluster/dist/leaflet.markercluster';  // Clustering support for markers
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-routing-machine';  // Routing capabilities
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'lrm-graphhopper';  // GraphHopper routing integration
import * as turf from '@turf/turf';  // Geospatial calculations library
import { BasemapLayer } from 'react-esri-leaflet';  // ESRI basemap integration
import TourGroup from "./Tour_Group";
import ToursGroupIterative from "./Tour_Group_Sec49"
// Material-UI Components and Icons
import { 
  Autocomplete, TextField, Paper, InputAdornment, IconButton,
  List, ListItem, ListItemText, Divider, Box, Typography,
  ButtonGroup, Button 
} from '@mui/material';
import PinDropIcon from '@mui/icons-material/PinDrop';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HomeIcon from '@mui/icons-material/Home';

// Local Data and Styles
import geo_burials from "../data/Geo_Burials.json";
import ARC_Roads from "../data/ARC_Roads.json";
import ARC_Boundary from "../data/ARC_Boundary.json";
import ARC_Sections from "../data/ARC_Sections.json";
import Sec75_Headstones from "../data/Projected_Sec75_Headstones.json";
import Sec49_Headstones from "../data/Projected_Sec49_Headstones.json";

// Tour Data Imports
import NotablesTour from "../data/NotablesTour20.json";
import IndependenceTour from "../data/IndependenceTour20.json";
import AfricanAmericanTour from "../data/AfricanAmericanTour20.json";
import ArtistTour from "../data/ArtistTour20.json";
import AssociationsTour from "../data/AssociationsTour20.json";
import AuthorsTour from "../data/AuthorsPublishersTour20.json";
import BusinessTour from "../data/BusinessFinanceTour20.json";
import CivilWarTour from "../data/CivilWarTour20.json";
import PillarsTour from "../data/SocietyPillarsTour20.json";
import MayorsTour from "../data/AlbanyMayors_fixed.json";
import GARTour from "../data/GAR_fixed.json";
import Lot7 from "../data/Projected_Sec75_Headstones.json"
import Tour_Group_Iterative from "./Tour_Group_Sec49";

//=============================================================================
// Constants and Configuration
//=============================================================================

/**
 * Defines zoom level thresholds for different map behaviors
 */
const ZOOM_LEVELS = {
  SECTION: 16,    // Level at which section info becomes visible
  CLUSTER: 17,    // Level at which markers begin clustering
  INDIVIDUAL: 20  // Level at which individual markers are always visible
};

/**
 * Colors used for numbered markers in search results
 * Cycles through these colors for multiple markers
 */
const MARKER_COLORS = [
  '#e41a1c', // red
  '#377eb8', // blue
  '#4daf4a', // green
  '#984ea3', // purple
  '#ff7f00', // orange
  '#ffff33', // yellow
  '#a65628', // brown
  '#f781bf', // pink
  '#999999'  // grey
];

/**
 * Default zoom level for focusing on specific locations
 */
const ZOOM_LEVEL = 19;
// https://www.albany.edu/arce/assets/files/ARC_Sections.geojson
const URLS = [
  "https://www.albany.edu/arce/assets/files/Sec49.csv",
  "https://www.albany.edu/arce/assets/files/Projected_Sec75_Headstones.geojson",
  "https://www.albany.edu/arce/assets/files/Projected_Sec49_Headstones.geojson",
  "https://www.albany.edu/arce/assets/files/NotablesTour20.geojson",
  "https://www.albany.edu/arce/assets/files/IndependenceTour20.geojson",
  "https://www.albany.edu/arce/assets/files/AfricanAmericanTour20.geojson",
  "https://www.albany.edu/arce/assets/files/ArtistTour20.geojson",
  "https://www.albany.edu/arce/assets/files/AssociationsTour20.geojson",
  "https://www.albany.edu/arce/assets/files/AuthorsPublishersTour20.geojson",
  "https://www.albany.edu/arce/assets/files/BusinessFinanceTour20.geojson",
  "https://www.albany.edu/arce/assets/files/CivilWarTour20.geojson",
  "https://www.albany.edu/arce/assets/files/garFixed2.geojson",
  "https://www.albany.edu/arce/assets/files/AlbanyMayors_fixed.geojson",
  "https://www.albany.edu/arce/assets/files/SocietyPillarsTour20.geojson"
]
//=============================================================================
// Style Definitions
//=============================================================================

/**
 * Style configuration for the cemetery boundary
 */
const exteriorStyle = {
  color: "blue",
  weight: 1.5,
  fillOpacity: 0
};

const sectionBoundaryStyle = {
  color: "#2468F0",
  weight: 1.5,
  fillOpacity: 0.2
}

/**
 * Style configuration for cemetery roads
 */
const roadStyle = {
  color: '#000000',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.1
};

//=============================================================================
// React Components
//=============================================================================

/**
 * Custom zoom control component that provides zoom in/out buttons
 * Positioned at the top-right corner of the map
 */
function CustomZoomControl() {
  const map = useMap();
  
  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        top: '80px',
        right: '10px',
        zIndex: 1000,
      }}
    >
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        size="small"
      >
        <IconButton onClick={() => map.zoomIn()} size="small">
          <AddIcon />
        </IconButton>
        <IconButton onClick={() => map.zoomOut()} size="small">
          <RemoveIcon />
        </IconButton>
      </ButtonGroup>
    </Paper>
  );
}

/**
 * Component that restricts map bounds and zoom levels to the cemetery area
 * Uses Turf.js for geospatial calculations
 */
function MapBounds() {
  const map = useMap();
  const boundaryPolygon = ARC_Boundary.features[0];
  
  useEffect(() => {
    // Calculate the bounds of the boundary polygon using Turf.js
    const bounds = turf.bbox(boundaryPolygon);
    
    // Add significant padding to the bounds (about 1km)
    const padding = 0.01; // roughly 1km in decimal degrees
    const southWest = [bounds[1] - padding, bounds[0] - padding];
    const northEast = [bounds[3] + padding, bounds[2] + padding];
    
    const paddedBounds = [southWest, northEast];
    
    // Set map constraints
    map.setMaxBounds(paddedBounds);
    map.setMinZoom(15);
    map.setMaxZoom(25);

    // Initial fit to bounds
    map.once('load', () => {
      map.fitBounds(paddedBounds);
    });
  }, [map, boundaryPolygon]);
  
  return null;
}

/**
 * Component that renders the ESRI vector basemap
 */
function VectorBasemap({ name }) {
  return <BasemapLayer name={name} maxZoom={25} maxNativeZoom={19} />;
}

/**
 * Component that manages routing between two points using GraphHopper
 */
function RoutingControl({ from, to }) {
  const map = useMap();
  const [routingError, setRoutingError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  useEffect(() => {
    if (!from || !to) return;

    setRoutingError(null);
    setIsCalculating(true);

    const apiKey = process.env.REACT_APP_GRAPHHOPPER_API_KEY;
    if (!apiKey) {
      console.error('GraphHopper API key not found in environment variables');
      setRoutingError('Configuration error: API key not found. Please contact administrators.');
      setIsCalculating(false);
      return;
    }

    const routingControl = L.Routing.control({
      router: new L.Routing.GraphHopper(apiKey, {
        urlParameters: {
          vehicle: 'foot'  // Set to pedestrian routing
        }
      }),
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1])
      ],
      createMarker: function() { return null; },
      lineOptions: {
        styles: [
          {color: '#0066CC', opacity: 0.8, weight: 5},
          {color: '#ffffff', opacity: 0.3, weight: 7}
        ]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      useZoomParameter: true,
      show: false
    }).addTo(map);

    routingControl.on('routesfound', () => {
      setIsCalculating(false);
    });

    routingControl.on('routingerror', (e) => {
      console.error('Routing error:', e);
      
      if (e.error && e.error.status === 0) {
        setRoutingError('Network error: Please check your internet connection.');
      } else if (e.error && e.error.status === 401) {
        setRoutingError('Authentication error: Invalid API key.');
      } else if (e.error && e.error.status === 429) {
        setRoutingError('Too many requests: Rate limit exceeded.');
      } else {
        setRoutingError('Unable to calculate route. The locations might be inaccessible by foot or too far apart.');
      }
      
      setIsCalculating(false);
      map.removeControl(routingControl);
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, from, to]);

  if (isCalculating) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          padding: '10px',
          backgroundColor: '#f5f5f5',
          color: '#333',
        }}
      >
        <Typography>Calculating route...</Typography>
      </Paper>
    );
  }

  if (routingError) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          padding: '10px',
          backgroundColor: '#f44336',
          color: 'white',
        }}
      >
        <Typography>{routingError}</Typography>
      </Paper>
    );
  }

  return null;
}

/**
 * Button component that resets the map view to the default extent
 */
function DefaultExtentButton() {
  const map = useMap();
  
  const handleClick = () => {
    const defaultBounds = [
      [42.694180, -73.741980], // Southwest corner
      [42.714180, -73.721980]  // Northeast corner
    ];
    map.fitBounds(defaultBounds);
  };
  
  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        top: '150px',
        right: '10px',
        zIndex: 1000,
      }}
    >
      <IconButton onClick={handleClick} size="small" title="Return to Default Extent">
        <HomeIcon />
      </IconButton>
    </Paper>
  );
}
//=============================================================================
// Main Map Component
//=============================================================================

/**
 * Main component for the Albany Rural Cemetery interactive map
 * Provides functionality for:
 * - Searching and displaying burial locations
 * - Filtering by section, lot, and tier
 * - Displaying themed cemetery tours
 * - Real-time location tracking
 * - Turn-by-turn navigation to burial sites
 */
export default function ToursMap() {
  //-----------------------------------------------------------------------------
  // State Management
  //-----------------------------------------------------------------------------
  
  // Map and UI State
  const [overlayMaps, setOverlayMaps] = useState({});
  const [currentZoom, setCurrentZoom] = useState(14);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  
  // Search and Filter State
  const [selectedBurials, setSelectedBurials] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentSelection, setCurrentSelection] = useState(null);
  const [showAllBurials, setShowAllBurials] = useState(false);
  const [sectionFilter, setSectionFilter] = useState('');
  const [lotTierFilter, setLotTierFilter] = useState('');
  const [filterType, setFilterType] = useState('lot');
  
  // Location and Routing State
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState('Find me');
  const [routingDestination, setRoutingDestination] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Component References
  const { BaseLayer } = LayersControl;
  
  const onLocateMarker = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
      return;
    }

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    setStatus('Locating...');

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const point = turf.point([position.coords.longitude, position.coords.latitude]);
        const boundaryPolygon = ARC_Boundary.features[0];
        const bufferedBoundary = turf.buffer(boundaryPolygon, 8, { units: 'kilometers' });
        const isWithinBuffer = turf.booleanPointInPolygon(point, bufferedBoundary);
        
        if (isWithinBuffer) {
          setStatus('Location active');
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          
        } else {
          setStatus('You must be within 5 miles of Albany Rural Cemetery');
          setLat(null);
          setLng(null);
        }
      },
      (error) => {
        setStatus('Unable to retrieve your location');
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );
    setWatchId(id);
  };
  function LocationButton(){
    return (
      <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        top: '200px',
        right: '10px',
        zIndex: 1000,
      }}
    >
      <IconButton >
        <Button onClick={onLocateMarker}>
        <LocationOnIcon/>
        </Button>
        
      </IconButton>
      </Paper>
    )
  }
  return (
    <div className="map-container">
      <MapContainer
        center={[42.704180, -73.731980]}
        zoom={14}
        className="map"
        zoomControl={false}
        maxZoom={25}
      >
        <CustomZoomControl />
        <DefaultExtentButton />
        <LocationButton/>
        <MapBounds />
        <LayersControl>
        <BaseLayer checked name="Topographic">
            <VectorBasemap name="Topographic" />
          </BaseLayer>
          <BaseLayer name="Imagery">
            <VectorBasemap name="ImageryClarity" />
          </BaseLayer>

          <LayerGroup>
            <LayersControl.Overlay checked name="Boundary">
              <GeoJSON data={ARC_Boundary} style={exteriorStyle}/>
            </LayersControl.Overlay>
          </LayerGroup>
          <LayerGroup>
            <LayersControl.Overlay name="Roads">
              <GeoJSON data={ARC_Roads} style={roadStyle} />
            </LayersControl.Overlay>
          </LayerGroup>
        <LayerGroup>

            <TourGroup data={Lot7} color="#7587ff" tourGroup="Soldiers Lot (Section 75, Lot 7)"/>
            {/* <TourGroup data={Sec49_Headstones} color="#75ff87" tourGroup="Mayors of Albany"/> */}
            <ToursGroupIterative/>
            <TourGroup data={NotablesTour} color="#ff7700" tourGroup="Notables Tour 2020"/>
            <TourGroup data={IndependenceTour} color="#7700ff" tourGroup="Independence Tour 2020"/>
            <TourGroup data={AfricanAmericanTour} color="#eedd00" tourGroup="African American Tour 2020"/>
            <TourGroup data={ArtistTour} color="#ff4277" tourGroup="Artists Tour 2020"/>
            <TourGroup data={AssociationsTour} color="#86cece" tourGroup="Associations, Societies, & Groups Tour 2020"/>
            <TourGroup data={AuthorsTour} color="#996038" tourGroup="Authors & Publishers Tour 2020"/> 
            <TourGroup data={BusinessTour} color="#558e76" tourGroup="Business & Finance Tour 2020"/> 
            <TourGroup data={CivilWarTour} color="#a0a0a0" tourGroup="Civil War Tour 2020"/>
            <TourGroup data={PillarsTour} color="#d10008" tourGroup="Pillars of Society Tour 2020"/>
            <TourGroup data={MayorsTour} color="#ff00dd" tourGroup="Mayors of Albany"/>
            <TourGroup data={GARTour} color="#000080" tourGroup="Grand Army of the Republic"/>
            <LayersControl.Overlay name="Sections">
            <GeoJSON data={ARC_Sections} style={sectionBoundaryStyle}
            onEachFeature={(feature, layer) => {
              // Create tooltip but don't bind it yet
              const tooltip = L.tooltip({
                permanent: true,
                direction: 'center',
                className: 'section-label'
              });
              
              layer.on({
                // Show label on mouseover if not already selected
                mouseover: () => {
                  if (feature.properties.Section !== sectionFilter && currentZoom < ZOOM_LEVELS.SECTION) {
                    if(feature.properties.Section_Di == 49)
                      tooltip.setContent(`Section ${feature.properties.Section_Di} Lot ${feature.properties.Lot}: ${feature.properties.Comments}`);
                    else
                      tooltip.setContent(`Section ${feature.properties.Section_Di}`);
                    layer.bindTooltip(tooltip).openTooltip();
                  }
                },
                // Hide label on mouseout if not selected
                mouseout: () => {
                  if (feature.properties.Section !== sectionFilter && currentZoom < ZOOM_LEVELS.SECTION) {
                    layer.unbindTooltip();
                  }
                },
              });
            }}
            />
            </LayersControl.Overlay>
        </LayerGroup>

           
          {/* Location Marker */}
          {lat && lng && (
            <Marker position={[lat, lng]}>
              <Popup>You are here.</Popup>
            </Marker>
          )}

          {/* Add Routing Control */}
          {routingDestination && lat && lng && (
            <RoutingControl
              from={[lat, lng]}
              to={routingDestination}
            />
          )}
          
        </LayersControl>
      </MapContainer>
    </div>
  );
}