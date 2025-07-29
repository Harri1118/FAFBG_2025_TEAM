

export const getImagePath = (imageName) => {
  if (!imageName || imageName === "NONE") return 'https://www.albany.edu/arce/images/no-image.jpg';
  
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8000/src/data/images/${imageName}`;
  }
  return `https://www.albany.edu/arce/images/${imageName}`;
};