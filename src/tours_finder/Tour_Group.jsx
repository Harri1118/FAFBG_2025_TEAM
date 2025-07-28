import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LayerGroup, LayersControl, GeoJSON } from 'react-leaflet';
import ReactDOMServer from 'react-dom/server';
import {Box, useMediaQuery} from "@mui/material"
import Modal from '@mui/material/Modal';


const Tour_Group = ({ data, color, tourGroup, keyWord }) => {
  const geoJsonRef = useRef();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const isMobile = useMediaQuery('(max-width:768px)');
  const [width, setWidth] = useState(1500)
  useEffect( () =>
  {
    if(isMobile){
      setWidth(window.innerWidth)
    }
  },[isMobile]
  )
  const pointStyle = {
    radius: 10,
    fillColor: color,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  const handleEvent = (e) => {
    setSelectedFeature(e.target.feature);
    console.log(selectedFeature)
  };

  useEffect(() => {
    if (geoJsonRef.current) {
      // Defensive: rebind click events in case layer re-renders
      geoJsonRef.current.eachLayer((layer) => {
        layer.off(); // remove any old events
        layer.on('click', handleEvent);
      });
    }
  }, [data]); // Re-run if `data` changes

  return(
  <LayerGroup>
  <LayersControl.Overlay checked name={`<span style="background-color: ${color}; color: white; padding: 2px">${keyWord}</span> ${tourGroup}`}
  >

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
        const Link = feature.properties.Tour_Bio || "Unknown";
        feature.properties.Link = Link;
        if(ShortBio == null)
          ShortBio = feature.properties.Service_Re
        if(Image_Name == null || Image_Name == "null")
          Image_Name = feature.properties.Bio_Portra
        const popupId = `popup-${feature.properties.id || feature.properties.Full_Name.replace(/\s+/g, '-')}`;

        const popupHTML = `
          <div style="font-family: Arial; font-size: 13px; lineHeight: 1.4;">
            <strong style={{ fontSize: 14 }}>${Full_Name}</strong><br/>
              <hr style={{ margin: '4px 0' }} />
              ${ShortBio ? `<p>${ShortBio}</p>` : ""}
              ${InitialTerm ? `<div>Initial Term: ${InitialTerm}</div>` : ""}
              ${SubsequentTerm ? `<div>Subsequent Term: ${SubsequentTerm}</div>` : ""}
              ${(Section && Lot) ? `<p>Section ${Section}, Lot ${Lot}</p>` : ""}
              ${!(Death === "Unknown" && Birth === "Unknown") ? `
                 <div>
                 <p>Date of birth: ${Birth}</p>
                 <p>Date of death: ${Death}</p>
                 </div>
              ` : ""}
              ${HeadStone ? `<p>Headstone:  ${HeadStone}</p>` : ""}
              ${Image_Name ? `<img src="https://www.albany.edu/arce/images/${Image_Name}" style="width: 100%; border-radius: 4px; margin-top: 5px;" />` : ""}
              ${
                Link ? (`<button id="${popupId}" style="margin-top: 8px;">More Info</button>`) : ("")
              }
          </div>
        `;
        layer.bindPopup(popupHTML);
        layer.on("popupopen", () => {
          const btn = document.getElementById(popupId);
          if (btn) {
            btn.addEventListener("click", () => {
              setSelectedFeature(feature); // Open modal
            });
          }
        });
      }
        
    }
        
      />
      
    </LayersControl.Overlay>
    <Modal open={!!selectedFeature} onClose={() => setSelectedFeature(null)}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '90vh',
    maxWidth: {width},
    maxHeight: 1000,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    overflowY: 'auto'
  }}>
    {selectedFeature && (
      <>
            <iframe
              name="myIframe"
              src={`https://www.albany.edu/arce/${selectedFeature.properties.Link}.html`}
              style={{width: "100%", height: "100%"}}
            ></iframe>
      </>
    )}
  </Box>
</Modal>

  </LayerGroup> 
  )
};

export default Tour_Group;