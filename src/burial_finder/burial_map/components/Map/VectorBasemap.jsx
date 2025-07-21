import { useMap } from "react-leaflet";
import { BasemapLayer } from "react-esri-leaflet";
/**
 * Component that renders the ESRI vector basemap
 */
function VectorBasemap({ name }) {
  return <BasemapLayer name={name} maxZoom={25} maxNativeZoom={19} />;
}
export default VectorBasemap;