import Navbar from 'shared/components/Web/navbar'
import Footer from 'shared/components/Web/footer'

function LocateBurialsOrGraves() {
    return (
        <div style={{paddingTop: "6em"}}>
            <Navbar />
            <a href="#menu" className="navPanelToggle"><span className="fa fa-bars"></span></a>

            {/* Main */}
            <section id="main" className="wrapper">
                <div className="container">
                    <header className="major">
                        <h2>Locate Burials or Graves</h2>
                    </header>

                    <p>
                        The ARC Grave Finder permits the known location of a Section - Lot or a Section - Tier to be displayed within the cemetery.
                    </p>
                    <p>
                        The ARC Burial Locator allows an individual burial to be selected by name, and the burial location to be displayed.
                    </p>
                    <p>
                        If you are using either of these tools for the first time, please start by inspecting either the{" "}
                        <a href="Grave_Finder_tutorial.html"><b>Grave Finder Tutorial</b></a> or the{" "}
                        <a href="Burial_Locator_tutorial.html"><b>Burial Locator Tutorial</b></a> to familiarize yourself with the location-based system.
                    </p>
                    <p>
                        Otherwise please click the <a href="Grave_Finder"><b>ARC Grave Finder</b></a> to locate graves and grave sites.
                    </p>
                    <p>
                        Or, click the <a href="Burial_Locator"><b>ARC Burial Locator</b></a> to select and reveal the locality of a single individual's burial.
                    </p>

                    <section>
                        <h3>Please click individual image for its corresponding function</h3>

                        <div className="row 50% uniform">
                            <div className="4u">
                                <div className="image fit captioned">
                                    <a href="Grave_Finder"><img src="images/ARCGravefinder.jpg" alt="Grave Finder" /></a>
                                    <h3><a href="Grave_Finder">Grave Finder</a></h3>
                                </div>
                            </div>

                            <div className="4u 12u$(xsmall)">
                                <div className="image fit captioned">
                                    <a href="NONE.html"><img src="images/" alt="Placeholder" /></a>
                                    <h3><a href="NONE.html">Coming Soon</a></h3>
                                </div>
                            </div>

                            <div className="4u 12u$(xsmall)">
                                <div className="image fit captioned">
                                    <a href="Burial_Locator"><img src="images/BurialLocator5.png" alt="Burial Locator" /></a>
                                    <h3><a href="Burial_Locator">Burial Locator</a></h3>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default LocateBurialsOrGraves
