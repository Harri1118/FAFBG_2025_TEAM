import { MARKER_COLORS, TOURS } from "./constants.js";
import L from 'leaflet';  // Core Leaflet library for map functionality
/**
 * Creates a numbered marker icon for search results
 * @param {number} number - The number to display in the marker
 * @param {boolean} isHighlighted - Whether the marker should be highlighted
 * @returns {L.DivIcon} A Leaflet div icon configured with the specified number and styling
 */
const createNumberedIcon = (number, isHighlighted = false) => {
  const colorIndex = (number - 1) % MARKER_COLORS.length;
  const color = MARKER_COLORS[colorIndex];
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: ${isHighlighted ? '32px' : '24px'};
        height: ${isHighlighted ? '32px' : '24px'};
        border-radius: 50%;
        border: ${isHighlighted ? '3px' : '2px'} solid white;
        box-shadow: ${isHighlighted ? '0 0 8px rgba(0,0,0,0.6)' : '0 0 4px rgba(0,0,0,0.4)'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${isHighlighted ? '16px' : '14px'};
        transition: all 0.2s ease;
      ">
        ${number}
      </div>
    `,
    iconSize: [isHighlighted ? 32 : 24, isHighlighted ? 32 : 24],
    iconAnchor: [isHighlighted ? 16 : 12, isHighlighted ? 16 : 12],
    popupAnchor: [0, isHighlighted ? -16 : -12]
  });
};

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
 * Gets the image path for a burial record's photo
 * @param {string} imageName - The name of the image file
 * @returns {string} The complete URL path to the image
 */
const getImagePath = (imageName) => {
  if (!imageName || imageName === "NONE") return 'https://www.albany.edu/arce/images/no-image.jpg';
  
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8000/src/data/images/${imageName}`;
  }
  return `https://www.albany.edu/arce/images/${imageName}`;
};

/**
 * Creates a marker for a tour point
 * @param {string} tourKey - The key identifying the tour
 * @returns {Function} A function that creates a Leaflet marker or circle marker
 */
const createTourMarker = (tourKey) => {
  const tourInfo = TOURS[tourKey];
  if (!tourInfo) return null;

  return (feature, latlng) => {
    if (feature.geometry.type === 'Point') {
      const icon = L.divIcon({
        className: 'tour-marker',
        html: `<div style="
          width: 12px;
          height: 12px;
          background-color: ${tourInfo.color};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      return L.marker(latlng, { icon });
    }
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: tourInfo.color,
      color: '#ffffff',
      weight: 2,
      opacity: 0.9,
      fillOpacity: 0.7
    });
  };
};

/**
 * Creates HTML content for a tour point popup
 * @param {Object} feature - The GeoJSON feature containing burial information
 * @param {string} tourKey - The key identifying the tour
 * @returns {string} HTML content for the popup
 */
const createTourPopupContent = (feature, tourKey) => {
  let content = `<dl class="popup-content">`;
  
  content += `<dt><b>${feature.properties.Full_Name}</b></dt><hr>`;
  
  if (feature.properties.Titles) {
    content += `<dt>${feature.properties.Titles}</dt>`;
  }
  
  content += `<dt>(Click image to view detailed biography)</dt>`;
  
  if (feature.properties.Bio_Portra && feature.properties.Bio_Portra !== "NONE") {
    content += `
      <dt>
        <a href="https://www.albany.edu/arce/${feature.properties.Tour_Bio}.html" target="_blank">
          <img 
            src="${getImagePath(feature.properties.Bio_Portra)}"
            style="max-width:200px; max-height:200px; border:2px solid #ccc; border-radius:4px; margin:8px 0;"
            loading="lazy"
            onerror="this.onerror=null; this.src='https://www.albany.edu/arce/images/no-image.jpg';"
          />
        </a>
      </dt>`;
  }
  
  content += '</dl>';
  return content;
};

/**
 * Enhanced search function that supports multiple search strategies
 * @param {Array} options - Array of searchable burial records
 * @param {string} searchInput - The user's search query
 * @returns {Array} Filtered array of matching burial records
 */
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
export {createNumberedIcon, createUniqueKey, getImagePath, createTourMarker, createTourPopupContent, smartSearch}