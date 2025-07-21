export default function createTourPopupContent = `
        <div class="custom-popup">
          <h3>${burial.First_Name} ${burial.Last_Name}</h3>
          <p>Section: ${burial.Section}</p>
          <p>Lot: ${burial.Lot}</p>
          <p>Tier: ${burial.Tier}</p>
          <p>Grave: ${burial.Grave}</p>
          <p>Birth: ${burial.Birth}</p>
          <p>Death: ${burial.Death}</p>
        </div>
      `;
      export const createTourPopupContent = (feature, tourKey) => {
  const { Full_Name, Birth_Year, Death_Year, Lot, Section } = feature.properties;
  return `
    <div class="tour-popup">
      <h3>${Full_Name}</h3>
      <p><strong>Tour:</strong> ${TOURS[tourKey].name}</p>
      <p><strong>Birth Year:</strong> ${Birth_Year || 'Unknown'}</p>
      <p><strong>Death Year:</strong> ${Death_Year || 'Unknown'}</p>
      <p><strong>Lot:</strong> ${Lot || 'N/A'}, <strong>Section:</strong> ${Section || 'N/A'}</p>
    </div>
  `;
}
  