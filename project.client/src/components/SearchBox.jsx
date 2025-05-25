import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Searchbox.css";
import { useLanguage } from '../contexts/LanguageContext';

const SearchBox = () => {
    const { t } = useLanguage();
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
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
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
                        <option value="">{t('anyBrand')}</option>
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
                        <option value="">{t('anyModel')}</option>
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
                        placeholder={t('minPrice')}
                    />

                    <input
                        type="number"
                        name="maxPrice"
                        value={searchParams.maxPrice}
                        onChange={handleChange}
                        placeholder={t('maxPrice')}
                    />
                </div>

                <div className="form-group">
                    <select
                        name="usage"
                        value={searchParams.usage}
                        onChange={handleChange}
                    >
                        <option value="">{t('usage')}</option>
                        <option value="Used">{t('used')}</option>
                        <option value="New">{t('new')}</option>
                    </select>

                    <select
                        name="fuelType"
                        value={searchParams.fuelType}
                        onChange={handleChange}
                    >
                        <option value="">{t('fuel')}</option>
                        <option value="Gasoline">{t('gasoline')}</option>
                        <option value="Diesel">{t('diesel')}</option>
                        <option value="Electric">{t('electric')}</option>
                        <option value="Hybrid">{t('hybrid')}</option>
                    </select>

                    <select
                        name="transmission"
                        value={searchParams.transmission}
                        onChange={handleChange}
                    >
                        <option value="">{t('transmission')}</option>
                        <option value="Manual">{t('manual')}</option>
                        <option value="Automatic">{t('automatic')}</option>
                    </select>
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="minYear"
                        value={searchParams.minYear}
                        onChange={handleChange}
                        placeholder={t('minYear')}
                        min="1900"
                    />

                    <input
                        type="number"
                        name="maxYear"
                        value={searchParams.maxYear}
                        onChange={handleChange}
                        placeholder={t('maxYear')}
                        max={new Date().getFullYear() + 1}
                    />

                    <button type="submit" className="search-button">
                        {t('searchOffers')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchBox;