﻿import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import "bootswatch/dist/litera/bootstrap.min.css";
import './CarDetails.css';
import { useLanguage } from "../../contexts/LanguageContext";

function CarDetailsPage() {
    const { id } = useParams();
    const { t    } = useLanguage();
    const [car, setCar] = useState(null);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await fetch(`/api/car/${id}`);
                if (!response.ok) throw new Error('Car not found');
                const data = await response.json();
                setCar(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchCarDetails();
    }, [id]);

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    if (error) return <div className="alert alert-danger mt-4">Error: {error}</div>;
    if (!car) return <div className="text-center mt-4"><div className="spinner-border" role="status"></div></div>;

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Image Gallery Column */}
                <div className="col-lg-8">
                    {/* Main Carousel */}
                    <div className="card mb-3">
                        <Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null}>
                            {car.images?.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100 main-car-image"
                                        src={`/api/car/${car.car_ID}/image/${image.image_ID}`}
                                        alt={`${car.brand} ${car.model} - ${index + 1}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>    
                </div>

                {/* Car Info Column */}
                <div className="col-lg-4">
                    <div className="card details-card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">{car.brand} {car.model}</h2>
                            <h4 className="text-primary mb-3">{car.price?.toLocaleString()} €</h4>

                            <p className="mb-4">
                                <strong>{t("contactNumber")}: </strong>
                                <a href={`tel:${car.contact_Number?.replace(/[^+\d]/g, '')}`} className="text-decoration-none">
                                    {car.contact_Number}
                                </a>
                            </p>

                            <div className="specs-grid mb-4">
                                <div className="spec-item">
                                    <span className="spec-label">{t("year")}</span>
                                    <span className="spec-value">{car.year}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">{t("kilometers")}</span>
                                    <span className="spec-value">{car.kilometers?.toLocaleString()} km</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">{t("fuelType")}</span>
                                    <span className="spec-value">{car.fuel}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">{t("transmission")} </span>
                                    <span className="spec-value">{car.transmission}</span>
                                </div>
                            </div>

                            <a href={`tel:${car.contact_Number?.replace(/[^+\d]/g, '')}`} className="btn btn-primary btn-lg w-100 mb-3">
                                <i className="bi bi-telephone me-2"></i>{t("contactSeller")}
                            </a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarDetailsPage;