import SearchBox from '../../components/searchbox.jsx';
import "bootswatch/dist/litera/bootstrap.css";
import "./Home.css";
import Baner from '/assets/baner.png';

function Home() {
    return (
        <div className="homepage">
            {/* Main Banner Section */}
            <div className="banner-container">
                <img
                    src={Baner}
                    alt="Makino Car Marketplace"
                    className="banner-image w-100"
                />
            </div>

            {/* Search Section */}
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <div className="search-container">
                            <SearchBox />
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default Home;