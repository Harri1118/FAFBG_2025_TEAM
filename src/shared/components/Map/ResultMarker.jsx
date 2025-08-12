import { createTourPopupContent} from '../../shared/utils/popupUtils';
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
export { createOnEachTourFeature};