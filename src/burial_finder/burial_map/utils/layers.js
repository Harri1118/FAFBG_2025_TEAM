import L from 'leaflet';
import { useEffect } from 'react';
import { ARC_Boundary, ARC_Roads, ARC_Sections } from './geoData';
import { exteriorStyle, roadStyle } from './mapStyles';
import { TOUR_DATA } from './tourConfig';
import { createOnEachTourFeature } from './resultMarkerUtils';
/* Initialize GeoJSON layers and overlay maps
   */
  useEffect(() => {
    try {
      // Create tour layers
      const makeOverlayMaps = (tourCallbacks, onEachSection, createTourMarker, TOUR_DATA) => {
      const newTourLayers = TOUR_DATA.reduce((acc, { key, data }) => {
        acc[key] = L.geoJSON(data, {
          pointToLayer: createTourMarker(key),
          onEachFeature: tourCallbacks[key]
        });
        return acc;
      }, {});

      // Create base layers
      const otherLayers = {
        boundary: L.geoJSON(ARC_Boundary, { style: exteriorStyle }),
        roads: L.geoJSON(ARC_Roads, { style: roadStyle }),
        sections: L.geoJSON(ARC_Sections, { onEachFeature: onEachSection })
      };

      // Combine all layers
       const newOverlayMaps = {
        ...TOUR_DATA.reduce((acc, { key, name }) => {
          acc[name] = newTourLayers[key];
          return acc;
        }, {}),
        "Albany Rural Cemetery Boundary": otherLayers.boundary,
        "Albany Rural Cemetery Roads": otherLayers.roads,
        "Section Boundaries": otherLayers.sections
      };

      

  export default makeOverlayMaps;
  
