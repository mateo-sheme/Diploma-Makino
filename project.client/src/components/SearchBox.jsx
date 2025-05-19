import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Searchbox.css";

const SearchBox = () => {
    const [searchParams, setSearchParams] = useState({
        brand: "",
        model: "",
        minPrice: "",
        maxPrice: "",
        fuelType: "",
        transmission: "",
        minYear: "",
        maxYear: "",
        minKm: "",
        maxKm: ""
    });

    const navigate = useNavigate();

    const carBrands = {
        "Toyota": ["Corolla", "Camry", "RAV4", "Prius", "Hilux"],
        "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
        "Ford": ["Fiesta", "Focus", "Mustang", "Explorer", "F-150"],
        "BMW": ["3 Series", "5 Series", "X3", "X5", "i8"],
        "Mercedes": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"]
    };

    const models = searchParams.brand ? carBrands[searchParams.brand] || [] : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value,
            ...(name === "brand" ? { model: "" } : {})
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        // Create URL parameters from non-empty fields
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });

        // Navigate to search page with parameters
        navigate(`/search?${params.toString()}`);
    };

    return (
        <div className="search-box">
            <form onSubmit={handleSearch}>
                <div className="form-group">
                    <select
                        name="brand"
                        value={searchParams.brand}
                        onChange={handleChange}
                    >
                        <option value="">Any Brand</option>
                        {Object.keys(carBrands).map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>

                    <select
                        name="model"
                        value={searchParams.model}
                        onChange={handleChange}
                        disabled={!searchParams.brand}
                    >
                        <option value="">Any Model</option>
                        {models.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="minPrice"
                        value={searchParams.minPrice}
                        onChange={handleChange}
                        placeholder="Min Price"
                    />

                    <input
                        type="number"
                        name="maxPrice"
                        value={searchParams.maxPrice}
                        onChange={handleChange}
                        placeholder="Max Price"
                    />
                </div>

                <div className="form-group">
                    <select
                        name="usage"
                        value={searchParams.usage}
                        onChange={handleChange}
                    >
                        <option value="">Usage</option>
                        <option value="Used">Used</option>
                        <option value="New">New</option>
                    </select>

                    <select
                        name="fuelType"
                        value={searchParams.fuelType}
                        onChange={handleChange}
                    >
                        <option value="">Fuel</option>
                        <option value="Gasoline">Gasoline</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>

                    <select
                        name="transmission"
                        value={searchParams.transmission}
                        onChange={handleChange}
                    >
                        <option value="">Transmission</option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                    </select>
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="minYear"
                        value={searchParams.minYear}
                        onChange={handleChange}
                        placeholder="Min Year"
                        min="1900"
                    />

                    <input
                        type="number"
                        name="maxYear"
                        value={searchParams.maxYear}
                        onChange={handleChange}
                        placeholder="Max Year"
                        max={new Date().getFullYear() + 1}
                    />

                    <button type="submit" className="search-button">
                        Search Offers
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchBox;
