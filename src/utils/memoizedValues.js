import { useMemo } from "react";

  /**
   * Create searchable options from burial data
   * Includes name, section, lot, and tour information
   */
  
const useSearchOptions = (data) => {
  return useMemo(() => {
    if (!data?.features) return [];
    return data.features
      .map(feature => ({
        label: `${feature.properties.First_Name} ${feature.properties.Last_Name}`,
        searchableLabel: `${feature.properties.First_Name} ${feature.properties.Last_Name} (Section ${feature.properties.Section}, Lot ${feature.properties.Lot})`,
        key: `${feature.properties.OBJECTID}_${feature.properties.First_Name}_${feature.properties.Last_Name}_Section${feature.properties.Section}_Lot${feature.properties.Lot}`,
        ...feature.properties,
        coordinates: feature.geometry.coordinates
      }))
      .filter(option => option.First_Name || option.Last_Name);
  }, []);
};

export default useSearchOptions;
