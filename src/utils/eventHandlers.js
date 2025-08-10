//   /**
//    * Handles user location tracking
//    * Checks if user is within 5 miles of the cemetery
//    */
//   const onLocateMarker = ({onStatusChange, watchId}) => {

//     if (!navigator.geolocation) {
//       setStatus('Geolocation is not supported by your browser');
//       return;
//     }

//     if (watchId) {
//       navigator.geolocation.clearWatch(watchId);
//     }

//     setStatus('Locating...');
//     const id = navigator.geolocation.watchPosition(
//       (position) => {
//         const point = turf.point([position.coords.longitude, position.coords.latitude]);
//         const boundaryPolygon = ARC_Boundary.features[0];
//         const bufferedBoundary = turf.buffer(boundaryPolygon, 8, { units: 'kilometers' });
//         const isWithinBuffer = turf.booleanPointInPolygon(point, bufferedBoundary);
        
//         if (isWithinBuffer) {
//           setStatus('Location active');
//           setLat(position.coords.latitude);
//           setLng(position.coords.longitude);
//         } else {
//           setStatus('You must be within 5 miles of Albany Rural Cemetery');
//           setLat(null);
//           setLng(null);
//         }
//       },
//       (error) => {
//         setStatus('Unable to retrieve your location');
//         console.error('Geolocation error:', error);
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 0,
//         timeout: 5000
//       }
//     );
//     setWatchId(id);
//   };

//   export default onLocateMarker