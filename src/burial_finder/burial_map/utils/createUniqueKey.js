/**
 * Creates a unique key for a burial record
 * @param {Object} burial - The burial record object
 * @param {number} index - The index of the burial in the list
 * @returns {string} A unique identifier string
 */

export const createUniqueKey = (burial, index) => {
  if (!burial || !burial.OBJECTID) {
    return `unknown-${index}`;
  }
  
  // Use OBJECTID as the base key
  const baseKey = burial.OBJECTID.toString();
  
  // Append index to ensure uniqueness in case of duplicate OBJECTIDs
  return `${baseKey}-${index}`;