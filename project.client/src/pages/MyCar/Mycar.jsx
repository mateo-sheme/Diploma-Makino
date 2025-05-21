import { useState, useEffect } from 'react';
import { Tabs, /*Tab*/ Container } from 'react-bootstrap';
//import CarInfoSection from './CarInfoSection';
//import MaintenanceTracker from './MaintenanceTracker';
//import FinesSection from './FinesSection';
//import FuelConsumption from './FuelConsumption';
import "bootswatch/dist/Litera/bootstrap.min.css";

const MyCarPage = () => {
    const [activeTab, setActiveTab] = useState('maintenance');
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        // Fetch user's cars from API
        const fetchCars = async () => {
            const response = await fetch('/api/usercars');
            const data = await response.json();
            setCars(data);
            if (data.length > 0) setSelectedCar(data[0].id);
        };
        fetchCars();
    }, []);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">My Car Diary</h2>

            {/* Car Selection Dropdown */}
            <div className="mb-4">
                <select
                    className="form-select"
                    value={selectedCar || ''}
                    onChange={(e) => setSelectedCar(e.target.value)}
                >
                    {cars.map(car => (
                        <option key={car.id} value={car.id}>
                            {car.brand} {car.model} ({car.licensePlate})
                        </option>
                    ))}
                </select>
            </div>

            {selectedCar && (
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-3"
                >{/*
                    <Tab eventKey="info" title="Car Information">
                        <CarInfoSection carId={selectedCar} />
                    </Tab>
                    <Tab eventKey="maintenance" title="Maintenance">
                        <MaintenanceTracker carId={selectedCar} />
                    </Tab>
                    <Tab eventKey="fines" title="Traffic Fines">
                        <FinesSection carId={selectedCar} />
                    </Tab>
                    <Tab eventKey="fuel" title="Fuel Consumption">
                        <FuelConsumption carId={selectedCar} />
                    </Tab>*/}
                </Tabs>
            )}
        </Container>
    );
};

export default MyCarPage;