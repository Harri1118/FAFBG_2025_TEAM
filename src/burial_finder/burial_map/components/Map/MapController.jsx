import { useMap } from "react-leaflet";
import { useEffect } from "react";
/**
 * Component that manages map state and provides access to the map instance
 */
function MapController({ selectedBurials, hoveredIndex }) {
  const map = useMap();
  
  useEffect(() => {
    // Store the map instance globally for external access
    window.mapInstance = map;
  }, [map]);
  
  return null;
}

export default MapController;