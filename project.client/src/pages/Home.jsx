import SearchBox from '../components/searchbox.jsx';
import "bootswatch/dist/Litera/bootstrap.css";

function Home() {
    return (
        <div className="homepage">
            {/* Main Banner Section */}
            <div className="banner-container">
                <img
                    src="/src/assets/Baner.jpg"
                    alt="Makino Car Marketplace"
                    className="banner-image w-100"
                />
            </div>

            {/* Search Section */}
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <SearchBox />
                    </div>
                </div>
            </div>

            {/* Three Column Section */}
            <div className="container mt-5">
                <div className="row">
                    {/* Left Column - Advertising */}
                    <div className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h2>Advertising Here</h2>
                                <h3>MyKino1</h3>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Model Filters */}
                    <div className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h3>Model</h3>
                                <ul className="list-unstyled">
                                    <li>Max Pri®</li>
                                    <li>City / Zip C</li>
                                    <li>Buying</li>
                                    <li>Leasing</li>
                                    <li>Electric</li>
                                    <li>Cars</li>
                                    <li>Only</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Search Offers */}
                    <div className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h3>Search Offers</h3>
                                {/* Add your search offers content here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;