import { Autocomplete, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { TOUR_DATA } from "../../utils/data_structs";
import { TOURS } from "../../utils/constants";
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
export default TourFilter;