import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button, Paper, Typography } from '@mui/material';
import { Marker, Popup } from 'react-leaflet';
import { createNumberedIcon, createUniqueKey } from '../../utils/iconUtils';
import { getBurialCoordinates } from '../../utils/burialUtils';
const SearchResultMarkers = ({ selectedBurials, routingDestination, startRouting, stopRouting, hoveredIndex, createUniqueKey,setHoveredIndex, handleMarkerClick, createNumberedIcon }) => {
{/* Search Result Markers - Always on top */}
          return selectedBurials.map((burial, index) => (
            <Marker 
              key={createUniqueKey(burial, index)}
              position={[burial.coordinates[1], burial.coordinates[0]]}
              icon={createNumberedIcon(index + 1, hoveredIndex === index)}
              eventHandlers={{
                mouseover: () => setHoveredIndex(index),
                mouseout: () => setHoveredIndex(null),
                click: () => handleMarkerClick(burial, index)
              }}
              zIndexOffset={1000}
            >
              <Popup>
                <div>
                  <h3>{burial.First_Name} {burial.Last_Name}</h3>
                  <p>Section: {burial.Section}</p>
                  <p>Lot: {burial.Lot}</p>
                  <p>Tier: {burial.Tier}</p>
                  <p>Grave: {burial.Grave}</p>
                  <p>Birth: {burial.Birth}</p>
                  <p>Death: {burial.Death}</p>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                    onClick={() => routingDestination ? stopRouting() : startRouting(burial)}
                    sx={{ mt: 1 }}
                  >
                    {routingDestination ? 'Stop Navigation' : 'Get Directions'}
                  </Button>
                </div>
              </Popup>
            </Marker>
          ));
        };
        export default SearchResultMarkers;