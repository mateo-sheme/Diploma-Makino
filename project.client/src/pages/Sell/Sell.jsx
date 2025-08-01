﻿import { useState, useContext } from "react";
import "bootswatch/dist/litera/bootstrap.css";
import "./Sell.css";
import { AuthContext } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

const carBrands = {
    Toyota: ["Corolla", "Camry", "RAV4", "Prius", "Hilux"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
    Ford: ["Fiesta", "Focus", "Mustang", "Explorer", "F-150"],
    BMW: ["3 Series", "5 Series", "X3", "X5", "i8"],
    Mercedes: ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
};

const initialForm = {
    VIN: "",
    Brand: "",
    Model: "",
    Kilometers: "",
    Transmission: "",
    Fuel: "",
    Year: "",
    Usage: "",
    Contact_Number: "",
    Price: "",
};

export default function Sell() {
    const { t } = useLanguage();
    const { currentUser } = useContext(AuthContext);
    const userId = currentUser?.userId;  // adjust depending on your user object

    const [formData, setFormData] = useState(initialForm);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const patterns = {
        VIN: /^[A-HJ-NPR-Z0-9]{17}$/,
        Contact_Number: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/,
    };

    const models = formData.Brand ? carBrands[formData.Brand] || [] : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "Brand" ? { Model: "" } : {}),
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 10) return setError("Max 10 images allowed");
        setImages(files);
        setError(null);
    };

    const validateForm = () => {
        if (!patterns.VIN.test(formData.VIN)) {
            setError("Invalid VIN. Use 17 letters/numbers.");
            return false;
        }
        if (!patterns.Contact_Number.test(formData.Contact_Number)) {
            setError("Invalid phone number format.");
            return false;
        }
        if (images.length === 0) {
            setError("Please upload at least one image");
            return false;
        }
        if (!userId) {
            setError("User not authenticated.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            // adds all fields of the formdata
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // gets the userid
            formDataToSend.append("userId", userId);

            // adds all the images of the formdata
            images.forEach((image) => {
                formDataToSend.append("images", image);
            });

            const response = await fetch("/api/car", {
                method: "POST",
                body: formDataToSend,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to submit form");
            }

            setSuccess(true);
            setFormData(initialForm);
            setImages([]);
        } catch (err) {
            setError(err.message || "Failed to submit form");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="text-center text-white mb-4">{t('sellYourCar')}</h2>

            <div className="row g-4">
                <form className="col-md-6" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{t('listingCreated')}</div>}

                    {Object.entries({
                        VIN: t('vin'),
                        Brand: t('brand'),
                        Model: t('model'),
                        Year: t('year'),
                        Kilometers: t('kilometers'),
                        Fuel: t('fuelType'),
                        Transmission: t('transmission'),
                        Usage: t('usage'),
                        Price: t('price'),
                        Contact_Number: t('contactNumber'),
                    }).map(([key, label]) => (
                        <div className="mb-3" key={key}>
                            <label className="form-label text-white">{label}*</label>
                            {key === "Brand" || key === "Model" || key === "Fuel" || key === "Transmission" || key === "Usage" ? (
                                <select
                                    className="form-select"
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                    disabled={key === "Model" && !formData.Brand}
                                >
                                    <option value="">{t('select')}...</option>
                                    {(key === "Brand"
                                        ? Object.keys(carBrands)
                                        : key === "Model"
                                            ? models
                                            : key === "Fuel"
                                                ? ["Gasoline", "Diesel", "Electric", "Hybrid"]
                                                : key === "Transmission"
                                                    ? ["Manual", "Automatic"]
                                                    : ["Used", "New"]
                                    ).map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className="form-control"
                                    type={key === "Year" || key === "Kilometers" || key === "Price" ? "number" : "text"}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                />
                            )}
                        </div>
                    ))}

                    <button className="btn btn-primary w-100" disabled={isSubmitting}>
                        {isSubmitting ? t('submitting') : t('submitListing')}
                    </button>
                </form>

                <div className="col-md-6">
                    <label className="form-label text-white">{t('uploadPhotos')}</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                    />

                    <div className="row mt-3">
                        {images.map((img, i) => (
                            <div className="col-4 mb-2" key={i}>
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    className="img-fluid rounded"
                                    style={{ height: "100px", objectFit: "cover" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}