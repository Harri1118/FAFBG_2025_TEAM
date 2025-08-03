            import { Box, Button } from '@mui/material';
            import ARC_Boundary from '../../../../data/ARC_Boundary.json'  
            import PinDropIcon from '@mui/icons-material/PinDrop';          
import { useState } from 'react';
           const LocationButton = ({status: refStatus, watchId : refWatchId, turf, lat: refLat, lng: refLng}) => {
            const [status, setStatus] = useState(refStatus)
            const [watchId, setWatchId] = useState(refWatchId);
            const [lat, setLat] = useState(refLat);
            const [lng, setLng] = useState(refLng);

            
           /**
             * Handles user location tracking
             * Checks if user is within 5 miles of the cemetery
             */
            const onLocateMarker = () => {
              if (!navigator.geolocation) {
                setStatus('Geolocation is not supported by your browser');
                return;
              }
          
              if (watchId) {
                navigator.geolocation.clearWatch(watchId);
              }
          
              setStatus('Locating...');
              const id = navigator.geolocation.watchPosition(
                (position) => {
                  const point = turf.point([position.coords.longitude, position.coords.latitude]);
                  const boundaryPolygon = ARC_Boundary.features[0];
                  const bufferedBoundary = turf.buffer(boundaryPolygon, 8, { units: 'kilometers' });
                  const isWithinBuffer = turf.booleanPointInPolygon(point, bufferedBoundary);
                  
                  if (isWithinBuffer) {
                    setStatus('Location active');
                    setLat(position.coords.latitude);
                    setLng(position.coords.longitude);
                  } else {
                    setStatus('You must be within 5 miles of Albany Rural Cemetery');
                    setLat(null);
                    setLng(null);
                  }
                },
                (error) => {
                  setStatus('Unable to retrieve your location');
                  console.error('Geolocation error:', error);
                },
                {
                  enableHighAccuracy: true,
                  maximumAge: 0,
                  timeout: 5000
                }
              );
              setWatchId(id);
            };

            
            return (
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                    onClick={onLocateMarker}
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<PinDropIcon />}
                    sx={{ flex: 1 }}
                >
                    {status}
                </Button>
                </Box>
            );
            }

          export default LocationButton