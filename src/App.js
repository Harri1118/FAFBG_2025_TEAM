import {BurialMap} from 'features/burial_finder/Map.jsx';
import Home from './main/home.js';
import Explore from './main/explore.js';
import { Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import About from 'main/about.js';
import NotableGraves from 'main/notable_graves.js';
import LocateBurialsOrGraves from 'main/locate_burials_or_graves.js';
import ToursNav from 'features/tours_finder/Tours_Map.jsx';
import BioList from 'main/bioList.js'
import './assets/css/App.css';
import PageScopedCSS from 'shared/components/Web/PageScopedCss.jsx';

import './assets/css/main.css';
// Test
function App() {
function DynamicCSSLoader() {
  const location = useLocation();
  let styleRef;

  useEffect(() => {
    const blocked = ['/Tours', '/burialfinder'];
    if (!blocked.includes(location.pathname)) {

    } else{
      //styleRef.remove();
    }
  }, [location.pathname]);

  return null; // This component only loads CSS
}

  return (
    <HashRouter basename="">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route exact path="/" element={<Home/>} style={{background: "red"}} />
          <Route exact path="/graves" element={<NotableGraves />} />
          <Route exact path="/explore" element={<Explore />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/Locate_Burials&Graves" element={<LocateBurialsOrGraves />} />
          <Route exact path="/burialfinder" element={<BurialMap />} />
          <Route exact path="/Tours" element={<ToursNav />} />
          <Route exact path="/biolist" element={<BioList/>}/>
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
        <DynamicCSSLoader/>
      </Suspense>
    </HashRouter>
  );
}

export default App;
