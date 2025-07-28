import { ButtonGroup, IconButton, Paper } from "@mui/material";
import { useMap } from "react-leaflet";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
/**
 * Custom zoom control component that provides zoom in/out buttons
 * Positioned at the top-right corner of the map
 */
const CustomZoomControl = () => {
  const Map = useMap()
  
  return (
    <Paper 
      elevation={3}
      sx={{
        position: 'absolute',
        top: '80px',
        right: '10px',
        zIndex: 1000,
      }}
    >
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        size="small"
      >
        <IconButton onClick={() => Map.zoomIn()} size="small">
          <AddIcon />
        </IconButton>
        <IconButton onClick={() => Map.zoomOut()} size="small">
          <RemoveIcon />
        </IconButton>
      </ButtonGroup>
    </Paper>
  );
}
export default CustomZoomControl;