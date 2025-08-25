import {BurialMap} from 'features/burial_finder/Map.jsx';
import Home from './main/home.js';
import Explore from './main/explore.js';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from 'main/about.js';
import NotableGraves from 'main/notable_graves.js';
import LocateBurialsOrGraves from 'main/locate_burials_or_graves.js';
import ToursNav from 'features/tours_finder/Tours_Map.jsx';
import BioList from 'main/bioList.js'
import './assets/css/App.css';

// Test
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graves" element={<NotableGraves />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/Locate_Burials&Graves" element={<LocateBurialsOrGraves />} />
          <Route path="/burialfinder" element={<BurialMap />} />
          <Route path="/Tours" element={<ToursNav />} />
          <Route path="/biolist" element={<BioList/>}/>
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
