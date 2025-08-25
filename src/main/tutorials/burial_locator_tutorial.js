import Navbar from "shared/components/Web/navbar"
import Footer from "shared/components/Web/footer"

function BurialFinderTutorial() {
  return (
    <>
      <Navbar />
      <a href="#menu" className="navPanelToggle">
        <span className="fa fa-bars" />
      </a>

      {/* Main */}
      <section id="main" className="wrapper">
        <div className="container">
          <header className="major">
            <h2>Albany Rural Cemetery Burial Locator Tutorial</h2>
          </header>

          <h3>
            To utilize the Burial Locator tool, First and Last names of the
            individual buried must be known!
          </h3>

          <p>
            Welcome to the ARC Burial Locator tutorial. The information is assembled
            to provide orientation of this location-based application to view data
            and navigate within the Albany Rural Cemetery. This map tool may be
            accessed using any Internet connected device including desktop
            computers, mobile phones or tablets.
          </p>

          <a href="test.html" className="image left">
            <img src="images/Burial_Locator_Map.jpg" alt="" />
          </a>

          <p>
            Entering into the application the user is greeted with the Cemetery
            boundary against a color satellite image as background at top, and a Data
            Input console at bottom.
            <br />
            <a href="#" className="image left">
              <img src="images/Layer List.jpg" alt="" />
            </a>
            <a href="#" className="image right">
              <img src="images/NONE.jpg" alt="" />
            </a>
            The layer list in the map’s upper right-hand corner controls the
            visibility of layers displayed.
            <br /> Turning on the Image Clarity data has higher resolution at
            maximum zoom-in scale.
          </p>

          <p>
            <b>Burial Locator Data Input Console</b> <br />
            <a href="#" className="image left">
              <img src="images/Burial_Data_Input_console.jpg" alt="" />
            </a>
            <a href="#" className="image right">
              <img src="images/Burial_Selected_Location.jpg" alt="" />
            </a>
            This tool conducts a search of burial data. Input criteria filters the
            selection; Exploring results permits selection of a single record.
            <br />
            <b>Step 1-</b> Begin by entering the <b>Last Name</b> of the burial to be
            located, on the space immediately below the Last_Name column title.
            <br />
            <b>Step 2-</b> Enter the <b>First name</b> in its column.
            <br />
            <b>Step 3-</b> Toggle through the selections. Identify the burial by
            checkmark; The target location appears as a blue pointer.
          </p>

          <a href="#" className="image right">
            <img src="images/Burial_Locator_Filters.jpg" alt="" />
          </a>

          <p>
            <b>Burial Locator Filters</b>
            <br />
            Both layered-line icons as circled reveal the filtering options.
            <br />
            <b>Contains</b> is the default, however, when entering the last name,{" "}
            <b>Equals</b> may be a preferred choice.
            <br />
            Statistics appear at the bottom right of the input screen. Tapping
            directional carets illustrated below (<b>&lt; &gt;</b>) allows
            inspection of the filter results one record at a time.
            <br />
            Filtering of Birth and Death dates where displayed may further narrow
            the record search.
          </p>

          <a href="#" className="image left">
            <img src="images/Burial_Filter_Statistics.jpg" alt="" />
          </a>

          <p>
            <b>
              In the upper left corner of the map are a series of control icons. A
              mouseover of any icon responds with its purpose.
            </b>
          </p>

          <a href="#" className="image left">
            <img src="images/Zoom.jpg" alt="" />
          </a>

          <p>
            <b>Zoom in/Zoom out</b>. Alternatively, the scroll on the desktop’s mouse
            will also perform this function. Dragging with the mouse performs the Pan
            function.
          </p>

          <a href="#" className="image right">
            <img src="images/GravefinderWhereamI_sm.jpg" alt="" />
          </a>
          <a href="#" className="image left">
            <img src="images/Where Am I.jpg" alt="" />
          </a>

          <p>
            <b>Where Am I?</b> Using the GPS features of a smartphone or tablet,
            your current position will be located. GPS position is indicated by a
            Blue dot. The surrounding lighter blue circle indicates the accuracy
            range of your GPS signal.
          </p>

          <h5>Usage Notes:</h5>
          The burials database contains 100,000 records, including recent burials up
          to May 2021. It is acknowledged that not all ARC burials are included in
          this database. Many older burials and burial places require further
          investigation. Work is continuing to improve these data.
          <br />
          A high percentage of records contain a Death date which can assist in
          record selection, as can the Birth date if this value has been recorded.
          Both fields can be filtered using the same process employed with the name
          fields.
          <br />
          If the burial is in a Tier, examination of the selected record may also
          reveal the grave position, useful to interpret the burial distance from
          the beginning of the Tier.
          <br /> The table of contents has been expanded to include 2 different image
          backgrounds. The source titled “Image Clarity” has higher resolution at
          maximum zoom scale.
          <br />
          Activating the <b>Where am I</b> tool will highlight your present position
          and allow navigation to the selected Lot or Tier.
        </div>
      </section>

      <Footer />
    </>
  )
}

export default BurialFinderTutorial
