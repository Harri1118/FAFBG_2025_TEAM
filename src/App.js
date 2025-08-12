import './assets/css/App.css';
import BurialMap from './features/burial_finder/Map';
 import Home from './main/home'
 import Explore from './main/explore'
import { Suspense } from 'react';
 import { BrowserRouter, Switch, Route } from 'react-router-dom';
import About from 'main/about';
import NotableGraves from 'main/notable_graves';
import LocateBurialsOrGraves from 'main/locate_burials_or_graves'
import ToursNav from 'features/tours_finder/Tours_Map'
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {/* Add exact path for root route if needed */}
          <Route exact path="/" component={Home} />
          <Route exact path="/graves" component={NotableGraves}/>
          <Route exact path="/explore" component={Explore}/>
          <Route exact path="/about" component={About}/>
          <Route exact path="/Locate_Burials&Graves" component={LocateBurialsOrGraves}/>
          <Route exact path="/burialfinder" component={BurialMap} />
          <Route exact path="/Tours" component={ToursNav}/>
          {/* Fallback route for unknown paths */}
          <Route render={() => <div>Not found</div>} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
