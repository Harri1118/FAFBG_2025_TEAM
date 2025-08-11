function Footer() {

  return (
    <>
        {/* Footer */}
        <footer id="footer">
          <div className="container">
            {/* 
                          <ul class="icons">
                              <li><a href="#" class="icon fa-facebook"></a></li>
                              <li><a href="#" class="icon fa-twitter"></a></li>
                              <li><a href="#" class="icon fa-instagram"></a></li>
                          </ul>
                          */}
            <ul className="copyright">
              <li>
                A collaborative project between Geography and Planning, University at
                Albany SUNY and Albany Rural Cemetery, funded by the Bender Family
                Foundation
              </li>
              <li>© 2025 All Rights Reserved</li>
              {/* <li>Images: <a href="http://unsplash.com">Unsplash</a></li> */}
            </ul>
          </div>
        </footer>
    </>
  );
}

export default Footer;
