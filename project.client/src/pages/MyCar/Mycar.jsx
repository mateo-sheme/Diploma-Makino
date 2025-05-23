import { useState, useEffect, useContext, useMemo } from "react";
import "bootswatch/dist/Litera/bootstrap.css";
import "./MyCar.css";
import { AuthContext } from "../../contexts/AuthContext";

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

export default function DiaryCar() {
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
        if (currentUser?.userId) {
            fetchUserCars();
        }
    }, [currentUser]);

    useEffect(() => {
        if (selectedCar) {
            fetchMaintenanceRecords(selectedCar.User_Car_ID);
        }
    }, [selectedCar]);

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
        } catch (err) {
            console.error("Error fetching cars:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMaintenanceRecords = async (carId) => {
        try {
            const response = await fetch(`/api/diarycar/${carId}/maintenance`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const normalizedRecords = data.map(record => ({
                Record_ID: record.record_ID || record.Record_ID,
                User_Car_ID: record.user_Car_ID || record.User_Car_ID,
                Record_Date: record.record_Date || record.Record_Date,
                Kilometers: record.kilometers || record.Kilometers,
                Maintenance_Type: record.maintenance_Type || record.Maintenance_Type,
                Notes: record.notes || record.Notes || "",
                Next_Maintenance_Km: record.next_Maintenance_Km || record.Next_Maintenance_Km
            }));

            setMaintenanceRecords(normalizedRecords);
        } catch (err) {
            console.error("Error fetching maintenance records:", err);
            setError("Failed to load maintenance records");
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
        setEditingCarId(carId);
        const carToEdit = cars.find(c => c.User_Car_ID === carId);
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
        setShowAddCarForm(true);
    };

    const handleAddMaintenanceSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            if (!selectedCar) throw new Error("No car selected");

            const maintenanceData = {
                User_Car_ID: selectedCar.User_Car_ID,
                Kilometers: parseInt(maintenanceForm.Kilometers),
                Maintenance_Type: maintenanceForm.Maintenance_Type,
                Next_Maintenance_Km: parseInt(maintenanceForm.Next_Maintenance_Km),
                Notes: maintenanceForm.Notes,
                Record_Date: new Date().toISOString()
            };

            const url = editingMaintenance
                ? `/api/diarycar/${selectedCar.User_Car_ID}/maintenance/${editingMaintenance.Record_ID}`
                : `/api/diarycar/${selectedCar.User_Car_ID}/maintenance`;
            const method = editingMaintenance ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(maintenanceData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save maintenance record");
            }

            const savedRecord = await response.json();

            if (editingMaintenance) {
                setMaintenanceRecords(maintenanceRecords.map(r =>
                    r.Record_ID === savedRecord.Record_ID ? savedRecord : r
                ));
            } else {
                setMaintenanceRecords([...maintenanceRecords, savedRecord]);
            }

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
            setSuccess("Car deleted successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteMaintenance = async (recordId) => {
        if (!window.confirm("Are you sure you want to delete this maintenance record?")) return;

        try {
            const response = await fetch(`/api/diarycar/${selectedCar.User_Car_ID}/maintenance/${recordId}`, {
                method: "DELETE",
                credentials: 'include'
            });

            if (!response.ok) throw new Error("Failed to delete maintenance record");

            setMaintenanceRecords(prev => prev.filter(r => r.Record_ID !== recordId));
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
                        <strong>{car.Nickname_Car || "Unnamed Car"}</strong>
                        <div className="small text-muted">{car.Brand} {car.Model}</div>
                    </div>
                    <div>
                        <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditCar(car.User_Car_ID);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCar(car.User_Car_ID);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </button>
            ))}
            {cars.length === 0 && !loading && (
                <div className="list-group-item text-muted">
                    No cars added yet
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
                        {selectedCar.Nickname_Car || "Unnamed Car"}
                        <button
                            className="btn btn-sm btn-light float-end"
                            onClick={() => {
                                setEditingMaintenance(null);
                                setShowAddMaintenanceForm(true);
                            }}
                        >
                            Add Maintenance
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
                                    <strong>License Plate:</strong> {selectedCar.License_Plate}
                                </li>
                                <li className="list-group-item">
                                    <strong>Current KM:</strong> {selectedCar.Current_Kilometers.toLocaleString()}
                                </li>
                                <li className="list-group-item">
                                    <strong>Fuel Type:</strong> {selectedCar.Fuel}
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8">
                            <h6>Upcoming Maintenance</h6>
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Due KM</th>
                                            <th>Remaining KM</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maintenanceRecords
                                            .filter(r => r.Next_Maintenance_Km > selectedCar.Current_Kilometers)
                                            .sort((a, b) => a.Next_Maintenance_Km - b.Next_Maintenance_Km)
                                            .map(record => (
                                                <tr key={record.Record_ID} className={record.Next_Maintenance_Km - selectedCar.Current_Kilometers < 1000 ? 'table-warning' : ''}>
                                                    <td>{record.Maintenance_Type}</td>
                                                    <td>{record.Next_Maintenance_Km.toLocaleString()}</td>
                                                    <td>{(record.Next_Maintenance_Km - selectedCar.Current_Kilometers).toLocaleString()}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                            onClick={() => handleEditMaintenance(record)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteMaintenance(record.Record_ID)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        {maintenanceRecords.filter(r => r.Next_Maintenance_Km > selectedCar.Current_Kilometers).length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-muted">No upcoming maintenance</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <h6 className="mt-4">Maintenance History</h6>
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>KM</th>
                                            <th>Notes</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maintenanceRecords
                                            .filter(r => r.Next_Maintenance_Km <= selectedCar.Current_Kilometers)
                                            .sort((a, b) => new Date(b.Record_Date) - new Date(a.Record_Date))
                                            .map(record => (
                                                <tr key={record.Record_ID}>
                                                    <td>{new Date(record.Record_Date).toLocaleDateString()}</td>
                                                    <td>{record.Maintenance_Type}</td>
                                                    <td>{record.Kilometers.toLocaleString()}</td>
                                                    <td>{record.Notes || '-'}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                            onClick={() => handleEditMaintenance(record)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteMaintenance(record.Record_ID)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        {maintenanceRecords.filter(r => r.Next_Maintenance_Km <= selectedCar.Current_Kilometers).length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-muted">No maintenance history</td>
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
            <h2 className="text-center text-white mb-4">My Car Diary</h2>

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
                                <h5 className="mb-0">My Cars</h5>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => {
                                        setEditingCarId(null);
                                        setShowAddCarForm(true);
                                    }}
                                >
                                    Add Car
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
                                    <h5>No car selected</h5>
                                    <p>Add a car to start tracking maintenance</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setEditingCarId(null);
                                            setShowAddCarForm(true);
                                        }}
                                    >
                                        Add Your First Car
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
                                <h5 className="modal-title">{editingCarId ? 'Edit Car' : 'Add New Car'}</h5>
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
                            <form onSubmit={handleAddCarSubmit}>
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
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Car Image</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                            {image && (
                                                <div className="mt-3">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt="Preview"
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