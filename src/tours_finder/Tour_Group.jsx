import { useEffect } from 'react';
import L from 'leaflet';
import { LayerGroup, LayersControl, GeoJSON } from 'react-leaflet';
import CivilWarTour from "../data/CivilWarTour20.json";

const Tour_Group = ({ data, color, name }) => {
  const pointStyle = {
    radius: 10,
    fillColor: color,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
  return(
  <LayerGroup>
  <LayersControl.Overlay checked name={name}>
      <GeoJSON data={data} style={pointStyle}
      pointToLayer={(feature, latlng) => {
        return L.circleMarker(latlng);
      }}
      onEachFeature={(feature, layer) => {
        // Create tooltip but don't bind it yet
        const tooltip = L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'section-label'
        });
        
        layer.on({
          // Show label on mouseover if not already selected
          mouseover: () => {
              tooltip.setContent(`${feature.properties.First_name}`);
              layer.bindTooltip(tooltip).openTooltip();
            
          },
          // Hide label on mouseout if not selected
          mouseout: () => {
              layer.unbindTooltip();
          },
        });
      }}
      />
    </LayersControl.Overlay>
  </LayerGroup> 
  )
};

export default Tour_Group;
