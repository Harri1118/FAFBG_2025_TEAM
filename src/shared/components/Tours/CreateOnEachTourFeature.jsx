import { createTourPopupContent } from "shared/utils/helperFunctions";
/**
 * Creates event handlers for tour features
 * @param {string} tourKey - The key identifying the tour
 * @returns {Function} Event handler for the tour feature
 */
const CreateOnEachTourFeature = (tourKey) => (feature, layer) => {
  if (feature.properties && feature.properties.Full_Name) {
    const content = createTourPopupContent(feature, tourKey);
    layer.bindPopup(content, {
      maxWidth: 300,
      className: 'custom-popup'
    });
    feature.properties.title = tourKey;
  }
};
export default CreateOnEachTourFeature