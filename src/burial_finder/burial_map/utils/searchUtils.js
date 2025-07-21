import L from 'leaflet';
import { TOURS } from './tourConfig'; 
/**
 * Enhanced search function that supports multiple search strategies
 * @param {Array} options - Array of searchable burial records
 * @param {string} searchInput - The user's search query
 * @returns {Array} Filtered array of matching burial records
 */
/**
   * Handles search input and selection
   */
  const ZOOM_LEVEL = 16; // Define a zoom level constant
  const handleSearch = (event, value, searchOptions, addToResults) => {
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
  };

  /**
   * Removes a burial from search results
   */
  const removeFromResults = (objectId, setSelectedBurials) => {
    setSelectedBurials(prev => prev.filter(burial => burial.OBJECTID !== objectId));
  };

  /**
   * Clears all search results
   */
  const clearSearch = (setSelectedBurials, setInputValue, setCurrentSelection) => {
    setSelectedBurials([]);
    setInputValue('');
    setCurrentSelection(null);
  };

  /**
   * Handles clicking on a search result item
   */
  const handleResultClick = (burial, index) => {
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
  };

  /**
   * Handles clicking on a marker
   */
  const handleMarkerClick = (burial, index) => {
    if (window.mapInstance) {
      const map = window.mapInstance;
      map.panTo([burial.coordinates[1], burial.coordinates[0]], {
        duration: 1.5
      });
    }
  };

  /**
   * Creates a marker cluster group with custom styling
   */
  const createClusterGroup = () => {
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
  };

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
export { 
  smartSearch,
  handleSearch,
  removeFromResults,
  clearSearch,
  handleResultClick,
  handleMarkerClick,
  createClusterGroup,
  ZOOM_LEVEL
};

