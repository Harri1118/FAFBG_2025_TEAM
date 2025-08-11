const { default: Footer } = require("components/Web/footer");
const { default: Navbar } = require("components/Web/navbar");

function NotableGraves(){
    return (
        <div>
            <Navbar/>
            Notable Graves
            <Footer/>
        </div>
    )
}

export default NotableGraves