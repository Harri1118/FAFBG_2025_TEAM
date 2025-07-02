import  geo_burials  from '../../../data/Geo_Burials.json';
import { createTourPopupContent } from './popupUtils';


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
 * Creates event handlers for tour features
 * @param {string} tourKey - The key identifying the tour
 * @returns {Function} Event handler for the tour feature
 */
const createOnEachTourFeature = (tourKey) => (feature, layer) => {
  if (feature.properties && feature.properties.Full_Name) {
    const content = createTourPopupContent(feature, tourKey);
    layer.bindPopup(content, {
      maxWidth: 300,
      className: 'custom-popup'
    });
    feature.properties.title = tourKey;
  }
}; 
export { UNIQUE_SECTIONS, createOnEachTourFeature };

export const exteriorStyle = {
  color: '#000',
  weight: 1,
  opacity: 0.5,
  fillOpacity: 0.1,
  fillColor: '#000',
};

export const roadStyle = {
  color: '#000',
  weight: 1,
  opacity: 0.5,
  fillOpacity: 0.1,
  fillColor: '#000',
}; 