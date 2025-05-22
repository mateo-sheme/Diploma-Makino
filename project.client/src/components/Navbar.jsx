import { Link } from "react-router-dom";
import { useState } from "react";
import "bootswatch/dist/Litera/bootstrap.css";
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Navbar.css";
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
            <div className="d-flex align-items-center" id="navbarNav">
                <Link to="/" className="logo me-4">
                    <img
                        src="src/assets/Logo makino dark-02.png"
                        alt="Logo"
                        className="logo-img"
                    />
                </Link>

                <ul className="desktop-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/search">Search</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/sell">Sell</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/mycar">My Car</Link>
                    </li>
                </ul>

                {currentUser && (
                    <span className="nav-email">{currentUser.email}</span>
                )}
                {currentUser ? (
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="btn btn-outline-light btn-sm"
                    >
                        Login
                    </Link>
                )}
            </div>

            {/* Mobile Toggle Button */}
            <button
                className="mobile-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation"
            >
                <span className="toggle-bar"></span>
                <span className="toggle-bar"></span>
                <span className="toggle-bar"></span>
            </button>

            {/* Mobile Overlay */}
            <div className={`mobile-overlay ${isOpen ? 'open' : ''}`}>
                <div className="overlay-content">
                    <Link className="nav-link" to="/search" onClick={() => setIsOpen(false)}>Search</Link>
                    <Link className="nav-link" to="/sell" onClick={() => setIsOpen(false)}>Sell</Link>
                    <Link className="nav-link" to="/mycar" onClick={() => setIsOpen(false)}>My Car</Link>
                </div>
            </div>
        </nav>
    );
};

