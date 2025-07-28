// Local Data and Styles
import geo_burials from "../../../data/Geo_Burials.json";
import Sec75_Headstones from "../../../data/Projected_Sec75_Headstones.json";
import Sec49_Headstones from "../../../data/Projected_Sec49_Headstones.json";

// Tour Data Imports
import NotablesTour from "../../../data/NotablesTour20.json";
import IndependenceTour from "../../../data/IndependenceTour20.json";
import AfricanAmericanTour from "../../../data/AfricanAmericanTour20.json";
import ArtistTour from "../../../data/ArtistTour20.json";
import AssociationsTour from "../../../data/AssociationsTour20.json";
import AuthorsTour from "../../../data/AuthorsPublishersTour20.json";
import BusinessTour from "../../../data/BusinessFinanceTour20.json";
import CivilWarTour from "../../../data/CivilWarTour20.json";
import PillarsTour from "../../../data/SocietyPillarsTour20.json";
import MayorsTour from "../../../data/AlbanyMayors_fixed.json";
import GARTour from "../../../data/GAR_fixed.json";
/**
 * Array of unique section numbers from the burial data
 * Sorted numerically with special handling for section 100A
 */
const UNIQUE_SECTIONS = Array.from(new Set(geo_burials.features.map(f => f.properties.Section))).sort((a, b) => {
  if (a === '100A') return 1;
  if (b === '100A') return -1;
  return a - b;
});

/**
 * Tour data configuration with associated GeoJSON data
 */
const TOUR_DATA = [
  { key: 'Lot7', data: Sec75_Headstones, name: "Soldier's Lot (Section 75, Lot 7)" },
  { key: 'Sec49', data: Sec49_Headstones, name: "Section 49" },
  { key: 'Notable', data: NotablesTour, name: "Notables Tour 2020" },
  { key: 'Indep', data: IndependenceTour, name: "Independence Tour 2020" },
  { key: 'Afr', data: AfricanAmericanTour, name: "African American Tour 2020" },
  { key: 'Art', data: ArtistTour, name: "Artists Tour 2020" },
  { key: 'Groups', data: AssociationsTour, name: "Associations, Societies, & Groups Tour 2020" },
  { key: 'AuthPub', data: AuthorsTour, name: "Authors & Publishers Tour 2020" },
  { key: 'Business', data: BusinessTour, name: "Business & Finance Tour 2020" },
  { key: 'CivilWar', data: CivilWarTour, name: "Civil War Tour 2020" },
  { key: 'Pillars', data: PillarsTour, name: "Pillars of Society Tour 2020" },
  { key: 'MayorsOfAlbany', data: MayorsTour, name: "Mayors of Albany" },
  { key: 'GAR', data: GARTour, name: "Grand Army of the Republic" }
];

export {UNIQUE_SECTIONS, TOUR_DATA}