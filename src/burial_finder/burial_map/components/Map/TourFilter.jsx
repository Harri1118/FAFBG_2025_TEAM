import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { TOUR_DATA } from "../../utils/tourConfig";
import Box from "@mui/material/Box";
import { TOURS } from "../../utils/tourConfig";
 /**
 * Component for filtering and selecting cemetery tours
 */
function TourFilter({ overlayMaps, setShowAllBurials, onTourSelect }) {
  return (
    <Autocomplete
      options={TOUR_DATA}
      getOptionLabel={(option) => option.name}
      onChange={(event, newValue) => {
        setShowAllBurials(true);
        const tourName = newValue ? newValue.name : null;
        onTourSelect(tourName);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tour"
          size="small"
          fullWidth
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Box
            component="span"
            sx={{
              width: 14,
              height: 14,
              mr: 1,
              borderRadius: '50%',
              backgroundColor: TOURS[option.key].color,
              display: 'inline-block'
            }}
          />
          {option.name}
        </li>
      )}
    />
  );
}
export {TourFilter};