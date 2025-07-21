/**
   * Create searchable options from burial data
   * Includes name, section, lot, and tour information
   */
  import { useMemo } from 'react';
  const useSearchOptions = (geo_burials) => {
    return useMemo(() => {
      return geo_burials.features
      .map(feature => ({
        label: `${feature.properties.First_Name} ${feature.properties.Last_Name}`,
        searchableLabel: `${feature.properties.First_Name} ${feature.properties.Last_Name} (Section ${feature.properties.Section}, Lot ${feature.properties.Lot})`,
        key: `${feature.properties.OBJECTID}_${feature.properties.First_Name}_${feature.properties.Last_Name}_Section${feature.properties.Section}_Lot${feature.properties.Lot}`,
        ...feature.properties,
        coordinates: feature.geometry.coordinates,}))
        .filter(option => option.First_Name || option.Last_Name);
      }, [geo_burials]);
    };
      // Map burial features to searchable options
      // Each option includes name, section, lot, and coordinates
      // Filter out entries without names
 export default useSearchOptions;
