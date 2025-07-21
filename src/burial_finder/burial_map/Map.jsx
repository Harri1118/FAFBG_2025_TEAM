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


import CustomZoomControl from './components/Map/ZoomControl';
import {DefaultExtentButton}from './components/Map/DefaultExtentButton';
import MapBounds from './components/Map/MapBounds';
import RoutingControl from './components/Map/RoutingControl';
import VectorBasemap from './components/Map/VectorBasemap';
import {createOnEachTourFeature} from './components/Map/ResultMarker';
import MapController from './components/Map/MapController';
import { TourFilter } from './components/Map/TourFilter';
import  SearchController from './components/Map/SearchController';


import { createMarkeIcon, createNumberedIcon} from './utils/markerUtils';
import { smartSearch } from './utils/searchUtils';
import { TOURS, TOUR_DATA} from './utils/tourConfig';
import { UNIQUE_SECTIONS } from './utils/mapUtils'; 
import { getImagePath } from './utils/getImagePath';
import { createIndepthpop} from './utils/popupUtils';
import {createTourMarker} from './utils/createTourMarker';
import {createUniqueKey} from './utils/createUniqueKey';
import MapTourController from './components/Map/MapTourController';
import { exteriorStyle, roadStyle } from './utils/mapUtils';
import { ZOOM_LEVELS, MARKER_COLORS, ZOOM_LEVEL, markerStyle } from './utils/mapConfig';

import { createClusterGroup } from './utils/clusterUtils';
import { createTourPopupContent } from './utils/tourConfig';

import useSearchOptions from './hooks/searchOptions';

 import filteredBurials from './hooks/filteredBurials';

// React and Core Dependencies
import { React, useState, useEffect, useMemo, useRef, useCallback, use } from "react";

// Leaflet and Map-related Dependencies
import { MapContainer, Popup, Marker, GeoJSON, LayersControl, LayerGroup, useMap } from "react-leaflet";
import L from 'leaflet';  // Core Leaflet library for map functionality
import "../../styling/index.css";
import 'leaflet.markercluster/dist/leaflet.markercluster';  // Clustering support for markers
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-routing-machine';  // Routing capabilities
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'lrm-graphhopper';  // GraphHopper routing integration
import * as turf from '@turf/turf';  // Geospatial calculations library
import { BasemapLayer } from 'react-esri-leaflet';  // ESRI basemap integration

// Material-UI Components and Icons
import { 
  Autocomplete, TextField, Paper, InputAdornment, IconButton,
  List, ListItem, ListItemText, Divider, Box, Typography,
  ButtonGroup, Button 
} from '@mui/material';
import PinDropIcon from '@mui/icons-material/PinDrop';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HomeIcon from '@mui/icons-material/Home';


// Local Data and Styles
import geo_burials from "../../data/Geo_Burials.json";
import ARC_Roads from "../../data/ARC_Roads.json";
import ARC_Boundary from "./utils/boundryData";
import ARC_Sections from "../../data/ARC_Sections.json";
import Sec75_Headstones from "../../data/Projected_Sec75_Headstones.json";
import Sec49_Headstones from "../../data/Projected_Sec49_Headstones.json";

// Tour Data Imports
import NotablesTour from "../../data/NotablesTour20.json";
import IndependenceTour from "../../data/IndependenceTour20.json";
import AfricanAmericanTour from "../../data/AfricanAmericanTour20.json";
import ArtistTour from "../../data/ArtistTour20.json";
import AssociationsTour from "../../data/AssociationsTour20.json";
import AuthorsTour from "../../data/AuthorsPublishersTour20.json";
import BusinessTour from "../../data/BusinessFinanceTour20.json";
import CivilWarTour from "../../data/CivilWarTour20.json";
import PillarsTour from "../../data/SocietyPillarsTour20.json";
import MayorsTour from "../../data/AlbanyMayors_fixed.json";
import GARTour from "../../data/GAR_fixed.json";
import injectCustomStyles from './utils/mapCustomStyle';












/**
 * Enhanced search function that supports multiple search strategies
 * @param {Array} options - Array of searchable burial records
 * @param {string} searchInput - The user's search query
 * @returns {Array} Filtered array of matching burial records
 */


  

//=============================================================================
// Data Structures
//=============================================================================

/**
 * Array of unique section numbers from the burial data
 * Sorted numerically with special handling for section 100A


 */




//=============================================================================
// Tour Components
//=============================================================================






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
export default function BurialMap() {

  const searchOptions = useSearchOptions(geo_burials);
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
  const markerClusterRef = useRef(null);

  //-----------------------------------------------------------------------------
  // Memoized Values
  //-----------------------------------------------------------------------------

  
  


  //-----------------------------------------------------------------------------
  // Event Handlers
  //-----------------------------------------------------------------------------

  /**
   * Handles user location tracking
   * Checks if user is within 5 miles of the cemetery
   */
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

  /**
   * Removes a burial from search results
   */
  const removeFromResults = useCallback((objectId) => {
    setSelectedBurials(prev => prev.filter(burial => burial.OBJECTID !== objectId));
  }, []);

  /**
   * Clears all search results
   */
  const clearSearch = useCallback(() => {
    setSelectedBurials([]);
    setInputValue('');
    setCurrentSelection(null);
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
   * Handles clicking on a marker
   */
  const handleMarkerClick = useCallback((burial, index) => {
    if (window.mapInstance) {
      const map = window.mapInstance;
      map.panTo([burial.coordinates[1], burial.coordinates[0]], {
        duration: 1.5
      });
    }
  }, []);

  /**
   * Creates a marker cluster group with custom styling
   */
  const createClusterGroup = useCallback(() => {
    return L.markerClusterGroup({
      maxClusterRadius: 70,
      disableClusteringAtZoom: 21,
      spiderfyOnMaxZoom: false,
      removeOutsideVisibleBounds: true,
      chunkedLoading: true,
      chunkInterval: 200,
      chunkDelay: 50,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="
            background-color: rgba(0,123,255,0.6);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
          ">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [30, 30]
        });
      }
    });
  }, []);

  //-----------------------------------------------------------------------------
  // Effects
  //-----------------------------------------------------------------------------

  /**
   * Cleanup geolocation watch on unmount
   */
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  useEffect(() => {
    injectCustomStyles();
  }, []);

  /**
   * Update filtered burials marker display
   */
  useEffect(() => {
    if (!window.mapInstance || !showAllBurials || !sectionFilter) return;

    if (markerClusterRef.current) {
      markerClusterRef.current.clearLayers();
      window.mapInstance.removeLayer(markerClusterRef.current);
    }

    const clusterGroup = createClusterGroup();
    markerClusterRef.current = clusterGroup;

    filteredBurials.forEach(burial => {
      const marker = L.circleMarker([burial.coordinates[1], burial.coordinates[0]], {
        ...markerStyle,
        radius: 6
      });

      const popupContent = createTourPopupContent(burial);

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      clusterGroup.addLayer(marker);
    });

    window.mapInstance.addLayer(clusterGroup);

    return () => {
      if (markerClusterRef.current) {
        window.mapInstance.removeLayer(markerClusterRef.current);
      }
    };
  }, [filteredBurials, showAllBurials, sectionFilter, createClusterGroup]);

  /**
   * Handle map zoom changes
   */
  const handleZoomEnd = useCallback((e) => {
    const map = e.target;
    setCurrentZoom(map.getZoom());
  }, []);

  useEffect(() => {
    if (!window.mapInstance) return;
    
    window.mapInstance.on('zoomend', handleZoomEnd);
    
    return () => {
      window.mapInstance.off('zoomend', handleZoomEnd);
    };
  }, [handleZoomEnd]);

  /**
   * Handle tour selection
   */
  const handleTourSelect = useCallback((tourName) => {
    setSelectedTour(tourName);
  }, []);

  //=============================================================================
  // Routing Functions
  //=============================================================================

  /**
   * Starts turn-by-turn navigation to a burial location
   * @param {Object} burial - The burial record to navigate to
   */
  const startRouting = (burial) => {
    if (!lat || !lng) {
      setStatus('Please enable location tracking first');
      return;
    }
    setRoutingDestination([burial.coordinates[1], burial.coordinates[0]]);
  };

  /**
   * Stops the current navigation
   */
  const stopRouting = () => {
    setRoutingDestination(null);
  };

  
  //=============================================================================
  // Map Layer Management
  //=============================================================================

  /**
   * Callback for handling section layer interactions
   */
  const onEachSection = useCallback((feature, layer) => {
    if (feature.properties && feature.properties.Section) {
      layer.on('mouseover', () => {
        layer.setStyle({ weight: 6 });
      });
      layer.on('mouseout', () => {
        layer.setStyle({ weight: 2 });
      });
      const list = `<dl><dt><b>Section ${feature.properties.Section}</b></dt></dl>`;
      layer.bindPopup(list);
    }
  }, []);

  /**
   * Create callbacks for tour feature interactions
   */
  const tourCallbacks = useMemo(() => {
    return TOUR_DATA.reduce((acc, { key }) => {
      acc[key] = createOnEachTourFeature(key);
      return acc;
    }, {});
  }, []);

  /**
   * Initialize GeoJSON layers and overlay maps
   */
 
        useEffect(() => {
          try {
            const newTourLayers = TOUR_DATA.reduce((acc, { key, data }) => {  
              const tourLayer = L.geoJSON(data, {
                constant, OverlayMaps = combineOverlayMaps(TOUR_DATA, newTourLayers, otherLayers),
                setOverlayMaps(newOverlayMaps){

              }, Catch (error) {
                console.error('Error loading GeoJSON data:', error);    
              }
              }, {tourCallbacks, onEachSection});

              filterOptions={(options, { inputValue }) => {
                return smartSearch(options, inputValue).slice(0, 100);
              }}
              
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
          
          {selectedBurials.length > 0 && (

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
        <MapBounds />
        <MapController selectedBurials={selectedBurials} hoveredIndex={hoveredIndex} />
        <MapTourController selectedTour={selectedTour} overlayMaps={overlayMaps} />
        <LayersControl>
          <BaseLayer checked name="Imagery">
            <VectorBasemap name="ImageryClarity" />
          </BaseLayer>
          <BaseLayer name="Streets">
            <VectorBasemap name="Streets" />
          </BaseLayer>
          <LayerGroup>
            <LayersControl.Overlay name="Roads">
              <GeoJSON data={ARC_Roads} style={roadStyle} />
            </LayersControl.Overlay>
          </LayerGroup>
          <LayerGroup>
            <LayersControl.Overlay checked name="Boundary">
              <GeoJSON data={ARC_Boundary} style={exteriorStyle} />
            </LayersControl.Overlay>
          </LayerGroup>
          <LayerGroup>
            <LayersControl.Overlay checked name="Sections">
              <GeoJSON 
                data={ARC_Sections}
                style={(feature) => ({
                  fillColor: feature.properties.Section === sectionFilter ? '#4a90e2' : '#f8f9fa',
                  fillOpacity: feature.properties.Section === sectionFilter ? 0.4 : 0.05,
                  color: feature.properties.Section === sectionFilter ? '#2c5282' : '#999',
                  weight: feature.properties.Section === sectionFilter ? 2 : 1
                })}
                onEachFeature={(feature, layer) => {
                  // Create tooltip but don't bind it yet
                  const tooltip = L.tooltip({
                    permanent: true,
                    direction: 'center',
                    className: 'section-label'
                  });
                  
                  layer.on({
                    click: (e) => {
                      // Only handle section click without checking hoveredMarker
                      setSectionFilter(feature.properties.Section);
                      if (!showAllBurials) {
                        setShowAllBurials(true);
                      }
                      // Zoom to section bounds with lower max zoom
                      const bounds = layer.getBounds();
                      window.mapInstance.fitBounds(bounds, {
                        padding: [50, 50],
                        maxZoom: 17  // Reduced from ZOOM_LEVELS.CLUSTER
                      });
                      
                      // Prevent event from propagating
                      L.DomEvent.stopPropagation(e);
                    },
                    // Show label on mouseover if not already selected
                    mouseover: () => {
                      if (feature.properties.Section !== sectionFilter && currentZoom < ZOOM_LEVELS.SECTION) {
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
                    // Update tooltip visibility on zoom
                    add: () => {
                      // Initial state - show if selected or zoomed in
                      if (feature.properties.Section === sectionFilter || currentZoom >= ZOOM_LEVELS.SECTION) {
                        tooltip.setContent(`Section ${feature.properties.Section_Di}`);
                        layer.bindTooltip(tooltip).openTooltip();
                      }
                    }
                  });

                  // Watch for zoom changes to update label visibility
                  if (window.mapInstance) {
                    window.mapInstance.on('zoomend', () => {
                      const zoom = window.mapInstance.getZoom();
                      if (zoom >= ZOOM_LEVELS.SECTION || feature.properties.Section === sectionFilter) {
                        tooltip.setContent(`Section ${feature.properties.Section_Di}`);
                        layer.bindTooltip(tooltip).openTooltip();
                      } else {
                        layer.unbindTooltip();
                      }
                    });
                  }
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
          
          {/* Search Result Markers - Always on top */}
          {selectedBurials.map((burial, index) => (
            <Marker 
              key={createUniqueKey(burial, index)}
              position={[burial.coordinates[1], burial.coordinates[0]]}
              icon={createNumberedIcon(index + 1, hoveredIndex === index)}
              eventHandlers={{
                mouseover: () => setHoveredIndex(index),
                mouseout: () => setHoveredIndex(null),
                click: () => handleMarkerClick(burial, index)
              }}
              zIndexOffset={1000}
            >
              <Popup>
                <div>
                  <h3>{burial.First_Name} {burial.Last_Name}</h3>
                  <p>Section: {burial.Section}</p>
                  <p>Lot: {burial.Lot}</p>
                  <p>Tier: {burial.Tier}</p>
                  <p>Grave: {burial.Grave}</p>
                  <p>Birth: {burial.Birth}</p>
                  <p>Death: {burial.Death}</p>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                    onClick={() => routingDestination ? stopRouting() : startRouting(burial)}
                    sx={{ mt: 1 }}
                  >
                    {routingDestination ? 'Stop Navigation' : 'Get Directions'}
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </LayersControl>
      </MapContainer>
    </div>
  );
}
