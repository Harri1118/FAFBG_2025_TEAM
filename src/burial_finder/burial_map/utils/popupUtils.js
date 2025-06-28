const getImagePath = (imageName) => {
  if (!imageName || imageName === "NONE") return 'https://www.albany.edu/arce/images/no-image.jpg';
  
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8000/src/data/images/${imageName}`;
  }
  return `https://www.albany.edu/arce/images/${imageName}`;
};

const createTourPopupContent = (feature, tourKey) => {
  let content = `<dl class="popup-content">`;
  
  content += `<dt><b>${feature.properties.Full_Name}</b></dt><hr>`;
  
  if (feature.properties.Titles) {
    content += `<dt>${feature.properties.Titles}</dt>`;
  }
  
  content += `<dt>(Click image to view detailed biography)</dt>`;
  
  if (feature.properties.Bio_Portra && feature.properties.Bio_Portra !== "NONE") {
    content += `
      <dt>
        <a href="https://www.albany.edu/arce/${feature.properties.Tour_Bio}.html" target="_blank">
          <img 
            src="${getImagePath(feature.properties.Bio_Portra)}"
            style="max-width:200px; max-height:200px; border:2px solid #ccc; border-radius:4px; margin:8px 0;"
            loading="lazy"
            onerror="this.onerror=null; this.src='https://www.albany.edu/arce/images/no-image.jpg';"
          />
        </a>
      </dt>`;
  }
  
  content += '</dl>';
  return content;
};
export const createPopupContent = (feature, tourKey) => {

