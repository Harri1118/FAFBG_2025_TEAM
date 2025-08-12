import { Link } from "react-router-dom";

function Navbar() {

  return (
    <>
      {/* Header */}
      <header id="header" className="special" >
        <h1>
          <strong>
            <a href="/">ARCE:</a>
          </strong>{" "}
          Albany Rural Cemetery Explorer
        </h1>
        <nav id="nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/graves">Notable Graves</Link>
            </li>
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>
                <Link to="/about">About us</Link>
            </li>
            <li>
                <Link to="/Locate_Burials&Graves">Locate Burials or Graves</Link>
            </li>
            <li>
                <Link to="http://albanyruralcemetery.org/about-arc/contact-us/">Feedback</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
