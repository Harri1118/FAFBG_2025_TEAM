// import { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// import { LayerGroup, LayersControl, GeoJSON } from 'react-leaflet';
// import ReactDOMServer from 'react-dom/server';
// import {Box} from "@mui/material"



// const Tour_Group = ({ data, color, tourGroup }) => {
//   const geoJsonRef = useRef();
//   const [selectedFeature, setSelectedFeature] = useState(null);

//   const pointStyle = {
//     radius: 10,
//     fillColor: color,
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
//   }

//   const handleEvent = (e) => {
//     setSelectedFeature(e.target.feature);
//     console.log(selectedFeature)
//   };

//   useEffect(() => {
//     if (geoJsonRef.current) {
//       // Defensive: rebind click events in case layer re-renders
//       geoJsonRef.current.eachLayer((layer) => {
//         layer.off(); // remove any old events
//         layer.on('click', handleEvent);
//       });
//     }
//   }, [data]); // Re-run if `data` changes

//   return(
//   <LayerGroup>
//   <LayersControl.Overlay checked name={tourGroup}>

//       <GeoJSON data={data} style={pointStyle} 
//       pointToLayer={(feature, latlng) => {
//         return L.circleMarker(latlng);
//       }}
//       onEachFeature={(feature, layer) => {
        
//         const Full_Name = feature.properties.Full_Name
//         const Birth = feature.properties.Birth || "Unknown"
//         const Death = feature.properties.Death || "Unknown"
//         const HeadStone = feature.properties.Headstone_
//         const InitialTerm = feature.properties.Initial_Te || "null";
//         const SubsequentTerm = feature.properties.Subsequent || "null";
//         const Section = feature.properties.Section;
//         const Lot = feature.properties.Lot;
//         let ShortBio = feature.properties.Titles
//         let Image_Name = feature.properties.Bio_Portri;
//         const Link = feature.properties.Tour_Bio;
//         if(ShortBio == null)
//           ShortBio = feature.properties.Service_Re
//         if(Image_Name == null || Image_Name == "null")
//           Image_Name = feature.properties.Bio_Portra
//         const popupContent = (
//             <div style={{ fontFamily: 'Arial', fontSize: 13, lineHeight: 1.4 }} onClick={handleEvent}>
//               <strong style={{ fontSize: 14 }}>{feature.properties.Full_Name}</strong>
//               <hr style={{ margin: '4px 0' }} />
//               {
//                 (ShortBio !== null && ShortBio !== "null") && (
//                   <p>{ShortBio}</p>
//                 )
//               }
//               {
//                 (InitialTerm !== null && InitialTerm !== "null") && (
//                   <div><strong>Initial Term: </strong>{InitialTerm}</div>
//                 )
//               }
//               {(SubsequentTerm !== null && SubsequentTerm !== "null") && (
//                 <div><strong>Subsequent Term: </strong>{SubsequentTerm}</div>
//               )}

//               { (Birth !== "Unknown" || Death !== "Unknown")  && (
//               <div>
//               <p><strong>Date of birth:</strong> {Birth}</p>
//               <p><strong>Date of death:</strong> {Death}</p>
//               </div>
//               )
//               }
//               {
//                 (HeadStone != null) && ( <p><strong>Headstone:</strong>  {HeadStone}</p>) 
//               }
//                         {
//               (Link !== null && Link !== "null") ? (
//                 <div>
//                   {
//                     (Image_Name !== null && Image_Name !== "null") ? (
//                       <Box style={{width: "100%"}} >
//                        <img
//                            src={`https://www.albany.edu/arce/images/${Image_Name}`}
//                            alt={Full_Name}
//                            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                           
//                         />
//                         {/* <iframe
//                         src={`https://www.albany.edu/arce/${Link}.html`}
//                         width="100%"
//                         height="100%"
//                         style={{ border: 'none', display: "none"}}
//                         title="Embedded ARCE Page"
//                         /> */}
//                       </Box>
//                     ) : (
//                       <a href={`https://www.albany.edu/arce/${Link}.html`} target="_blank" rel="noopener noreferrer">
//                         Click here to view page.
//                       </a>
//                     )
//                   }
//                   <p>(Click image to view link)</p>
//                 </div>
//               ) : (
//                 (Image_Name !== null && Image_Name !== "null") ? (
//                   <div>
//                     <img
//                       src={`https://www.albany.edu/arce/images/${Image_Name}`}
//                       alt={Full_Name}
//                       style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
//                     />
//                     <p>(Click on the image to expand it)</p>
//                   </div>
//                 ) : null
//               )
//             }
            


//             </div>
//           );
      
        
//         layer.bindPopup(ReactDOMServer.renderToString(popupContent), {
//           className: 'custom-popup',
//         });

//       }
        
//     }
        
//       />
      
//     </LayersControl.Overlay>
//   </LayerGroup> 
//   )
// };

// export default Tour_Group;

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LayerGroup, LayersControl, GeoJSON } from 'react-leaflet';
import ReactDOMServer from 'react-dom/server';
import {Box} from "@mui/material"
import Modal from '@mui/material/Modal';


const Tour_Group = ({ data, color, tourGroup }) => {
  const geoJsonRef = useRef();
  const [selectedFeature, setSelectedFeature] = useState(null);

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
              ${HeadStone ? `<p>Headstone:  {HeadStone}</p>` : ""}
              ${Image_Name ? `<img src="https://www.albany.edu/arce/images/${Image_Name}" style="width: 100%; border-radius: 4px; margin-top: 5px;" />` : ""}
            <button id="${popupId}" style="margin-top: 8px;">More Info</button>
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
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto'
  }}>
    {selectedFeature && (
      <>
        <h2>{selectedFeature.properties.Full_Name}</h2>
        <p><strong>Birth:</strong> {selectedFeature.properties.Birth || "Unknown"}</p>
        <p><strong>Death:</strong> {selectedFeature.properties.Death || "Unknown"}</p>

        {/* Example image and button */}
        {selectedFeature.properties.Bio_Portri && (
          <img
            src={`https://www.albany.edu/arce/images/${selectedFeature.properties.Bio_Portri}`}
            alt={selectedFeature.properties.Full_Name}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
            onClick={() => alert("Image clicked")}
          />
        )}
        <button onClick={() => alert("Button clicked")}>Test Button</button>
      </>
    )}
  </Box>
</Modal>

  </LayerGroup> 
  )
};

export default Tour_Group;