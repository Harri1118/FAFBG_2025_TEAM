/**
 * Component that manages the visibility of tour layers on the map
 */
function MapTourController({ selectedTour, overlayMaps }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !overlayMaps) return;

    // Remove all tour layers first
    TOUR_DATA.forEach(({ name }) => {
      const layer = overlayMaps[name];
      if (layer) {
        map.removeLayer(layer);
      }
    });

    // Add only the selected tour layer if it exists
    if (selectedTour) {
      const layer = overlayMaps[selectedTour];
      if (layer) {
        map.addLayer(layer);
      }
    }
  }, [map, selectedTour, overlayMaps]);
  
  return null;
}
export const MapTourController;