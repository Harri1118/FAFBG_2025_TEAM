import Footer from "shared/components/Web/footer";
import Navbar from "shared/components/Web/navbar";

function Explore() {
    return (
        <div style={{paddingTop: "6em"}}>
            <Navbar />
            <section id="main" className="wrapper">
                <div className="container">
                    <header className="major">
                        <h2>Explore Themes and Tours</h2>
                    </header>

                    <section>
                        <p>
                            The table below lists the current thirteen themes constructed by contributing authors and project staff.
                        </p>
                        <p>
                            If you are using our explorer for the first time, please take a look at our short{" "}
                            <a href="tutorial.html"><b>Tutorial</b></a> to orient yourself with the location-based system. Access provided below.
                        </p>
                        <p>
                            Otherwise please click the <a href="tours.html"><b>Explore Tours</b></a> to start exploring eternity in the cemetery.
                        </p>
                        <p>
                            You can also directly browse <a href="biolist.html"><b>Individual Burials</b></a> without the location-based systems.
                        </p>

                        <h3>Themes in Albany Rural Cemetery Explorer (ARCE)</h3>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Color</th>
                                        <th>Theme</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/AfAr2.jpg" alt="" /></a></td>
                                        <td>African Americans – African Americans in Albany history.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/Art2.jpg" alt="" /></a></td>
                                        <td>Artists – Sculptures, Painters, Illustrators, Cartoonists, Performers, Singers, Musicians, Actors.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/ASG2.jpg" alt="" /></a></td>
                                        <td>Associations, Societies & Groups – Lots containing members of a specific sect, origin or relationship.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/Auth&Pub2.jpg" alt="" /></a></td>
                                        <td>Authors/Publishers – Authors, Journalists, Publishers, Editors, Reporters.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/B&F2.jpg" alt="" /></a></td>
                                        <td>Business and Finance – Industrialists, Manufacturers, Inventors, Bankers, Financiers.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/Church2.jpg" alt="" /></a></td>
                                        <td>Church grounds – Identities inscribed on the headstones.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/CW2.jpg" alt="" /></a></td>
                                        <td>Civil War – Soldiers & Sailors who died during the Civil War.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/Indep2.jpg" alt="" /></a></td>
                                        <td>Independence – Pre-colonial Albany through 1799.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/Notable2.jpg" alt="" /></a></td>
                                        <td>Notables – 1800’s Albany through present day.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/Pillars2.jpg" alt="" /></a></td>
                                        <td>Pillars in Society – Individuals whose contribution fulfilled a need for the betterment of humanity.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/S&S2.jpg" alt="" /></a></td>
                                        <td>Soldiers and Sailors lot – Soldiers & Sailors who died during the Civil War.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/MOA.jpg" alt="" /></a></td>
                                        <td>Mayors of Albany – Former Mayors of Albany.</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" className="image"><img src="images/GAR.jpg" alt="" /></a></td>
                                        <td>GAR – Grand Army of the Republic, Civil War Veterans who died following the period of conflict.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <h3>Please click individual image for its corresponding function</h3>

                    <div className="row 50% uniform">
                        <div className="4u">
                            <div className="image fit captioned">
                                <a href="tutorial.html"><img src="images/Tutorial.jpg" alt="" /></a>
                                <h3><a href="tutorial.html">Orientation Tutorial</a></h3>
                            </div>
                        </div>
                        <div className="4u 12u$(xsmall)">
                            <div className="image fit captioned">
                                <a href="tours.html"><img src="images/Welcome.jpg" alt="" /></a>
                                <h3><a href="tours.html">Explore Themed Tour</a></h3>
                            </div>
                        </div>
                        <div className="4u 12u$(xsmall)">
                            <div className="image fit captioned">
                                <a href="biolist.html"><img src="images/biolist.jpg" alt="" /></a>
                                <h3><a href="biolist.html">Individual Biographies</a></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Explore;
