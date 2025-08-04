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
//import "../../index.css";
import 'leaflet.markercluster/dist/leaflet.markercluster';  // Clustering support for markers
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-routing-machine';  // Routing capabilities
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'lrm-graphhopper';  // GraphHopper routing integration
import * as turf from '@turf/turf';  // Geospatial calculations library

// Material-UI Components and Icons
import { 
  Autocomplete, TextField, Paper, InputAdornment, IconButton,
  List, ListItem, ListItemText, Divider, Box, Typography,
  ButtonGroup, Button 
} from '@mui/material';
import PinDropIcon from '@mui/icons-material/PinDrop';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';

// Local Data and Styles
import geo_burials from "../../data/Geo_Burials.json";
import ARC_Roads from "../../data/ARC_Roads.json";
import ARC_Boundary from "../../data/ARC_Boundary.json";
import ARC_Sections from "../../data/ARC_Sections.json";

// Constants
import {DEFAULT_ZOOM_LEVEL, ZOOM_LEVELS, MARKER_COLORS, TOURS} from '../burial_map/utils/constants'

// Components
import CustomZoomControl from '../burial_map/components/Map/ZoomControl';
import MapBounds from '../burial_map/components/Map/MapBounds'
import VectorBasemap from "./components/Map/VectorBasemap";
import MapController from "./components/Map/MapController";
import DefaultExtentButton from "./components/Map/DefaultExtentButton";
import RoutingControl from "./components/Map/RoutingControl"

// Tour components
import TourFilter from './components/Tour/TourFilter'
import MapTourController from "./components/Tour/MapTourController";
import CreateOnEachTourFeature from "./components/Tour/CreateOnEachTourFeature";

// Helper functions
import {createNumberedIcon, createUniqueKey, getImagePath, createTourMarker, createTourPopupContent, smartSearch} from "../burial_map/utils/helperFunctions"

// Data structures
import { UNIQUE_SECTIONS, TOUR_DATA } from "./utils/data_structs";
import SearchBurials from "./components/Map/SearchBurials";

// Memoized Values
// import searchOptionsMemo from "./utils/memoizedValues";

// Event Handlers
//import onLocateMarker from "./utils/eventHandlers";
/**
 * Style configuration for the cemetery boundary
 */
const exteriorStyle = {
  color: "#ffffff",
  weight: 1.5,
  fillOpacity: .08
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
 * Default style for burial markers
 */
const markerStyle = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};


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

 

  /**
   * Filter burials based on section/lot/tier criteria
   */
  const filteredBurials = useMemo(() => {
    if (!showAllBurials || !sectionFilter) return [];
    
    return geo_burials.features.filter(feature => {
      const props = feature.properties;
      
      if (props.Section !== sectionFilter) {
        return false;
      }
      
      if (lotTierFilter) {
        if (filterType === 'lot' && props.Lot !== lotTierFilter) {
          return false;
        }
        if (filterType === 'tier' && props.Tier !== lotTierFilter) {
          return false;
        }
      }
      
      return true;
    }).map(feature => ({
      ...feature.properties,
      coordinates: feature.geometry.coordinates
    }));
  }, [showAllBurials, sectionFilter, lotTierFilter, filterType]);

  //-----------------------------------------------------------------------------
  // Event Handlers
  //-----------------------------------------------------------------------------



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

  /**
   * Add custom CSS styles for markers and clusters
   */
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup {
        max-width: 300px !important;
      }
      
      .custom-popup img {
        display: block;
        max-width: 200px;
        max-height: 200px;
        margin: 8px auto;
        border: 2px solid #ccc;
        border-radius: 4px;
      }
      
      .marker-cluster {
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        margin-top: -20px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        color: #fff;
        text-shadow: 0 0 2px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .tour-marker {
        transition: all 0.3s ease;
      }
      
      .tour-marker:hover {
        transform: scale(1.2);
      }
      
      .tour-marker div {
        transition: all 0.3s ease;
      }
      
      .tour-marker:hover div {
        transform: scale(1.2);
        box-shadow: 0 0 8px rgba(0,0,0,0.6);
      }
      
      .custom-cluster {
        background: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
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

      const popupContent = `
        <div class="custom-popup">
          <h3>${burial.First_Name} ${burial.Last_Name}</h3>
          <p>Section: ${burial.Section}</p>
          <p>Lot: ${burial.Lot}</p>
          <p>Tier: ${burial.Tier}</p>
          <p>Grave: ${burial.Grave}</p>
          <p>Birth: ${burial.Birth}</p>
          <p>Death: ${burial.Death}</p>
        </div>
      `;

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
      acc[key] = CreateOnEachTourFeature(key);
      return acc;
    }, {});
  }, []);

  /**
   * Initialize GeoJSON layers and overlay maps
   */
  useEffect(() => {
    try {
      // Create tour layers
      const newTourLayers = TOUR_DATA.reduce((acc, { key, data }) => {
        acc[key] = L.geoJSON(data, {
          pointToLayer: createTourMarker(key),
          onEachFeature: tourCallbacks[key]
        });
        return acc;
      }, {});

      // Create base layers
      const otherLayers = {
        boundary: L.geoJSON(ARC_Boundary, { style: exteriorStyle }),
        roads: L.geoJSON(ARC_Roads, { style: roadStyle }),
        sections: L.geoJSON(ARC_Sections, { onEachFeature: onEachSection })
      };

      // Combine all layers
      const newOverlayMaps = {
        ...TOUR_DATA.reduce((acc, { key, name }) => {
          acc[name] = newTourLayers[key];
          return acc;
        }, {}),
        "Albany Rural Cemetery Boundary": otherLayers.boundary,
        "Albany Rural Cemetery Roads": otherLayers.roads,
        "Section Boundaries": otherLayers.sections
      };

      setOverlayMaps(newOverlayMaps);
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
    }
  }, [tourCallbacks, onEachSection]);

  return (
    <div className="map-container">
      {/* Left sidebar with search and filters */}
      <SearchBurials 
      selectedBurials={selectedBurials}
      updateSelectedBurials={setSelectedBurials}
      updateSelectedTour={setSelectedTour}
      hoveredIndex={hoveredIndex}
      showAllBurials={showAllBurials}
      refLat={lat}
      refLng={lng}
      sectionFilter={sectionFilter}
      updateSectionFilter={setSectionFilter}
      overlayMaps={overlayMaps}
      includesTour={true}
      />

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
        <MapTourController data={TOUR_DATA} selectedTour={selectedTour} overlayMaps={overlayMaps} />
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