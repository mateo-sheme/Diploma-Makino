import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MaintenanceRecord.css";

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

export default function MaintenancePage() {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState({
        page: true,
        operation: false
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [newRecord, setNewRecord] = useState({
        Kilometers: "",
        Maintenance_Type: "",
        Next_Maintenance_Km: "",
        Notes: ""
    });

    // Track mounted state to prevent memory leaks
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchCarDetails = async () => {
            const response = await fetch(`/api/diarycar/${carId}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch car details");
            }
            return await response.json();
    };

    const fetchMaintenanceRecords = async () => {
            const response = await fetch(`/api/maintenance/${carId}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch maintenance records");
            }
            return await response.json();
    };

    const loadData = async () => {
        try {
            setLoading(prev => ({ ...prev, page: true }));
            setError(null);

            const [carData, recordsData] = await Promise.all([
                fetchCarDetails(),
                fetchMaintenanceRecords()
            ]);

            if (isMounted.current) {
                setCar(carData);
                setRecords(recordsData);
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.message);
            }
        } finally {
            if (isMounted.current) {
                setLoading(prev => ({ ...prev, page: false }));
            }
        }
    };

    useEffect(() => {
        loadData();
    }, [carId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();

        if (!isMounted.current) return;

        setError(null);
        setSuccess(null);
        setLoading(prev => ({ ...prev, operation: true }));

        try {
            const response = await fetch(`/api/maintenance/${carId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newRecord,
                    Record_Date: new Date().toISOString()
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add record");
            }

            const addedRecord = await response.json();

            if (isMounted.current) {
                setRecords(prev => [addedRecord, ...prev]);
                setNewRecord({
                    Kilometers: "",
                    Maintenance_Type: "",
                    Next_Maintenance_Km: "",
                    Notes: ""
                });
                setSuccess("Record added successfully!");

                // Refresh the data to ensure consistency
                await loadData();
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.message);
            }
        } finally {
            if (isMounted.current) {
                setLoading(prev => ({ ...prev, operation: false }));
            }
        }
    };

    const handleDeleteRecord = async (recordId) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        if (!isMounted.current) return;

        setLoading(prev => ({ ...prev, operation: true }));
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/maintenance/${carId}/${recordId}`, {
                method: "DELETE",
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete record");
            }

            if (isMounted.current) {
                setRecords(prev => prev.filter(r => r.Record_ID !== recordId));
                setSuccess("Record deleted successfully!");

                // Refresh the data to ensure consistency
                await loadData();
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.message);
            }
        } finally {
            if (isMounted.current) {
                setLoading(prev => ({ ...prev, operation: false }));
            }
        }
    };

    if (loading.page) {
        return (
            <div className="container py-4">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger">Car not found</div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <button
                className="btn btn-secondary mb-3"
                onClick={() => navigate(-1)}
                disabled={loading.operation}
            >
                Back
            </button>

            <h2 className="mb-4">
                Maintenance Records for {car.Nickname_Car || `${car.Brand} ${car.Model}`}
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Add New Maintenance Record</h5>
                </div>
                <div className="card-body-maintenance">
                    <form onSubmit={handleAddRecord}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Kilometers</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="Kilometers"
                                        value={newRecord.Kilometers}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading.operation}
                                        min="0"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Maintenance Type</label>
                                    <select
                                        className="form-select"
                                        name="Maintenance_Type"
                                        value={newRecord.Maintenance_Type}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading.operation}
                                    >
                                        <option value="">Select a maintenance type</option>
                                        {maintenanceTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Next Maintenance (KM)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="Next_Maintenance_Km"
                                        value={newRecord.Next_Maintenance_Km}
                                        onChange={handleInputChange}
                                        disabled={loading.operation}
                                        min="0"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Notes</label>
                                    <textarea
                                        className="form-control"
                                        name="Notes"
                                        value={newRecord.Notes}
                                        onChange={handleInputChange}
                                        disabled={loading.operation}
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading.operation}
                        >
                            {loading.operation ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : (
                                "Add Record"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Maintenance History</h5>
                </div>
                <div className="card-body-maintenance">
                    {records.length === 0 ? (
                        <p className="text-center">No maintenance records found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>KM</th>
                                        <th>Type</th>
                                        <th>Next KM</th>
                                        <th>Notes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map(record => (
                                        <tr key={record.Record_ID}>
                                            <td>{new Date(record.Record_Date).toLocaleDateString()}</td>
                                            <td>{record.Kilometers.toLocaleString()}</td>
                                            <td>{record.Maintenance_Type}</td>
                                            <td>{record.Next_Maintenance_Km?.toLocaleString() || '-'}</td>
                                            <td>{record.Notes || '-'}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDeleteRecord(record.Record_ID)}
                                                    disabled={loading.operation}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}