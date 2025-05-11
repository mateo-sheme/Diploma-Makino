import { useState } from "react";
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Searchbox.css";

const SearchBox = () => {
    const [searchParams, setSearchParams] = useState({
        brand: "",
        model: "",
        minPrice: "",
        maxPrice: "",
        location: "",
        fuelType: "",
        transmission: "",
        minYear: "",
        maxYear: ""
    });

    // Sample car brands and models data
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
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching with:", searchParams);
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
                        {Object.keys(carBrands).map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>

                    <select
                        name="model"
                        value={searchParams.model}
                        onChange={handleChange}
                        disabled={!searchParams.brand}
                    >
                        <option value="">Any Model</option>
                        {models.map(model => (
                            <option key={model} value={model}>{model}</option>
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
                        value={searchParams.fuelType}
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