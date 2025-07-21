import {useMemo} from 'react';

/**
   * Filter burials based on section/lot/tier criteria
  */
 

  export default filteredBurials (geo_burials, {

    showAllBurials,
    sectionFilter,
    lotTierFilter,
    filterType
  }) ; {
    return useMemo(() => {
    if (!showAllBurials || !sectionFilter) return [];
    return geo_burials.features
    .filter(feature => {
      const props = feature.properties;

      if (props.Section !== sectionFilter) 
        return false;
      

      if (lotTierFilter) {
        if (filterType === 'lot' && props.Lot !== lotTierFilter) 
          return false;

        if (filterType === 'tier' && props.Tier !== lotTierFilter) 
          return false;
        
      }

      return true;
    })
    .map(feature => ({
      ...feature.properties,
      coordinates: feature.geometry.coordinates
    })); 
},[geo_burials, showAllBurials, sectionFilter, lotTierFilter, filterType]);
  }