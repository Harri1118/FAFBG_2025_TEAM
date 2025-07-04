import { useEffect } from 'react';
import L from 'leaflet';
import { LayerGroup, LayersControl, GeoJSON } from 'react-leaflet';

const Tour_Group = ({ data, color, tourGroup }) => {
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
  <LayersControl.Overlay checked name={tourGroup}>
      <GeoJSON data={data} style={pointStyle}
      pointToLayer={(feature, latlng) => {
        return L.circleMarker(latlng);
      }}
      onEachFeature={(feature, layer) => {
        const Full_Name = feature.properties.Full_Name
        const Birth = feature.properties.Birth || "Unknown"
        const Death = feature.properties.Death || "Unknown"
        const HeadStone = feature.properties.Headstone_
        const InitialTerm = feature.properties.Initial_Te;
        const SubsequentTerm = feature.properties.Subsequent;
        const Section = feature.properties.Section;
        const Lot = feature.properties.Lot;
        let ShortBio = feature.properties.Titles
        let Image_Name = feature.properties.Bio_Portri;
        const Link = feature.properties.Tour_Bio;
        if(ShortBio == null)
          ShortBio = feature.properties.Service_Re
        if(Image_Name == null || Image_Name == "null")
          Image_Name = feature.properties.Bio_Portra
        let popupContent = `
        <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4;">
        <strong style="font-size: 14px;">${Full_Name}</strong>
        <hr style="margin: 4px 0;" />
        `
        if(ShortBio != null)
        popupContent += `<p>${ShortBio}</p>`
        if(InitialTerm != null)
          popupContent += `<div><strong>Initial Term:</strong> ${InitialTerm}</div>`
        if(SubsequentTerm != null)
        popupContent += `<div><strong>Subsequent Term:</strong> ${SubsequentTerm}</div>`
    
          let birthDeathSection = `
        <div><strong>Date of birth:</strong> ${Birth}</div>
        <div><strong>Date of death:</strong> ${Death}
        `
         if(HeadStone != null)
           birthDeathSection += ` : Headstone: ${HeadStone}`
        birthDeathSection += `</div>`
        if(Birth != "Unknown" || Death != "Unknown")
          popupContent = popupContent + birthDeathSection;
        popupContent = popupContent +  `<a href="https://www.albany.edu/arce/${Link}.html" target="blank_" style="color: black;">`
        if(Image_Name != null)
          popupContent += `<img src="https://www.albany.edu/arce/images/${Image_Name}" alt="${Full_Name}" style="width: 100%; height: auto; border-radius: 4px;" />`
        popupContent = popupContent + `(Click here to view page)</a></div>`;
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
  )
};

export default Tour_Group;
