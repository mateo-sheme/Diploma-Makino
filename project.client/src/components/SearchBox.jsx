import { useState } from "react";
import "./Searchbox.css"; // Import global styles

const SearchBox = () => {
    const [searchParams, setSearchParams] = useState({
        brand: "",
        model: "",
        price: "",
        location: "",
        paymentMethod: "buying",
        electricOnly: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSearch = () => {
        console.log("Searching with:", searchParams);
    };

    return (
        <div className="search-box">
            <div className="form-group">
                <select name="brand" onChange={handleChange}>
                    <option value="">Any Brand</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Audi">Audi</option>
                </select>

                <input
                    type="text"
                    name="model"
                    placeholder="Model"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Max Price"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="location"
                    placeholder="City / Zip Code"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="buying"
                        checked={searchParams.paymentMethod === "buying"}
                        onChange={handleChange}
                    />
                    Buying
                </label>

                <label>
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="leasing"
                        checked={searchParams.paymentMethod === "leasing"}
                        onChange={handleChange}
                    />
                    Leasing
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="electricOnly"
                        checked={searchParams.electricOnly}
                        onChange={handleChange}
                    />
                    Electric Cars Only
                </label>
            </div>

            <button onClick={handleSearch} className="search-button">
                Search Offers
            </button>
        </div>
    );
};

export default SearchBox;
