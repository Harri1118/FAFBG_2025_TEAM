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
import "assets/css/index.css";
import 'leaflet.markercluster/dist/leaflet.markercluster';  // Clustering support for markers
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-routing-machine';  // Routing capabilities
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'lrm-graphhopper';  // GraphHopper routing integration
import * as turf from '@turf/turf';  // Geospatial calculations library
import { BasemapLayer } from 'react-esri-leaflet';  // ESRI basemap integration
import TourGroup from "./components/Tour_Group";
import ToursGroupIterative from "./components/Tour_Group_Sec49"
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
import geo_burials from "shared/data/Geo_Burials.json";
import ARC_Roads from "shared/data/ARC_Roads.json";
import ARC_Boundary from "shared/data/ARC_Boundary.json";
import ARC_Sections from "shared/data/ARC_Sections.json";
import Sec75_Headstones from "shared/data/Projected_Sec75_Headstones.json";
import Sec49_Headstones from "shared/data/Projected_Sec49_Headstones.json";

// Tour Data Imports
import NotablesTour from "shared/data/NotablesTour20.json";
import IndependenceTour from "shared/data/IndependenceTour20.json";
import AfricanAmericanTour from "shared/data/AfricanAmericanTour20.json";
import ArtistTour from "shared/data/ArtistTour20.json";
import AssociationsTour from "shared/data/AssociationsTour20.json";
import AuthorsTour from "shared/data/AuthorsPublishersTour20.json";
import BusinessTour from "shared/data/BusinessFinanceTour20.json";
import CivilWarTour from "shared/data/CivilWarTour20.json";
import PillarsTour from "shared/data/SocietyPillarsTour20.json";
import MayorsTour from "shared/data/AlbanyMayors_fixed.json";
import GARTour from "shared/data/GAR_fixed.json";
import Lot7 from "shared/data/Projected_Sec75_Headstones.json"
import Tour_Group_Iterative from "./components/Tour_Group_Sec49";

import Modal from "./components/WebModal"
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

const TOURS = {
  Lot7: { name: "Soldier's Lot (Section 75, Lot 7)", color: '#7587ff' },
  Sec49: { name: "Section 49", color: '#75ff87' },
  Notable: { name: "Notables Tour 2020", color: '#ff7700' },
  Indep: { name: "Independence Tour 2020", color: '#7700ff' },
  Afr: { name: "African American Tour 2020", color: '#eedd00' },
  Art: { name: "Artists Tour 2020", color: '#ff4277' },
  Groups: { name: "Associations, Societies, & Groups Tour 2020", color: '#86cece' },
  AuthPub: { name: "Authors & Publishers Tour 2020", color: '#996038' },
  Business: { name: "Business & Finance Tour 2020", color: '#558e76' },
  CivilWar: { name: "Civil War Tour 2020", color: '#a0a0a0' },
  Pillars: { name: "Pillars of Society Tour 2020", color: '#d10008' },
  MayorsOfAlbany: { name: "Mayors of Albany", color: '#ff00dd' },
  GAR: { name: "Grand Army of the Republic", color: '#000080' }
};

const TOUR_DATA = [
  { key: 'Lot7', data: Sec75_Headstones, name: "Soldier's Lot (Section 75, Lot 7)" },
  { key: 'Sec49', data: Sec49_Headstones, name: "Section 49" },
  { key: 'Notable', data: NotablesTour, name: "Notables Tour 2020" },
  { key: 'Indep', data: IndependenceTour, name: "Independence Tour 2020" },
  { key: 'Afr', data: AfricanAmericanTour, name: "African American Tour 2020" },
  { key: 'Art', data: ArtistTour, name: "Artists Tour 2020" },
  { key: 'Groups', data: AssociationsTour, name: "Associations, Societies, & Groups Tour 2020" },
  { key: 'AuthPub', data: AuthorsTour, name: "Authors & Publishers Tour 2020" },
  { key: 'Business', data: BusinessTour, name: "Business & Finance Tour 2020" },
  { key: 'CivilWar', data: CivilWarTour, name: "Civil War Tour 2020" },
  { key: 'Pillars', data: PillarsTour, name: "Pillars of Society Tour 2020" },
  { key: 'MayorsOfAlbany', data: MayorsTour, name: "Mayors of Albany" },
  { key: 'GAR', data: GARTour, name: "Grand Army of the Republic" }
];


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
 * Creates a unique key for a burial record
 * @param {Object} burial - The burial record object
 * @param {number} index - The index of the burial in the list
 * @returns {string} A unique identifier string
 */
const createUniqueKey = (burial, index) => {
  return `${burial.OBJECTID}_${burial.Section}_${burial.Lot}_${burial.Grave}_${index}`;
};
/**
 * Style configuration for cemetery roads
 */
const roadStyle = {
  color: '#000000',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.1
};

/**
 * Array of unique section numbers from the burial data
 * Sorted numerically with special handling for section 100A
 */
const UNIQUE_SECTIONS = Array.from(new Set(geo_burials.features.map(f => f.properties.Section))).sort((a, b) => {
  if (a === '100A') return 1;
  if (b === '100A') return -1;
  return a - b;
});

/**
 * Component for filtering and selecting cemetery tours
 */
function TourFilter({ overlayMaps, setShowAllBurials, onTourSelect }) {
  return (
    <Autocomplete
      options={TOUR_DATA}
      getOptionLabel={(option) => option.name}
      onChange={(event, newValue) => {
        setShowAllBurials(true);
        const tourName = newValue ? newValue.name : null;
        onTourSelect(tourName);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tour"
          size="small"
          fullWidth
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Box
            component="span"
            sx={{
              width: 14,
              height: 14,
              mr: 1,
              borderRadius: '50%',
              backgroundColor: TOURS[option.key].color,
              display: 'inline-block'
            }}
          />
          {option.name}
        </li>
      )}
    />
  );
}
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

const smartSearch = (options, searchInput) => {
  const input = searchInput.toLowerCase().trim();
  if (!input) return [];

  // Year search (4 digits)
  const yearPattern = /^\d{4}$/;
  if (yearPattern.test(input)) {
    return options.filter(option => 
      (option.Birth && option.Birth.includes(input)) ||
      (option.Death && option.Death.includes(input))
    );
  }

  // Section search (e.g., "section 1" or "sec 1")
  const sectionPattern = /^(section|sec)\s*([a-zA-Z0-9]+)$/i;
  const sectionMatch = input.match(sectionPattern);
  if (sectionMatch) {
    const sectionQuery = sectionMatch[2];
    return options.filter(option => 
      option.Section && option.Section.toString().toLowerCase() === sectionQuery.toLowerCase()
    );
  }

  // Lot search (e.g., "lot 123")
  const lotPattern = /^lot\s*(\d+)$/i;
  const lotMatch = input.match(lotPattern);
  if (lotMatch) {
    const lotQuery = lotMatch[1];
    return options.filter(option => 
      option.Lot && option.Lot.toString() === lotQuery
    );
  }

  // Tour search by name (e.g., "notable tour", "civil war tour")
  const tourPattern = /^(.*?)\s*tour$/i;
  const tourMatch = input.match(tourPattern);
  if (tourMatch) {
    const tourQuery = tourMatch[1].toLowerCase();
    return options.filter(option => {
      if (!option.title) return false;
      const tourName = TOURS[option.title]?.name.toLowerCase() || '';
      return tourName.includes(tourQuery);
    });
  }

  // Tour search by keyword
  const tourKeywords = Object.values(TOURS).map(tour => tour.name.toLowerCase());
  const matchesTour = tourKeywords.some(keyword => keyword.includes(input));
  if (matchesTour) {
    return options.filter(option => {
      if (!option.title) return false;
      const tourName = TOURS[option.title]?.name.toLowerCase() || '';
      return tourName.includes(input);
    });
  }

  // Numeric search (section, lot, or year)
  const numberPattern = /^\d+$/;
  if (numberPattern.test(input)) {
    return options.filter(option => 
      (option.Section && option.Section.toString() === input) ||
      (option.Lot && option.Lot.toString() === input) ||
      (option.Birth && option.Birth.includes(input)) ||
      (option.Death && option.Death.includes(input))
    );
  }

  // Default name search
  return options.filter(option => {
    const nameMatch = option.searchableLabel.toLowerCase().includes(input);
    const tourMatch = option.title && TOURS[option.title]?.name.toLowerCase().includes(input);
    return nameMatch || tourMatch;
  });
};



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
 * Component that manages map state and provides access to the map instance
 */
function MapController({ selectedBurials, hoveredIndex }) {
  const map = useMap();
  
  useEffect(() => {
    // Store the map instance globally for external access
    window.mapInstance = map;
  }, [map]);
  
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
   const [selectedBurials, setSelectedBurials] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null);
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
  
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Component References
  const { BaseLayer } = LayersControl;

    useEffect(() => {
        document.title = "Tours Navigator";
      }, []);
   /**
     * Handle tour selection
     */
    const handleTourSelect = useCallback((tourName) => {
      setSelectedTour(tourName);
    }, []);
  
      /**
       * Handles clicking on a search result item
       */
      const handleResultClick = useCallback((burial, index) => {
        if (window.mapInstance) {
          const map = window.mapInstance;
          map.flyTo(
            [burial.coordinates[1], burial.coordinates[0]],
            ZOOM_LEVEL,
            {
              duration: 1.5,
              easeLinearity: 0.25
            }
          );
        }
      }, []);

        /**
         * Removes a burial from search results
         */
        const removeFromResults = useCallback((objectId) => {
          setSelectedBurials(prev => prev.filter(burial => burial.OBJECTID !== objectId));
        }, []);
    /**
   * Handles adding a burial to the search results
   */
  const addToResults = useCallback((burial) => {
    if (burial && !selectedBurials.some(b => b.OBJECTID === burial.OBJECTID)) {
      setSelectedBurials(prev => [...prev, burial]);
      setCurrentSelection(null);
      setInputValue('');
      
      if (window.mapInstance) {
        window.mapInstance.panTo([burial.coordinates[1], burial.coordinates[0]], {
          duration: 1.5
        });
      }
    }
  }, [selectedBurials]);

  const searchOptions = useMemo(() => 
      geo_burials.features.map(feature => ({
        label: `${feature.properties.First_Name} ${feature.properties.Last_Name}`,
        searchableLabel: `${feature.properties.First_Name} ${feature.properties.Last_Name} (Section ${feature.properties.Section}, Lot ${feature.properties.Lot})`,
        key: `${feature.properties.OBJECTID}_${feature.properties.First_Name}_${feature.properties.Last_Name}_Section${feature.properties.Section}_Lot${feature.properties.Lot}`,
        ...feature.properties,
        coordinates: feature.geometry.coordinates
      })).filter(option => option.First_Name || option.Last_Name)
    , []);
  
      /**
       * Handles search input and selection
       */
      const handleSearch = useCallback((event, value) => {
        if (value) {
          if (typeof value === 'string') {
            const matches = smartSearch(searchOptions, value);
            if (matches.length > 0) {
              addToResults(matches[0]);
            }
          } else {
            addToResults(value);
          }
        }
      }, [searchOptions, addToResults]);
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
        top: '250px',
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

    /**
     * Clears all search results
     */
    const clearSearch = useCallback(() => {
      setSelectedBurials([]);
      setInputValue('');
      setCurrentSelection(null);
    }, []);
  const onSearchButton = (e) => {
      e.preventDefault();
      const val = document.getElementById("searchButtonTextInp").value   
      console.log(val)
  };

  function SearchButton(){
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
    {!showSearchBar? (
      <IconButton>
        <SearchIcon onClick={() => setShowSearchBar(true)}/>
      </IconButton>
    ) : (
      <div>
      <input type="text" id="searchButtonTextInp" placeholder="Search..." onChange={onSearchButton}/>
      <SearchIcon onClick={() => setShowSearchBar(false)}/>
      </div>
    )
    }
    </Paper>
    
    )
  }
  return (
    <div className="map-container">
      <Paper 
        elevation={3}
        className="left-sidebar"
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Autocomplete
              freeSolo
              options={searchOptions}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.searchableLabel || '';
              }}
              onChange={handleSearch}
              value={currentSelection || null}
              inputValue={inputValue}
              onInputChange={(event, newInputValue, reason) => {
                setInputValue(newInputValue);
                if (reason === 'clear') {
                  setCurrentSelection(null);
                }
              }}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search by name, year, section, tour..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              filterOptions={(options, { inputValue }) => {
                return smartSearch(options, inputValue).slice(0, 100);
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.key}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body1">
                      {option.First_Name} {option.Last_Name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Section {option.Section}, Lot {option.Lot}
                        {option.Birth && ` • Born ${option.Birth}`}
                        {option.Death && ` • Died ${option.Death}`}
                      </Typography>
                      {option.title && (
                        <Typography 
                          variant="body2"
                          sx={{
                            color: 'white',
                            backgroundColor: TOURS[option.title]?.color || 'grey',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            ml: 'auto'
                          }}
                        >
                          {TOURS[option.title]?.name || option.title}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </li>
              )}
            />
            {currentSelection && (
              <IconButton 
                onClick={() => addToResults(currentSelection)}
                color="primary"
                size="small"
                sx={{ alignSelf: 'center' }}
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
          
          {/* Section Filter */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by Section
            </Typography>
            <Autocomplete
              options={UNIQUE_SECTIONS}
              value={sectionFilter || null}
              onChange={(event, newValue) => {
                setSectionFilter(newValue || '');
                if (newValue && !showAllBurials) {
                  setShowAllBurials(true);
                }
                if (newValue && window.mapInstance) {
                  // Find the section in ARC_Sections and zoom to it
                  const section = ARC_Sections.features.find(f => f.properties.Section === newValue);
                  if (section) {
                    const layer = L.geoJSON(section);
                    const bounds = layer.getBounds();
                    window.mapInstance.fitBounds(bounds, {
                      padding: [50, 50],
                      maxZoom: ZOOM_LEVELS.CLUSTER
                    });
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Section"
                  size="small"
                  fullWidth
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  Section {option}
                </li>
              )}
              getOptionLabel={(option) => `Section ${option}`}
              isOptionEqualToValue={(option, value) => option === value}
            />
          </Box>

          {/* Show All Burials Toggle - Only show when a section is selected */}
          {sectionFilter && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant={showAllBurials ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                fullWidth
                onClick={() => setShowAllBurials(!showAllBurials)}
                startIcon={showAllBurials ? <RemoveIcon /> : <AddIcon />}
              >
                {showAllBurials ? 'Hide Section Burials' : 'Show Section Burials'}
              </Button>
            </Box>
          )}

          {/* Filters - only shown when a section is selected */}
          {sectionFilter && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Filter Section {sectionFilter} Burials
              </Typography>
              
              {/* Lot/Tier Toggle */}
              <ButtonGroup 
                fullWidth 
                size="small" 
                sx={{ mt: 1 }}
              >
                <Button
                  variant={filterType === 'lot' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('lot')}
                >
                  Lot
                </Button>
                <Button
                  variant={filterType === 'tier' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('tier')}
                >
                  Tier
                </Button>
              </ButtonGroup>
              
              {/* Lot/Tier Filter */}
              <TextField
                fullWidth
                size="small"
                label={filterType === 'lot' ? 'Lot Number' : 'Tier Number'}
                value={lotTierFilter}
                onChange={(e) => setLotTierFilter(e.target.value)}
                margin="dense"
              />
              
              {/* Clear Filters */}
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => {
                  setLotTierFilter('');
                  setFilterType('lot');
                  setSectionFilter('');
                  setShowAllBurials(false);
                  // Reset map view to original bounds
                  if (window.mapInstance) {
                    const bounds = turf.bbox(ARC_Boundary.features[0]);
                    const padding = 0.01; // roughly 1km in decimal degrees
                    const southWest = [bounds[1] - padding, bounds[0] - padding];
                    const northEast = [bounds[3] + padding, bounds[2] + padding];
                    window.mapInstance.fitBounds([southWest, northEast]);
                  }
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
          
          {/* Tour Filter */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by Tour
            </Typography>
            <TourFilter 
              overlayMaps={overlayMaps} 
              setShowAllBurials={setShowAllBurials} 
              onTourSelect={handleTourSelect}
            />
          </Box>
          
          {/* Location Button */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button 
              onClick={onLocateMarker} 
              variant='contained' 
              color='secondary' 
              size='small' 
              startIcon={<PinDropIcon />}
              sx={{ flex: 1 }}
            >
              {status}
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Search Results */}
        {selectedBurials.length > 0 && (
          <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Search Results ({selectedBurials.length})</Typography>
              <IconButton onClick={clearSearch} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <List>
              {selectedBurials.map((burial, index) => (
                <ListItem 
                  key={createUniqueKey(burial, index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleResultClick(burial, index)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: hoveredIndex === index ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="remove" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromResults(burial.OBJECTID);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Box
                    sx={{
                      width: hoveredIndex === index ? '32px' : '24px',
                      height: hoveredIndex === index ? '32px' : '24px',
                      borderRadius: '50%',
                      backgroundColor: MARKER_COLORS[index % MARKER_COLORS.length],
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 1,
                      fontWeight: 'bold',
                      fontSize: hoveredIndex === index ? '16px' : '14px',
                      border: hoveredIndex === index ? '3px solid white' : '2px solid white',
                      boxShadow: hoveredIndex === index ? '0 0 8px rgba(0,0,0,0.6)' : '0 0 4px rgba(0,0,0,0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {index + 1}
                  </Box>
                  <ListItemText
                    primary={`${burial.First_Name} ${burial.Last_Name}`}
                    secondary={
                      <Box component="span">
                        <Typography component="span" variant="body2" display="block">Section: {burial.Section}</Typography>
                        <Typography component="span" variant="body2" display="block">Lot: {burial.Lot}</Typography>
                        <Typography component="span" variant="body2" display="block">Tier: {burial.Tier}</Typography>
                        <Typography component="span" variant="body2" display="block">Grave: {burial.Grave}</Typography>
                        <Typography component="span" variant="body2" display="block">Birth: {burial.Birth}</Typography>
                        <Typography component="span" variant="body2" display="block">Death: {burial.Death}</Typography>
                        {burial.title && (
                          <Typography 
                            component="span" 
                            variant="body2" 
                            display="block"
                            sx={{
                              mt: 1,
                              color: 'white',
                              backgroundColor: TOURS[burial.title]?.color || 'grey',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: 'inline-block'
                            }}
                          >
                            {TOURS[burial.title]?.name || burial.title}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
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
        <SearchButton/>
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

            <TourGroup data={Lot7} color="#7587ff" tourGroup="Soldiers Lot (Section 75, Lot 7)" keyWord="Lot7" />
            {/* <TourGroup data={Sec49_Headstones} color="#75ff87" tourGroup="Mayors of Albany"/> */}
            <ToursGroupIterative/>
            <TourGroup data={NotablesTour} color="#ff7700" tourGroup="Notables Tour 2020" keyWord="Notable" />
            <TourGroup data={IndependenceTour} color="#7700ff" tourGroup="Independence Tour 2020" keyWord="Indep" />
            <TourGroup data={AfricanAmericanTour} color="#eedd00" tourGroup="African American Tour 2020" keyWord="Afr" />
            <TourGroup data={ArtistTour} color="#ff4277" tourGroup="Artists Tour 2020" keyWord="Art"/>
            <TourGroup data={AssociationsTour} color="#86cece" tourGroup="Associations, Societies, & Groups Tour 2020" keyWord="Groups"/>
            <TourGroup data={AuthorsTour} color="#996038" tourGroup="Authors & Publishers Tour 2020" keyWord="AuthPub" /> 
            <TourGroup data={BusinessTour} color="#558e76" tourGroup="Business & Finance Tour 2020" keyWord="Business" /> 
            <TourGroup data={CivilWarTour} color="#a0a0a0" tourGroup="Civil War Tour 2020" keyWord="CivilWar" />
            <TourGroup data={PillarsTour} color="#d10008" tourGroup="Pillars of Society Tour 2020" keyWord="Pillars" />
            <TourGroup data={MayorsTour} color="#ff00dd" tourGroup="Mayors of Albany" keyWord="Mayors of Albany" />
            <TourGroup data={GARTour} color="#000080" tourGroup="Grand Army of the Republic" keyWord="G A R" />
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