import logo from './logo.svg';
import './App.css';
import Landing from './main/landing'
import BurialMap from './burial_finder/BurialMap'
import ToursMap from './tours_finder/Tours_Map'
import WebModal from './tours_finder/WebModal'
function App() {
  return (
    // <ToursMap/>
    // <BurialMap/>
    <div>
      <WebModal link="https://www.google.com/"/>
    </div>
  );
}

export default App;
