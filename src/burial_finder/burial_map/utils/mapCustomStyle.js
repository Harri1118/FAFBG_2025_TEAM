/**
   * Add custom CSS styles for markers and clusters
   */
 export default function injectCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .custom-popup {
        max-width: 300px !important;
      }
      
      .custom-popup img {
        display: block;
        max-width: 200px;
        max-height: 200px;
        margin: 8px auto;
        border: 2px solid #ccc;
        border-radius: 4px;
      }
      
      .marker-cluster {
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        margin-top: -20px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        color: #fff;
        text-shadow: 0 0 2px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .tour-marker {
        transition: all 0.3s ease;
      }
      
      .tour-marker:hover {
        transform: scale(1.2);
      }
      
      .tour-marker div {
        transition: all 0.3s ease;
      }
      
      .tour-marker:hover div {
        transform: scale(1.2);
        box-shadow: 0 0 8px rgba(0,0,0,0.6);
      }
      
      .custom-cluster {
        background: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }