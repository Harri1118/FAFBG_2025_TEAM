import { useEffect } from 'react';
import L from 'leaflet';

const ToursLayer = ({ map, dataLayers, pointMarker2, onEachSec49Feature, refreshControl, addToSearch }) => {
  useEffect(() => {
    let featuresLayer2;

    fetch("https://www.albany.edu/arce/assets/files/Projected_Sec49_Headstones.geojson")
      .then((res) => res.json())
      .then((data) => {
        featuresLayer2 = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, pointMarker2);
          },
          onEachFeature: onEachSec49Feature,
        }).addTo(map);

        dataLayers.addLayer(featuresLayer2);
        refreshControl();
        addToSearch(dataLayers);
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, [map, dataLayers, pointMarker2, onEachSec49Feature, refreshControl, addToSearch]);

  return null; // This component only adds side effects, not UI
};

export default ToursLayer;
