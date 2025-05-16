import { useState, useEffect } from "react";
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

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchCars = async () => {
        try {
            setLoading(true);
            setError(null);

            // Convert filter names to match your API parameters
            const apiParams = {
                brand: filters.brand,
                model: filters.model,
                fuelType: filters.fuelType,
                transmission: filters.transmission,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                minKm: filters.minKm,
                maxKm: filters.maxKm,
                minYear: filters.minYear,
                maxYear: filters.maxYear
            };

            // Build query string, removing empty params
            const queryString = Object.entries(apiParams)
                .filter(([, value]) => value !== '')  // Now properly using both parameters
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

            const response = await fetch(`/api/car/search?${queryString}`);

            if (!response.ok) {
                throw new Error('Failed to fetch cars');
            }

            const data = await response.json();
            setCars(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, [filters]);

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
                <aside className="col-md-3">
                    <div className="filters p-4 bg-white rounded shadow-sm">
                        <h5 className="mb-4 filter-cars" > Filter Cars</h5>

                        <div className="mb-3">
                            <label className="form-label">Brand</label>
                            <select className="form-select" name="brand" value={filters.brand} onChange={handleFilterChange}>
                                <option value="">All Brands</option>
                                {Object.keys(carBrands).map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Model</label>
                            <select className="form-select" name="model" value={filters.model} onChange={handleFilterChange} disabled={!filters.brand}>
                                <option value="">All Models</option>
                                {models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fuel Type</label>
                            <select className="form-select" name="fuelType" value={filters.fuelType} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="Gasoline">Gasoline</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Transmission</label>
                            <select className="form-select" name="transmission" value={filters.transmission} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>
                        </div>

                        <div className="row g-2 mb-3">
                            <div className="col">
                                <label className="form-label">KM From</label>
                                <input type="number" className="form-control" name="minKm" value={filters.minKm} onChange={handleFilterChange} placeholder="0" />
                            </div>
                            <div className="col">
                                <label className="form-label">KM To</label>
                                <input type="number" className="form-control" name="maxKm" value={filters.maxKm} onChange={handleFilterChange} placeholder="200000" />
                            </div>
                        </div>

                        <div className="row g-2 mb-3">
                            <div className="col">
                                <label className="form-label">Year From</label>
                                <input type="number" className="form-control" name="minYear" value={filters.minYear} onChange={handleFilterChange} />
                            </div>
                            <div className="col">
                                <label className="form-label">Year To</label>
                                <input type="number" className="form-control" name="maxYear" value={filters.maxYear} onChange={handleFilterChange} max={new Date().getFullYear() + 1} />
                            </div>
                        </div>

                        <div className="row g-2 mb-4">
                            <div className="col">
                                <label className="form-label">Price From (€)</label>
                                <input type="number" className="form-control" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />
                            </div>
                            <div className="col">
                                <label className="form-label">Price To (€)</label>
                                <input type="number" className="form-control" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="col-md-9">
                    {loading && <div className="text-center my-4">Loading cars...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {cars.length === 0 && !loading ? (
                        <div className="alert alert-info">No cars found matching your criteria.</div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                                {cars.map(car => (
                                    <div key={car.car_ID} className="col">
                                        <div className="car-card card h-100 shadow-sm d-flex flex-column">
                                            {car.images?.length > 0 ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${car.images[0].imageData}`}
                                                    className="card-img-top car-image"
                                                    alt={`${car.brand} ${car.model}`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/path/to/fallback-image.jpg';
                                                    }}
                                                />
                                            ) : (
                                                <div className="car-image-placeholder d-flex align-items-center justify-content-center bg-secondary text-white">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="card-body d-flex flex-column">
                                                <div>
                                                    <h5 className="card-title">{car.brand} {car.model}</h5>
                                                    <p className="card-text">
                                                        <strong>{'\u20AC'}{car.price?.toLocaleString()}</strong> | {car.usage} | {car.year} | {car.kilometers?.toLocaleString()} km | {car.fuel} | {car.transmission}
                                                    </p>
                                                    <p className="card-text">
                                                        <small className="text-muted">VIN: {car.vin}</small>
                                                    </p>
                                                </div>

                                                <div className="mt-auto pt-3">
                                                    <button className="btn btn-primary w-100">View Details</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Search;
