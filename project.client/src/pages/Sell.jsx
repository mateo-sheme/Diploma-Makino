import { useState } from "react";
import "bootswatch/dist/Litera/bootstrap.css";
import "./Sell.css";

// Sample car data for dropdowns
const carBrands = {
    "Toyota": ["Corolla", "Camry", "RAV4", "Prius", "Hilux"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
    "Ford": ["Fiesta", "Focus", "Mustang", "Explorer", "F-150"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "i8"],
    "Mercedes": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"]
};

const Sell = () => {
    // Form state
    const [formData, setFormData] = useState({
        VIN: '',
        Brand: '',
        Model: '',
        Kilometers: '',
        Transmission: '',
        Fuel: '',
        Year: '',
        Usage: '',
        Contact_Number: '',
        Price: ''
    });

    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [models, setModels] = useState([]);
    const [success, setSuccess] = useState(false);

    // Regex patterns
    const patterns = {
        VIN: /^[A-HJ-NPR-Z0-9]{17}$/, // Standard VIN pattern
        Contact_Number: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}$/ // International phone format
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update models dropdown when brand changes
        if (name === "Brand") {
            setModels(carBrands[value] || []);
            setFormData(prev => ({
                ...prev,
                Brand: value,
                Model: '' // Reset model when brand changes
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 10) {
            setError("You can upload a maximum of 10 images");
            return;
        }
        setImages(files);
        setError(null);
    };

    const validateForm = () => {
        // VIN validation
        if (!patterns.VIN.test(formData.VIN)) {
            setError("Please enter a valid 17-character VIN (letters and numbers only)");
            return false;
        }

        // Phone number validation
        if (!patterns.Contact_Number.test(formData.Contact_Number)) {
            setError("Please enter a valid phone number (e.g., +355 69 123 4567)");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            return;
        }


        try {
            const submissionData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submissionData.append(key, value);
            });

            images.forEach((image) => {
                submissionData.append(`images`, image);
            });

            const response = await fetch('api/car', {
                method: 'POST',
                body: submissionData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create listing');
            }

            setFormData({
                VIN: '',
                Brand: '',
                Model: '',
                Kilometers: '',
                Transmission: '',
                Fuel: '',
                Year: '',
                Usage: '',
                Price: '',
                Contact_Number: ''
            });
            setImages([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="sell-page container-fluid">
            <div className="row justify-content-center">
                {/* LEFT: FORM */}
                <div className="col-md-6 p-4">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-white mb-4">Create Listing</h2>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">Listing created successfully!</div>}

                        <fieldset className="mb-4">
                            <div className="mb-3">
                                <label className="form-label text-white">VIN (Vehicle Identification Number)*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="VIN"
                                    value={formData.VIN}
                                    onChange={handleChange}
                                    pattern="[A-HJ-NPR-Z0-9]{17}"
                                    title="17-character VIN (letters and numbers)"
                                    required
                                />
                                <small className="text-white-50">17 characters (letters and numbers)</small>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Brand*</label>
                                <select
                                    className="form-select"
                                    name="Brand"
                                    value={formData.Brand}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Brand...</option>
                                    {Object.keys(carBrands).map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Model*</label>
                                <select
                                    className="form-select"
                                    name="Model"
                                    value={formData.Model}
                                    onChange={handleChange}
                                    disabled={!formData.Brand}
                                    required
                                >
                                    <option value="">Select Model...</option>
                                    {models.map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Year*</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="Year"
                                    value={formData.Year}
                                    onChange={handleChange}
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Kilometers*</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="Kilometers"
                                    value={formData.Kilometers}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Fuel Type*</label>
                                <select
                                    className="form-select"
                                    name="Fuel"
                                    value={formData.Fuel}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Gasoline">Gasoline</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Transmission*</label>
                                <select
                                    className="form-select"
                                    name="Transmission"
                                    value={formData.Transmission}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Usage</label>
                                <select
                                    className="form-select"
                                    name="Usage"
                                    value={formData.Usage}
                                    onChange={handleChange}
                                    >
                                    <option value="">Select...</option>
                                    <option value="Used">Used</option>
                                    <option value="New">New</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Price (€)*</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="Price"
                                    value={formData.Price}
                                    onChange={handleChange}
                                    min="0"
                                    step="100"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-white">Contact Number*</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="Contact_Number"
                                    value={formData.Contact_Number}
                                    onChange={handleChange}
                                    pattern="[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,15}"
                                    required
                                    placeholder="eg. +355 11 222 3333"
                                />
                            </div>
                        </fieldset>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Listing'}
                        </button>
                    </form>
                </div>

                {/* RIGHT: IMAGE UPLOAD */}
                <div className="col-md-6 p-4">
                    <h2 className="text-white mb-4">Upload Photos</h2>
                    <p className="text-white-50">Upload up to 10 photos of your vehicle</p>

                    <input
                        type="file"
                        className="form-control mb-3"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    {images.length > 0 && (
                        <div className="alert alert-info">
                            {images.length} image(s) selected
                        </div>
                    )}

                    <div className="row">
                        {images.map((img, idx) => (
                            <div className="col-4 mb-3" key={idx}>
                                <div className="position-relative">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`preview ${idx}`}
                                        className="img-thumbnail preview-img"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sell;