/**
 * Component that renders the ESRI vector basemap
 */
import { BasemapLayer } from 'react-esri-leaflet';
function VectorBasemap({ name }) {
  return <BasemapLayer name={name} maxZoom={25} maxNativeZoom={19} />;
}
export default VectorBasemap;