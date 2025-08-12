import React from 'react';
//import styles from 'assets/css/main.css'
import Navbar from 'shared/components/Web/navbar';
import Footer from 'shared/components/Web/footer';
function Home(){
    return (
      <>
 <Navbar/>
        {/* Banner */}
        <section id="banner">
          <h2>ALBANY RURAL CEMETERY Explorer</h2>
          <p>
            Discovering local family heritage <br /> and rich Albany history
          </p>
          {/*
                      <ul class="actions">
                          <li><a href="explore.html" class="button default big">Explore the cemetery</a></li>
                      </ul>
                      */}
        </section>
        {/* One */}
        <section id="one" className="wrapper style1">
          <div className="container 75%">
            <div className="row 200%">
              <div className="6u 12u$(medium)">
                <header className="major">
                  <h2>ARC: </h2>
                  <p>albany rural cemetery</p>
                </header>
              </div>
              <div className="6u$ 12u$(medium)">
                <p>
                  Incorporated in 1841, Albany Rural Cemetery is one of the oldest and
                  grandest examples of the rural cemetery movement in America.
                  Historians come from around the country and overseas to walk its 467
                  acres, to study its stately monuments and to savor its parklike
                  setting. It earned a spot on the National Register of Historic
                  Places.
                </p>
                <p>
                  Albany Rural Cemetery has always been much more than a place of
                  burial. It has offered historical, architectural, and sculptural
                  memorials, as well as incredible natural beauty, for all its
                  visitors. Today ARC attracts thousands of visitors each year. They
                  come to pay tribute to loved ones who are deceased, and they come to
                  enjoy the beautiful landscape, streams, waterfalls, and array of
                  funerary art and architecture that is ARC. Albany Rural is also a
                  special haven for walkers, runners, cyclists, and drivers.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Two */}
        <section id="two" className="wrapper style2 special">
          <div className="container">
            <header className="major">
              <h2>highlight</h2>
              <p>Explore themed tours or browse individual biographies</p>
            </header>
            <div className="row 150%">
              <div className="6u 12u$(xsmall)">
                <div className="image fit captioned">
                  <a href="explore.html">
                    <img src="https://www.albany.edu/arce/images/Welcome.jpg" alt="" />
                  </a>
                  <h3>
                    <a href="explore.html">Explore themed tours </a>
                  </h3>
                </div>
              </div>
              <div className="6u$ 12u$(xsmall)">
                <div className="image fit captioned">
                  <a href="biolist.html">
                    {" "}
                    <img src="https://www.albany.edu/arce/images/biolist.jpg" alt="" />
                  </a>
                  <h3>
                    <a href="biolist.html">Browse individual biographies</a>
                  </h3>
                </div>
              </div>
              <div className="6u$ 12u$(xsmall)">
                <div className="image fit captioned">
                  <a href="https://www.albany.edu/arce/Locate_Burials&Graves.html">
                    {" "}
                    <img src="https://www.albany.edu/arce/images/burialorgrave.jpg" alt="" />
                  </a>
                  <h3>
                    <a href="https://www.albany.edu/arce/Locate_Burials&Graves.html">
                      Locate Burials or Graves
                    </a>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Three */}
        <section id="three" className="wrapper style1 special">
          <div className="container">
            <header className="major special">
              <h2>Notable gravestones</h2>
              <p>explore notable graves in the cementery</p>
            </header>
            <div className="feature-grid">
              <div className="feature">
                <a href="Stoneman23.html">
                  <div className="image rounded">
                    <img src="images/Stoneman23gravestone.jpg" alt="" />
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
                <a href="Arthur19.html"></a>
                <div className="image rounded">
                  <a href="Arthur19.html">
                    <img src="images/Arthur19gravestone.jpg" alt="" />{" "}
                  </a>
                </div>
                <div className="content">
                  <header>
                    <h4>President Chester Arthur</h4>
                    <p>
                      21st President of the United States, creator of the Civil
                      Service Commission, advocate for equal rights for blacks, and
                      father of the American Navy
                    </p>
                  </header>
                </div>
              </div>
              <div className="feature">
                <a href="Corning41.html">
                  <div className="image rounded">
                    <img src="images/Corning41gravestone.jpg" alt="" />
                  </div>
                </a>
                <div className="content">
                  <header>
                    <h4>Erastus Corning II </h4>
                    <p>
                      New York State Assemly, New York State Senate, Longest Serving
                      Mayor of Albany{" "}
                    </p>
                  </header>
                </div>
              </div>
              <div className="feature">
                <a href="Soldier33.html">
                  <div className="image rounded">
                    <img src="images/Soldier33gravestone.jpg" alt="" />
                  </div>
                </a>
                <div className="content">
                  <header>
                    <h4>Soldiers' Lot</h4>
                    <p>BURIAL SITE OF 149 CIVIL WAR SOLDIERS</p>
                  </header>
                </div>
              </div>
            </div>
            <ul className="actions">
              <li>
                <a href="graves.html" className="button default big">
                  Click here to view more notable graves
                </a>
              </li>
            </ul>
          </div>
        </section>
        {/* Four */}
        <section id="four" className="wrapper style3 special">
          <div className="container">
            <header className="major">
              <h2>Questions or comments</h2>
              <p>Please contact us to share your thoughts or questions </p>
            </header>
            <ul className="actions">
              <li>
                <a
                  href="http://albanyruralcemetery.org/about-arc/contact-us/"
                  className="button default big"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </section>
            <Footer/>
        {/* Scripts */}
        {/* Default Statcounter code for Albany.edu Arce http://albany.edu/arce/ */}
        <span className="statcounter">
          <a
            id="sc_counter_12013055"
            className="statcounter"
            href="https://www.statcounter.com/"
            target="_blank"
          >
            <img
              src="https://c.statcounter.com/t.php?sc_project=12013055&u1=179F15A291D145D7BEDE61FFD30611E0&java=1&security=41ca97ac&sc_snum=1&sess=832758&sc_rum_e_s=201&sc_rum_e_e=307&sc_rum_f_s=0&sc_rum_f_e=184&p=0&pv=19&rcat=r&rdomo=bing.com&rdomg=1072&jg=1072&rr=2.1.1.1.1.1.1.1.1&resolution=1920&h=1080&camefrom=https%3A//www.albany.edu/arce/explore.html&u=https%3A//www.albany.edu/arce/index.html&t=ARCE%3AAlbany%20Rural%20Cemetery%20Explorer&sc_random=0.618725884579038"
              alt="StatCounter - Free Web Tracker and Counter"
              border={0}
              undefined=""
            />
          </a>
        </span>
        <noscript>
          &lt;div class="statcounter"&gt;&lt;a title="free hit CEMETERYounter"
          href="https://statcounter.com/" target="_blank"&gt;&lt;img
          class="statcounter" src="https://c.statcounter.com/12013055/0/41ca97ac/0/"
          alt="free hit counter"&gt;&lt;/a&gt;&lt;/div&gt;
        </noscript>
        {/* End of Statcounter Code */}
        <a href="#navPanel" className="navPanelToggle" />
        <div id="navPanel">
          <ul>
            <li>
              <a
                href="explore.html"
                style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
              >
                explore
              </a>
            </li>
            <li>
              <a
                href="graves.html"
                style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
              >
                notable graves
              </a>
            </li>
            <li>
              <a
                href="about.html"
                style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
              >
                about us
              </a>
            </li>
            <li>
              <a
                href="http://albanyruralcemetery.org/about-arc/contact-us/"
                style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
              >
                feedback
              </a>
            </li>
            <li>
              <a
                href="https://www.albany.edu/arce/Locate_Burials&Graves.html"
                style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
              >
                locate burials or graves
              </a>
            </li>
          </ul>
          <a
            href="#navPanel"
            className="close"
            style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" }}
          />
        </div>
        </>
        );
}
export default Home;

 