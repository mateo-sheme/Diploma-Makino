import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Search.css";
import { useLanguage } from "../../contexts/LanguageContext";

const Search = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        brand: searchParams.get('brand') || '',
        model: searchParams.get('model') || '',
        fuelType: searchParams.get('fuelType') || '',
        transmission: searchParams.get('transmission') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        minKm: searchParams.get('minKm') || '',
        maxKm: searchParams.get('maxKm') || '',
        minYear: searchParams.get('minYear') || '',
        maxYear: searchParams.get('maxYear') || ''
    });

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCars = async () => {
        try {
            setLoading(true);
            setError(null);

            const queryString = Object.entries(filters)
                .filter(([, value]) => value !== '')
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

            navigate(`?${queryString}`, { replace: true });

            const response = await fetch(`/api/car/search?${queryString}`);
            if (!response.ok) throw new Error(t('failedToFetchCars'));

            const data = await response.json();
            setCars(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            ...(name === "brand" ? { model: "" } : {})
        }));
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

    // Translate fuel types and transmissions
    const fuelTypeOptions = [
        { value: "Gasoline", label: t("gasoline") },
        { value: "Diesel", label: t("diesel") },
        { value: "Electric", label: t("electric") },
        { value: "Hybrid", label: t("hybrid") }
    ];

    const transmissionOptions = [
        { value: "Manual", label: t("manual") },
        { value: "Automatic", label: t("automatic") }
    ];

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <div className="filters p-4 bg-white rounded shadow-sm">
                        <h5 className="mb-4 filter-cars">{t("filterCars")}</h5>

                        <div className="mb-3">
                            <label className="form-label">{t("brand")}</label>
                            <select className="form-select" name="brand" value={filters.brand} onChange={handleFilterChange}>
                                <option value="">{t("anyBrand")}</option>
                                {Object.keys(carBrands).map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">{t("model")}</label>
                            <select className="form-select" name="model" value={filters.model} onChange={handleFilterChange} disabled={!filters.brand}>
                                <option value="">{t("anyModel")}</option>
                                {models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">{t("fuel")}</label>
                            <select className="form-select" name="fuelType" value={filters.fuelType} onChange={handleFilterChange}>
                                <option value="">{t("all")}</option>
                                {fuelTypeOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">{t("transmission")}</label>
                            <select className="form-select" name="transmission" value={filters.transmission} onChange={handleFilterChange}>
                                <option value="">{t("all")}</option>
                                {transmissionOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="row g-2 mb-3">
                            <div className="col">
                                <label className="form-label">{t("minPrice")}</label>
                                <input type="number" className="form-control" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="0" />
                            </div>
                            <div className="col">
                                <label className="form-label">{t("maxPrice")}</label>
                                <input type="number" className="form-control" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="200000" />
                            </div>
                        </div>

                        <div className="row g-2 mb-3">
                            <div className="col">
                                <label className="form-label">{t("minYear")}</label>
                                <input type="number" className="form-control" name="minYear" value={filters.minYear} onChange={handleFilterChange} />
                            </div>
                            <div className="col">
                                <label className="form-label">{t("maxYear")}</label>
                                <input type="number" className="form-control" name="maxYear" value={filters.maxYear} onChange={handleFilterChange} max={new Date().getFullYear() + 1} />
                            </div>
                        </div>

                        <div className="row g-2 mb-4">
                            <div className="col">
                                <label className="form-label">{t("minKm")}</label>
                                <input type="number" className="form-control" name="minKm" value={filters.minKm} onChange={handleFilterChange} />
                            </div>
                            <div className="col">
                                <label className="form-label">{t("maxKm")}</label>
                                <input type="number" className="form-control" name="maxKm" value={filters.maxKm} onChange={handleFilterChange} />
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="col-md-9">
                    {loading && <div className="text-center my-4">{t("loadingCars")}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {cars.length === 0 && !loading ? (
                        <div className="alert alert-info">{t("noCarsFound")}</div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {cars.map(car => (
                                <div key={car.car_ID} className="col">
                                    <div className="car-card card h-100 shadow-sm d-flex flex-column">
                                        {car.images?.length > 0 ? (
                                            <img
                                                src={`/api/car/${car.car_ID}/image/${car.images[0].image_ID}`}
                                                className="card-img-top car-image"
                                                alt={`${car.brand} ${car.model}`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        ) : (
                                            <div className="car-image-placeholder d-flex align-items-center justify-content-center bg-secondary text-white">
                                                {t("noImage")}
                                            </div>
                                        )}
                                        <div className="card-body d-flex flex-column">
                                            <div>
                                                <h5 className="card-title">{car.brand} {car.model}</h5>
                                                <p className="card-text">
                                                    <strong>{car.price?.toLocaleString(language)} {'\u20AC'}</strong> | {t(car.usage?.toLowerCase())} | {car.year} | {car.kilometers?.toLocaleString(language)} {t("kilometers")} | {t(car.fuel?.toLowerCase())} | {t(car.transmission?.toLowerCase())}
                                                </p>
                                                <p className="card-text">
                                                    <small className="text-muted">VIN: {car.vin}</small>
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-3">
                                                <button
                                                    className="btn-details btn-primary w-100"
                                                    onClick={() => navigate(`/car/${car.car_ID}`)}>
                                                    {t("viewDetails")}
                                                </button>
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