import Navbar from "shared/components/Web/navbar"
import Footer from "shared/components/Web/footer"

function NotableGraves() {
    return (
        <div style={{paddingTop: "6em"}}>
            <Navbar />
            <a href="#menu" className="navPanelToggle"><span className="fa fa-bars"></span></a>
            <section id="main" className="wrapper">
                <div className="container">

                    <header className="major special">
                        <h2>Notable graves</h2>
                        <p>Notable Graves in the Albany Rural Cemetery</p>
                    </header>

                    <p>
                        Albany Rural Cemetery, incorporated in 1841, is one of the oldest and grandest
                        examples of the rural cemetery movement in America. Historians come from around the
                        country and overseas to walk its 467 acres, to study its stately monuments and to savor
                        its parklike setting. It earned a spot on the National Register of Historic Places.
                    </p>

                    <p>
                        Here are showcases of notable gravestones in the Albany Rural Cemetery, which we will continue to update with our collection in this project.
                    </p>

                    <div className="feature-grid">

                        <div className="feature">
                            <a href="Stoneman21.html">
                                <div className="image rounded">
                                    <img src="assets/images/Stoneman21d.jpg" alt="" />
                                </div>
                            </a>
                            <div className="content">
                                <header>
                                    <h4>Kate Stoneman</h4>
                                    <p>The First female attorney in New York</p>
                                </header>
                            </div>
                        </div>

                        <div className="feature">
                            <a href="Arthur18.html">
                                <div className="image rounded">
                                    <img src="images/Arthur18c.jpg" alt="" />
                                </div>
                            </a>
                            <div className="content">
                                <header>
                                    <h4>President Chester Arthur</h4>
                                    <p>21st President of the United States, creator of the Civil Service Commission, advocate for equal rights for blacks, and father of the American Navy</p>
                                </header>
                            </div>
                        </div>

                        <div className="feature">
                            <a href="Corning41.html">
                                <div className="image rounded">
                                    <img src="images/Corning38c.jpg" alt="" />
                                </div>
                            </a>
                            <div className="content">
                                <header>
                                    <h4>Erastus Corning II</h4>
                                    <p>New York State Assembly, New York State Senate, Longest Serving Mayor of Albany</p>
                                </header>
                            </div>
                        </div>

                        <div className="feature">
                            <a href="Soldier33.html">
                                <div className="image rounded">
                                    <img src="images/Soldier30a.jpg" alt="" />
                                </div>
                            </a>
                            <div className="content">
                                <header>
                                    <h4>Soldiers' Lot</h4>
                                    <p>Burial site of 149 Civil War soldiers</p>
                                </header>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default NotableGraves
