import { HashRouter as Router, Routes, Route } from "react-router-dom"; //hashrouter from react router uses # for navigation, prevents need server-side routing. Routes groups all different route components and route defines the specific page
import Menu1 from "./Pages/Menu1";
import Menu2 from "./Pages/Menu2";
import PromoVids from "./Pages/PromoVids";
import SpecialOffers from "./Pages/SpecialOffers"; //import all the different components for the menu pages

function App() {
  return (
    <Router>
      {/*wrap everything in shorted router*/}
      <Routes>
        {/*hold all page routes in group*/}
        <Route path="/Menu1" element={<Menu1 />} />
        <Route path="/Menu2" element={<Menu2 />} />
        {/*Each route has a url path and the component to show*/}
        <Route path="/PromoVids" element={<PromoVids />} />
        <Route path="/SpecialOffers" element={<SpecialOffers />} />
      </Routes>
    </Router>
  );
}

export default App;
