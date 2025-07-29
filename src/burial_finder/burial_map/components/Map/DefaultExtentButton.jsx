
/**
 * Button component that resets the map view to the default extent
 */

import { IconButton, Paper} from "@mui/material";
import { useMap } from "react-leaflet";
import HomeIcon from '@mui/icons-material/Home';
 
const DefaultExtentButton = () => {
  const map = useMap();
  
  const handleClick = () => {
    const defaultBounds = [
      [42.694180, -73.741980], // Southwest corner
      [42.714180, -73.721980]  // Northeast corner
    ];
    map.fitBounds(defaultBounds);
  };
  
  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        top: '150px',
        right: '10px',
        zIndex: 1000,
      }}
    >
      <IconButton onClick={handleClick} size="small" title="Return to Default Extent">
        <HomeIcon />
      </IconButton>
    </Paper>
  );
}
export default DefaultExtentButton;