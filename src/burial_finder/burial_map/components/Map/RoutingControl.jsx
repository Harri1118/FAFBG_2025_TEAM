import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
/**
 * Component that manages routing between two points using GraphHopper
 */
function RoutingControl({ from, to }) {
  const map = useMap();
  const [routingError, setRoutingError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  useEffect(() => {
    if (!from || !to) return;

    setRoutingError(null);
    setIsCalculating(true);

    const apiKey = process.env.REACT_APP_GRAPHHOPPER_API_KEY;
    if (!apiKey) {
      console.error('GraphHopper API key not found in environment variables');
      setRoutingError('Configuration error: API key not found. Please contact administrators.');
      setIsCalculating(false);
      return;
    }

    const routingControl = L.Routing.control({
      router: new L.Routing.GraphHopper(apiKey, {
        urlParameters: {
          vehicle: 'foot'  // Set to pedestrian routing
        }
      }),
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1])
      ],
      createMarker: function() { return null; },
      lineOptions: {
        styles: [
          {color: '#0066CC', opacity: 0.8, weight: 5},
          {color: '#ffffff', opacity: 0.3, weight: 7}
        ]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      useZoomParameter: true,
      show: false
    }).addTo(map);

    routingControl.on('routesfound', () => {
      setIsCalculating(false);
    });

    routingControl.on('routingerror', (e) => {
      console.error('Routing error:', e);
      
      if (e.error && e.error.status === 0) {
        setRoutingError('Network error: Please check your internet connection.');
      } else if (e.error && e.error.status === 401) {
        setRoutingError('Authentication error: Invalid API key.');
      } else if (e.error && e.error.status === 429) {
        setRoutingError('Too many requests: Rate limit exceeded.');
      } else {
        setRoutingError('Unable to calculate route. The locations might be inaccessible by foot or too far apart.');
      }
      
      setIsCalculating(false);
      map.removeControl(routingControl);
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, from, to]);

  if (isCalculating) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          padding: '10px',
          backgroundColor: '#f5f5f5',
          color: '#333',
        }}
      >
        <Typography>Calculating route...</Typography>
      </Paper>
    );
  }

  if (routingError) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          padding: '10px',
          backgroundColor: '#f44336',
          color: 'white',
        }}
      >
        <Typography>{routingError}</Typography>
      </Paper>
    );
  }

  return null;
}
export default RoutingControl;