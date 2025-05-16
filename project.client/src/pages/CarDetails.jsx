import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import "bootswatch/dist/Litera/bootstrap.min.css";
import './CarDetails.css';

function CarDetailsPage() {
    const { id } = useParams();
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
                                        src={`/api/car/${car.car_ID}/image/${image.id}`}
                                        alt={`${car.brand} ${car.model} - ${index + 1}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="thumbnail-gallery">
                        <div className="d-flex flex-wrap">
                            {car.images?.map((image, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail-item ${index === activeIndex ? 'active' : ''}`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <img
                                        src={`/api/car/${car.car_ID}/image/${image.id}`}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="img-thumbnail"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Car Info Column */}
                <div className="col-lg-4">
                    <div className="card details-card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">{car.brand} {car.model}</h2>
                            <h4 className="text-primary mb-4">{car.price?.toLocaleString()} €</h4>

                            <div className="specs-grid mb-4">
                                <div className="spec-item">
                                    <span className="spec-label">Year</span>
                                    <span className="spec-value">{car.year}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Kilometers</span>
                                    <span className="spec-value">{car.kilometers?.toLocaleString()} km</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Fuel</span>
                                    <span className="spec-value">{car.fuel}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Transmission</span>
                                    <span className="spec-value">{car.transmission}</span>
                                </div>
                            </div>

                            <a href={`tel:${car.Contact_Number}`} className="btn btn-primary btn-lg w-100 mb-3">
                                <i className="bi bi-telephone me-2"></i> Contact Seller
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarDetailsPage;