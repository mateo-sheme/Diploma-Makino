import { useState, useEffect, useContext, useMemo } from "react";
import "bootswatch/dist/litera/bootstrap.css";
import "./DiaryCar.css";
import { AuthContext } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

const carBrands = {
    Toyota: ["Corolla", "Camry", "RAV4", "Prius", "Hilux"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
    Ford: ["Fiesta", "Focus", "Mustang", "Explorer", "F-150"],
    BMW: ["3 Series", "5 Series", "X3", "X5", "i8"],
    Mercedes: ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
};

const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid", "LPG"];

const maintenanceTypes = [
    "Oil Change",
    "Engine Check",
    "Inspection",
    "Tire Rotation",
    "Brake Service",
    "Fluid Change",
    "Filter Replacement",
    "Other"
];

// Local storage for maintenance records
const localMaintenanceRecords = {};

export default function DiaryCar() {
    const { t } = useLanguage();
    const [initialLoad, setInitialLoad] = useState(true);
    const { currentUser } = useContext(AuthContext);
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [showAddCarForm, setShowAddCarForm] = useState(false);
    const [showAddMaintenanceForm, setShowAddMaintenanceForm] = useState(false);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingCarId, setEditingCarId] = useState(null);
    const [editingMaintenance, setEditingMaintenance] = useState(null);
    const [loading, setLoading] = useState(true);

    const [carForm, setCarForm] = useState({
        Nickname_Car: "",
        VIN: "",
        Brand: "",
        Model: "",
        License_Plate: "",
        Current_Kilometers: "",
        Fuel: "",
        Insurance_Expiry: "",
        Inspection_Expiry: ""
    });

    const [maintenanceForm, setMaintenanceForm] = useState({
        Kilometers: "",
        Maintenance_Type: "",
        Next_Maintenance_Km: "",
        Notes: ""
    });

    useEffect(() => {
        if (currentUser?.userId && initialLoad) {
            const loadData = async () => {
                setLoading(true);
                try {
                    await fetchUserCars();
                } finally {
                    setInitialLoad(false);
                    setLoading(false);
                }
            };
            loadData();
        }
    }, [currentUser?.userId, initialLoad]);

    useEffect(() => {
        if (selectedCar?.User_Car_ID) {
            const records = localMaintenanceRecords[selectedCar.User_Car_ID] || [];
            setMaintenanceRecords(records);
        }
    }, [selectedCar?.User_Car_ID]);

    const fetchUserCars = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/diarycar`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error("Failed to fetch cars");
            const data = await response.json();

            const normalizedCars = data.map(car => ({
                User_Car_ID: car.user_Car_ID || car.User_Car_ID,
                User_ID: car.user_ID || car.User_ID,
                Nickname_Car: car.nickname_Car || car.Nickname_Car || "",
                VIN: car.vin || car.VIN || "",
                Brand: car.brand || car.Brand || "",
                Model: car.model || car.Model || "",
                License_Plate: car.license_Plate || car.License_Plate || "",
                Current_Kilometers: car.current_Kilometers || car.Current_Kilometers || 0,
                Fuel: car.fuel || car.Fuel || "",
                Car_Image: car.car_Image || car.Car_Image || null,
                Content_Type: car.content_Type || car.Content_Type || "",
                Insurance_Expiry: car.insurance_Expiry || car.Insurance_Expiry || null,
                Inspection_Expiry: car.inspection_Expiry || car.Inspection_Expiry || null,
                Maintenance_Record: car.maintenance_Record || car.Maintenance_Record || []
            }));

            setCars(normalizedCars);
            setSelectedCar(normalizedCars.length > 0 ? normalizedCars[0] : null);

            normalizedCars.forEach(car => {
                if (!localMaintenanceRecords[car.User_Car_ID]) {
                    localMaintenanceRecords[car.User_Car_ID] = [];
                }
            });
        } catch (err) {
            console.error("Error fetching cars:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCarFormChange = (e) => {
        const { name, value } = e.target;
        setCarForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === "Brand" ? { Model: "" } : {}),
        }));
    };

    const handleMaintenanceFormChange = (e) => {
        const { name, value } = e.target;
        setMaintenanceForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleAddCarSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            Object.entries(carForm).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            formData.append("User_ID", currentUser.userId);
            if (image) formData.append("Car_Image", image);

            const url = editingCarId
                ? `/api/diarycar/${editingCarId}`
                : "/api/diarycar";
            const method = editingCarId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save car");
            }

            const savedCar = await response.json();

            if (editingCarId) {
                setCars(cars.map(c =>
                    c.User_Car_ID === savedCar.User_Car_ID ? savedCar : c
                ));
                if (selectedCar?.User_Car_ID === savedCar.User_Car_ID) {
                    setSelectedCar(savedCar);
                }
            } else {
                setCars([...cars, savedCar]);
                setSelectedCar(savedCar);
                localMaintenanceRecords[savedCar.User_Car_ID] = [];
            }

            setShowAddCarForm(false);
            setEditingCarId(null);
            setCarForm({
                Nickname_Car: "",
                VIN: "",
                Brand: "",
                Model: "",
                License_Plate: "",
                Current_Kilometers: "",
                Fuel: "",
                Insurance_Expiry: "",
                Inspection_Expiry: ""
            });
            setImage(null);
            setSuccess(`Car ${editingCarId ? 'updated' : 'added'} successfully!`);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditCar = (carId) => {
        const carToEdit = cars.find(c => c.User_Car_ID === carId);
        if (!carToEdit) return;

        setEditingCarId(carId);
        setCarForm({
            Nickname_Car: carToEdit.Nickname_Car || "",
            VIN: carToEdit.VIN || "",
            Brand: carToEdit.Brand || "",
            Model: carToEdit.Model || "",
            License_Plate: carToEdit.License_Plate || "",
            Current_Kilometers: carToEdit.Current_Kilometers || "",
            Fuel: carToEdit.Fuel || "",
            Insurance_Expiry: carToEdit.Insurance_Expiry ? carToEdit.Insurance_Expiry.split('T')[0] : "",
            Inspection_Expiry: carToEdit.Inspection_Expiry ? carToEdit.Inspection_Expiry.split('T')[0] : ""
        });

        setImage(null);
        setShowAddCarForm(true);
    };

    const handleEditCarSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            Object.entries(carForm).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            formData.append("User_ID", currentUser.userId);

            if (image) {
                formData.append("Car_Image", image);
            } else {
                formData.append("KeepExistingImage", "true");
            }

            const response = await fetch(`/api/diarycar/${editingCarId}`, {
                method: "PUT",
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update car");
            }

            const updatedCar = await response.json();

            setCars(cars.map(c =>
                c.User_Car_ID === updatedCar.User_Car_ID ? updatedCar : c
            ));

            if (selectedCar?.User_Car_ID === updatedCar.User_Car_ID) {
                setSelectedCar(updatedCar);
            }

            setShowAddCarForm(false);
            setEditingCarId(null);
            setCarForm({
                Nickname_Car: "",
                VIN: "",
                Brand: "",
                Model: "",
                License_Plate: "",
                Current_Kilometers: "",
                Fuel: "",
                Insurance_Expiry: "",
                Inspection_Expiry: ""
            });
            setImage(null);
            setSuccess('Car updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddMaintenanceSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            if (!selectedCar) throw new Error("No car selected");

            const newRecord = {
                Record_ID: editingMaintenance?.Record_ID || Date.now(), // Use timestamp as ID for new records
                User_Car_ID: selectedCar.User_Car_ID,
                Record_Date: new Date().toISOString(),
                Kilometers: parseInt(maintenanceForm.Kilometers),
                Maintenance_Type: maintenanceForm.Maintenance_Type,
                Next_Maintenance_Km: parseInt(maintenanceForm.Next_Maintenance_Km),
                Notes: maintenanceForm.Notes
            };

            // Update local storage instead of API
            if (editingMaintenance) {
                const updatedRecords = (localMaintenanceRecords[selectedCar.User_Car_ID] || []).map(r =>
                    r.Record_ID === newRecord.Record_ID ? newRecord : r
                );
                localMaintenanceRecords[selectedCar.User_Car_ID] = updatedRecords;
                setMaintenanceRecords(updatedRecords);
            } else {
                const updatedRecords = [...(localMaintenanceRecords[selectedCar.User_Car_ID] || []), newRecord];
                localMaintenanceRecords[selectedCar.User_Car_ID] = updatedRecords;
                setMaintenanceRecords(updatedRecords);
            }

            // Update car's current kilometers if needed
            if (parseInt(maintenanceForm.Kilometers) > parseInt(selectedCar.Current_Kilometers)) {
                const updatedCar = {
                    ...selectedCar,
                    Current_Kilometers: maintenanceForm.Kilometers
                };
                setSelectedCar(updatedCar);
                setCars(cars.map(c =>
                    c.User_Car_ID === updatedCar.User_Car_ID ? updatedCar : c
                ));
            }

            setMaintenanceForm({
                Kilometers: "",
                Maintenance_Type: "",
                Next_Maintenance_Km: "",
                Notes: ""
            });
            setShowAddMaintenanceForm(false);
            setEditingMaintenance(null);
            setSuccess(`Maintenance record ${editingMaintenance ? 'updated' : 'added'} successfully!`);
        } catch (err) {
            console.error("Maintenance error:", err);
            setError(err.message);
        }
    };

    const handleEditMaintenance = (record) => {
        setEditingMaintenance(record);
        setMaintenanceForm({
            Kilometers: record.Kilometers,
            Maintenance_Type: record.Maintenance_Type,
            Next_Maintenance_Km: record.Next_Maintenance_Km,
            Notes: record.Notes || ""
        });
        setShowAddMaintenanceForm(true);
    };

    const handleDeleteCar = async (carId) => {
        if (!window.confirm("Are you sure you want to delete this car and all its records?")) return;

        try {
            const response = await fetch(`/api/diarycar/${carId}`, {
                method: "DELETE",
                credentials: 'include'
            });

            if (!response.ok) throw new Error("Failed to delete car");

            setCars(prev => prev.filter(c => c.User_Car_ID !== carId));
            if (selectedCar?.User_Car_ID === carId) {
                setSelectedCar(cars.length > 1 ? cars.find(c => c.User_Car_ID !== carId) : null);
            }
            // Remove local maintenance records for deleted car
            delete localMaintenanceRecords[carId];
            setSuccess("Car deleted successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteMaintenance = (recordId) => {
        if (!window.confirm("Are you sure you want to delete this maintenance record?")) return;

        try {
            // Update local storage instead of API
            const updatedRecords = (localMaintenanceRecords[selectedCar.User_Car_ID] || []).filter(r => r.Record_ID !== recordId);
            localMaintenanceRecords[selectedCar.User_Car_ID] = updatedRecords;
            setMaintenanceRecords(updatedRecords);
            setSuccess("Maintenance record deleted successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    const getCarImageUrl = (car) => {
        if (!car.Car_Image || car.Car_Image.length === 0) return null;
        return `/api/diarycar/${car.User_Car_ID}/image`;
    };

    const models = useMemo(() => {
        return carForm.Brand ? carBrands[carForm.Brand] || [] : [];
    }, [carForm.Brand]);

    const renderCarsList = () => (
        <div className="list-group list-group-flush">
            {cars.map(car => (
                <button
                    key={car.User_Car_ID}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedCar?.User_Car_ID === car.User_Car_ID ? 'active' : ''}`}
                    onClick={() => setSelectedCar(car)}
                >
                    <div>
                        <strong>{car.Nickname_Car || t('unnamedCar')}</strong>
                        <div className="small text-muted">{car.Brand} {car.Model}</div>
                    </div>
                    <div>
                        <button
                            className="edit-btn btn btn-sm btn-outline-primary me-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditCar(car.User_Car_ID);
                            }}
                        >
                            {t('edit')}
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCar(car.User_Car_ID);
                            }}
                        >
                            {t('delete')}
                        </button>
                    </div>
                </button>
            ))}
            {cars.length === 0 && !loading && (
                <div className="list-group-item text-muted">
                    {t('noCarsAdded')}
                </div>
            )}
        </div>
    );

    const renderCarDetails = () => {
        if (!selectedCar) return null;

        return (
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                        {selectedCar.Nickname_Car || t('unnamedCar')}
                        <button
                            className="btn btn-sm btn-light float-end"
                            onClick={() => {
                                setEditingMaintenance(null);
                                setShowAddMaintenanceForm(true);
                            }}
                        >
                            {t('addMaintenance')}
                        </button>
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            {getCarImageUrl(selectedCar) ? (
                                <img
                                    src={getCarImageUrl(selectedCar)}
                                    alt="Car"
                                    className="img-fluid rounded mb-3"
                                />
                            ) : (
                                <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3" style={{ height: '150px' }}>
                                    <span className="text-muted">No image</span>
                                </div>
                            )}
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <strong>VIN:</strong> {selectedCar.VIN}
                                </li>
                                <li className="list-group-item">
                                    <strong>{t("licensePlate")}:</strong> {selectedCar.License_Plate}
                                </li>
                                <li className="list-group-item">
                                    <strong>{t("currentKm")}:</strong> {selectedCar.Current_Kilometers.toLocaleString()}
                                </li>
                                <li className="list-group-item">
                                    <strong>{t("fuel")}:</strong> {selectedCar.Fuel}
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8">
                            <h6 className="mt-4">{t("maintenanceHistory")}</h6>
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>{t('date')}</th>
                                            <th>{t('type')}</th>
                                            <th>{t('kilometers')}</th>
                                            <th>{t('nextMaintenanceKm')}</th>
                                            <th>{t('notes')}</th>
                                            <th>{t('action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maintenanceRecords
                                            .sort((a, b) => new Date(b.Record_Date) - new Date(a.Record_Date))
                                            .map(record => (
                                                <tr key={record.Record_ID}>
                                                    <td>{new Date(record.Record_Date).toLocaleDateString()}</td>
                                                    <td>{record.Maintenance_Type}</td>
                                                    <td>{record.Kilometers.toLocaleString()}</td>
                                                    <td>{record.Next_Maintenance_Km?.toLocaleString() || '-'}</td>  {/* Add this cell */}
                                                    <td>{record.Notes || '-'}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                            onClick={() => handleEditMaintenance(record)}
                                                        >
                                                            {t('edit')}
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteMaintenance(record.Record_ID)}
                                                        >
                                                            {t('delete')}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        {maintenanceRecords.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-muted">{t("noMaintenanceRecord")}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {selectedCar.Insurance_Expiry && (
                                <div className={`alert ${new Date(selectedCar.Insurance_Expiry) < new Date() ? 'alert-danger' : 'alert-info'} mt-3`}>
                                    <strong>Insurance Expiry:</strong> {new Date(selectedCar.Insurance_Expiry).toLocaleDateString()}
                                </div>
                            )}

                            {selectedCar.Inspection_Expiry && (
                                <div className={`alert ${new Date(selectedCar.Inspection_Expiry) < new Date() ? 'alert-danger' : 'alert-info'} mt-2`}>
                                    <strong>Inspection Expiry:</strong> {new Date(selectedCar.Inspection_Expiry).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container py-4 diary-container">
            <h2 className="text-center text-white mb-4">{t("myCarDiary")}</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {/* Cars List */}
                    <div className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">{t("myCars")}</h5>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => {
                                        setEditingCarId(null);
                                        setShowAddCarForm(true);
                                    }}
                                >
                                        {t('addCar')}
                                </button>
                            </div>
                            {renderCarsList()}
                        </div>
                    </div>

                    {/* Selected Car Details */}
                    <div className="col-md-8">
                        {selectedCar ? renderCarDetails() : (
                            <div className="card">
                                <div className="card-body text-center">
                                        <h5>{t("noCarsAdded")}</h5>
                                        <p>{t("addCarToStart")}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setEditingCarId(null);
                                            setShowAddCarForm(true);
                                        }}
                                    >
                                            {t('addFirstCar')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Car Modal */}
            {showAddCarForm && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{editingCarId ? t('editCar') : t('addNewCar')}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowAddCarForm(false);
                                        setEditingCarId(null);
                                        setError(null);
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={editingCarId ? handleEditCarSubmit : handleAddCarSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            {Object.entries({
                                                Nickname_Car: "Nickname (optional)",
                                                VIN: "VIN",
                                                Brand: "Brand",
                                                Model: "Model",
                                                License_Plate: "License Plate",
                                                Current_Kilometers: "Current Kilometers",
                                                Fuel: "Fuel Type",
                                                Insurance_Expiry: "Insurance Expiry (optional)",
                                                Inspection_Expiry: "Inspection Expiry (optional)"
                                            }).map(([key, label]) => (
                                                <div className="mb-3" key={key}>
                                                    <label className="form-label">{label}</label>
                                                    {key === "Brand" || key === "Model" || key === "Fuel" ? (
                                                        <select
                                                            className="form-select"
                                                            name={key}
                                                            value={carForm[key]}
                                                            onChange={handleCarFormChange}
                                                            required={key !== "Nickname_Car" && key !== "Insurance_Expiry" && key !== "Inspection_Expiry"}
                                                            disabled={key === "Model" && !carForm.Brand}
                                                        >
                                                            <option value="">Select...</option>
                                                            {(key === "Brand"
                                                                ? Object.keys(carBrands)
                                                                : key === "Model"
                                                                    ? models
                                                                    : fuelTypes
                                                            ).map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    ) : key === "Insurance_Expiry" || key === "Inspection_Expiry" ? (
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name={key}
                                                            value={carForm[key]}
                                                            onChange={handleCarFormChange}
                                                        />
                                                    ) : (
                                                        <input
                                                            type={key === "Current_Kilometers" ? "number" : "text"}
                                                            className="form-control"
                                                            name={key}
                                                            value={carForm[key]}
                                                            onChange={handleCarFormChange}
                                                            required={key !== "Nickname_Car"}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mb-3">
                                    <label className="form-label">Car Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {!image && editingCarId && selectedCar?.Car_Image?.length > 0 && (
                                        <div className="mt-3">
                                            <p className="small text-muted">Current Image:</p>
                                            <img
                                                src={getCarImageUrl(selectedCar)}
                                                alt="Current Car"
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '200px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                    </div>
                                </div>
                                <div className="modal-footer d-flex justify-content-center">
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={() => {
                                            setShowAddCarForm(false);
                                            setEditingCarId(null);
                                            setError(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingCarId ? 'Update Car' : 'Save Car'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Maintenance Modal */}
            {showAddMaintenanceForm && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{editingMaintenance ? 'Edit Maintenance Record' : 'Add Maintenance Record'}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowAddMaintenanceForm(false);
                                        setEditingMaintenance(null);
                                        setError(null);
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleAddMaintenanceSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Maintenance Type</label>
                                        <select
                                            className="form-select"
                                            name="Maintenance_Type"
                                            value={maintenanceForm.Maintenance_Type}
                                            onChange={handleMaintenanceFormChange}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            {maintenanceTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Kilometers</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="Kilometers"
                                            value={maintenanceForm.Kilometers}
                                            onChange={handleMaintenanceFormChange}
                                            required
                                            min={selectedCar?.Current_Kilometers || 0}
                                        />
                                        <small className="text-muted">Current: {selectedCar?.Current_Kilometers?.toLocaleString() || 0} km</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Next Maintenance Due At (km)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="Next_Maintenance_Km"
                                            value={maintenanceForm.Next_Maintenance_Km}
                                            onChange={handleMaintenanceFormChange}
                                            required
                                            min={maintenanceForm.Kilometers || selectedCar?.Current_Kilometers || 0}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Notes (optional)</label>
                                        <textarea
                                            className="form-control"
                                            name="Notes"
                                            value={maintenanceForm.Notes}
                                            onChange={handleMaintenanceFormChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer d-flex justify-content-center">
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={() => {
                                            setShowAddMaintenanceForm(false);
                                            setEditingMaintenance(null);
                                            setError(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingMaintenance ? 'Update Record' : 'Save Record'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}