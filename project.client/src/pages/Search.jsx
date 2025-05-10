import { } from "react";
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Search.css";

const Search = () => {
    return (
        <div className="container mt-4">
            <div className="row">
                {/* Filters */}
                <div className="col-md-3">
                    <div className="filters p-3 bg-light rounded shadow-sm">
                        <h5>Filters</h5>

                        <div className="mb-3">
                            <label className="form-label">Brand</label>
                            <select className="form-select">
                                <option>All</option>
                                <option>Mercedes</option>
                                <option>BMW</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Model</label>
                            <select className="form-select">
                                <option>All</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fuel Type</label>
                            <select className="form-select">
                                <option>All</option>
                                <option>Gasoline</option>
                                <option>Diesel</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">KM From</label>
                            <input type="number" className="form-control" placeholder="0" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">KM To</label>
                            <input type="number" className="form-control" placeholder="200000" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Price From (€)</label>
                            <input type="number" className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Price To (€)</label>
                            <input type="number" className="form-control" />
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                <div className="col-md-9">
                    <div className="car-card card mb-4 shadow-sm">
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img
                                    src="https://via.placeholder.com/300x200"
                                    className="img-fluid rounded-start"
                                    alt="car"
                                />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Mercedes-Benz E 200 Kompressor</h5>
                                    <p className="card-text">
                                        <strong>€7,000</strong> • Used • June 2000 • 131,000 km •
                                        Gasoline (Euro 3) • Automatic
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">*ISCRITTA ASI*</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Repeat the above .car-card block for other results */}
                </div>
            </div>
        </div>
    );
};

export default Search;
