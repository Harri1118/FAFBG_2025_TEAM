import { Autocomplete, Box, IconButton, Button, Paper, TextField, Typography, InputAdornment, ListItem, List, Divider, ListItemText, ButtonGroup } from "@mui/material";
// import LocationButton from "./LocationButton";
import SearchIcon from '@mui/icons-material/Search';
 import L from 'leaflet';  // Core Leaflet library for map functionality
 import {ZOOM_LEVELS, TOURS, DEFAULT_ZOOM_LEVEL} from '../../utils/constants'
import { useCallback, useEffect, useMemo, useState } from "react";
 import { createUniqueKey, smartSearch } from "../../utils/helperFunctions";
import geo_burials from '../../../../data/Geo_Burials.json'
 import { UNIQUE_SECTIONS } from "../../utils/data_structs";
 import { MARKER_COLORS } from "../../utils/constants";
 import AddIcon from '@mui/icons-material/Add';
 import ARC_Boundary from "../../../../data/ARC_Boundary.json"
 import ARC_Sections from "../../../../data/ARC_Sections.json";
// import CloseIcon from '@mui/icons-material/Close';
 import RemoveIcon from '@mui/icons-material/Remove';
import TourFilter from "../Tour/TourFilter";
import CloseIcon from '@mui/icons-material/Close';
import * as turf from '@turf/turf';  // Geospatial calculations library
import PinDropIcon from '@mui/icons-material/PinDrop';

const SearchBurials = ({selectedBurials: refSelectedBurials, selectedTour: refSelectedTour, hoveredIndex: refHoveredIndex, showAllBurials: refShowAllBurials, lat:refLat, lng:refLng, sectionFilter: refSectionFilter, overlayMaps: refOverlayMaps, updateSelectedBurials, updateSelectedTour, includesTour, updateSectionFilter, updateShowAllBurials, window}) => {
        const [inputValue, setInputValue] = useState('');
      const [selectedBurials, setSelectedBurials] = useState(refSelectedBurials);
      const [currentSelection, setCurrentSelection] = useState(null);
       const [sectionFilter, setSectionFilter] = useState(refSectionFilter);
       const [showAllBurials, setShowAllBurials] = useState(refShowAllBurials);
        const [lotTierFilter, setLotTierFilter] = useState('');
       const [filterType, setFilterType] = useState('lot');
        const [overlayMaps, setOverlayMaps] = useState(refOverlayMaps);
         const [selectedTour, setSelectedTour] = useState(refSelectedTour);
           const [lat, setLat] = useState(refLat);
           const [lng, setLng] = useState(refLng);
           const [watchId, setWatchId] = useState(null);
           const [status, setStatus] = useState('Find me');
           const [hoveredIndex, setHoveredIndex] = useState(refHoveredIndex);
            
          /**
         * Create searchable options from burial data
         * Includes name, section, lot, and tour information
         */
        const searchOptions = useMemo(() => 
          geo_burials.features.map(feature => ({
            label: `${feature.properties.First_Name} ${feature.properties.Last_Name}`,
            searchableLabel: `${feature.properties.First_Name} ${feature.properties.Last_Name} (Section ${feature.properties.Section}, Lot ${feature.properties.Lot})`,
            key: `${feature.properties.OBJECTID}_${feature.properties.First_Name}_${feature.properties.Last_Name}_Section${feature.properties.Section}_Lot${feature.properties.Lot}`,
            ...feature.properties,
            coordinates: feature.geometry.coordinates
          })).filter(option => option.First_Name || option.Last_Name)
        , 
        []);

          /**
           * Handle tour selection
           */
          const handleTourSelect = useCallback((tourName) => {
            setSelectedTour(tourName);
            updateSelectedTour(tourName);
          }, []);

            /**
             * Handles clicking on a search result item
             */
            const handleResultClick = useCallback((burial, index) => {
              if (window.mapInstance) {
                const map = window.mapInstance;
                map.flyTo(
                  [burial.coordinates[1], burial.coordinates[0]],
                  DEFAULT_ZOOM_LEVEL,
                  {
                    duration: 1.5,
                    easeLinearity: 0.25
                  }
                );
              }
            }, []);
               /**
     * Clears all search results
     */
    const clearSearch = useCallback(() => {
      setSelectedBurials([]);
      updateSelectedBurials([])
      setInputValue('');
      setCurrentSelection(null);
    }, []);

   /**
     * Handles adding a burial to the search results
     */
    const addToResults = useCallback((burial) => {
      if (burial && !selectedBurials.some(b => b.OBJECTID === burial.OBJECTID)) {
        setSelectedBurials(prev => [...prev, burial]);
        updateSelectedBurials(prev => [...prev,burial]);
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
      updateSelectedBurials(prev => prev.filter(burial => burial.OBJECTID !== objectId));
    }, []);

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

  return(
    <div>
         <Paper 
        elevation={3}
        className="left-sidebar"
      >

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Autocomplete
            freeSolo
            options={searchOptions}
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
                updateSectionFilter(newValue || '')
                
                if (newValue && !showAllBurials) {
                  setShowAllBurials(true);
                  updateShowAllBurials(true)
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
                onClick={() => {setShowAllBurials(!showAllBurials)
                updateShowAllBurials(!showAllBurials)}
                }
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
                  updateSectionFilter(sectionFilter)
                  setShowAllBurials(false);
                  updateShowAllBurials(false)
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
          { includesTour == true && 
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by Tour
            </Typography>
            <TourFilter 
              overlayMaps={overlayMaps} 
              setShowAllBurials={setShowAllBurials} 
              updateShowAllBurials={updateShowAllBurials}
              onTourSelect={handleTourSelect}
            />
          </Box>
            }
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
        <Divider/>
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
        </div>
  )
}
export default SearchBurials;