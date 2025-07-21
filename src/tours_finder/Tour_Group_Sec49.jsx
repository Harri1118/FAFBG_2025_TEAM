import { LayerGroup, LayersControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import data from "../data/Projected_Sec49_Headstones.json"
import objects from "../data/Sec49WithNames.json"

const ToursGroupIterative = () => {
    const pointStyle = {
    radius: 10,
    fillColor: "#75ff87",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  return (
<LayerGroup>
  <LayersControl.Overlay checked name="Section 49 Headstones">
    <GeoJSON
    data={data}
    style={pointStyle}
    pointToLayer={(feature, latlng) => {
        return L.circleMarker(latlng);
        }}
    
    onEachFeature={(feature, layer) => {
      const OBJECTID = feature.properties.OBJECTID;
      const obj = objects[OBJECTID]
      const Full_Name = obj.Full_Name
      const Birth = obj.DOB || "????"
      const Death = obj.DOD || "????"
      let popupContent = `
        <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4;">
        <strong style="font-size: 14px;">${Full_Name}</strong>
        <hr style="margin: 4px 0;" />
      `
       popupContent = popupContent + `
       ${Birth} - ${Death}
       <br/>
       `

       popupContent = popupContent + `
       Headstone is made from ${obj.Stone_Type}. It is `
       if(obj.Readable == "Yes")
        popupContent += "fully"
      else if(obj.Readable == "No")
        popupContent += "partially"
      else
        popupContent += "not"
       popupContent += `
        readable.
       <br/>
       Lot ${obj.Lot} Row ${obj.Row}, Position ${obj.Position}
       </div>`; 

      layer.bindPopup(popupContent, {
          className: 'custom-popup'
        });
        layer.on({
          click: () => {
            layer.openPopup();
          }
        });
      }}
      />
  </LayersControl.Overlay>
</LayerGroup>
  );
};

export default ToursGroupIterative;
