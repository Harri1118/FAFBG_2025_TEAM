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
  export default function SearchController(); {