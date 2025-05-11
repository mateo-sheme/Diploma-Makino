import { useState } from "react";
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Search.css";

const Search = () => {
    const [filters, setFilters] = useState({
        brand: '',
        model: '',
        fuelType: '',
        transmission: '',
        minPrice: '',
        maxPrice: '',
        minKm: '',
        maxKm: '',
        minYear: '',
        maxYear: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Sample car brands and models data
    const carBrands = {
        "Toyota": ["Corolla", "Camry", "RAV4", "Prius", "Hilux"],
        "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
        "Ford": ["Fiesta", "Focus", "Mustang", "Explorer", "F-150"],
        "BMW": ["3 Series", "5 Series", "X3", "X5", "i8"],
        "Mercedes": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"]
    };

    const models = filters.brand ? carBrands[filters.brand] || [] : [];

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Filters */}
                <div className="col-md-3">
                    <div className="filters p-3 bg-light rounded shadow-sm">
                        <h5>Filters</h5>

                        <div className="mb-3">
                            <label className="form-label">Brand</label>
                            <select
                                className="form-select"
                                name="brand"
                                value={filters.brand}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Brands</option>
                                {Object.keys(carBrands).map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Model</label>
                            <select
                                className="form-select"
                                name="model"
                                value={filters.model}
                                onChange={handleFilterChange}
                                disabled={!filters.brand}
                            >
                                <option value="">All Models</option>
                                {models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fuel Type</label>
                            <select
                                className="form-select"
                                name="fuelType"
                                value={filters.fuelType}
                                onChange={handleFilterChange}
                            >
                                <option value="">All</option>
                                <option value="Gasoline">Gasoline</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Transmission</label>
                            <select
                                className="form-select"
                                name="transmission"
                                value={filters.transmission}
                                onChange={handleFilterChange}
                            >
                                <option value="">All</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">KM From</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="minKm"
                                    value={filters.minKm}
                                    onChange={handleFilterChange}
                                    placeholder="0"
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">KM To</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="maxKm"
                                    value={filters.maxKm}
                                    onChange={handleFilterChange}
                                    placeholder="200000"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Year From</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="minYear"
                                    value={filters.minYear}
                                    onChange={handleFilterChange}
                                    min="1900"
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">Year To</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="maxYear"
                                    value={filters.maxYear}
                                    onChange={handleFilterChange}
                                    max={new Date().getFullYear() + 1}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Price From (€)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">Price To (€)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary w-100">Apply Filters</button>
                    </div>
                </div>

                {/* Search Results */}
                <div className="col-md-9">
                    {/* Sample car card - you would map through actual results */}
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
                                        <small className="text-muted">VIN: WDB12345678901234</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;