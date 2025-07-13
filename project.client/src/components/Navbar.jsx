import { Link } from "react-router-dom";
import { useState } from "react";
import "bootswatch/dist/litera/bootstrap.css";
import "./Navbar.css";
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'al' : 'en');
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler position-absolute end-0 me-3"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Centered Navigation Content */}
                <div className="d-flex justify-content-center w-100" id="navbarNav">
                    <div className="collapse navbar-collapse justify-content-center" id="navbarContent">
                        <div className="d-flex align-items-center">
                            <Link to="/" className="logo me-4">
                                <img
                                    src="src/assets/Logo makino dark-02.png"
                                    alt="Logo"
                                    className="logo-img"
                                />
                            </Link>

                            <ul className="navbar-nav mb-2 mb-lg-0 me-4">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/search">{t('search')}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/sell">{t('sell')}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/diarycar">{t('diaryCar')}</Link>
                                </li>
                            </ul>

                            <div className="d-flex align-items-center">
                                {currentUser && (
                                    <span className="nav-email text-white me-3">{currentUser.email}</span>
                                )}
                                <button
                                    className="btn btn-outline-light btn-sm mx-2"
                                    onClick={toggleLanguage}
                                >
                                    {language === 'en' ? 'AL' : 'EN'}
                                </button>

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
                        </div>
                    </div>
                </div>

                {/* Mobile Overlay */}
                <div className={`mobile-overlay ${isOpen ? 'open' : ''}`}>
                    <button
                        className="close-btn"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    >
                        &times;
                    </button>

                    <div className="overlay-content">
                        <Link className="nav-link" to="/search" onClick={() => setIsOpen(false)}>{t('search')}</Link>
                        <Link className="nav-link" to="/sell" onClick={() => setIsOpen(false)}>{t('sell')}</Link>
                        <Link className="nav-link" to="/diarycar" onClick={() => setIsOpen(false)}>{t('diaryCar')}</Link>

                        <div className="mobile-auth-section">
                            {currentUser && (
                                <span className="nav-email text-white">{currentUser.email}</span>
                            )}
                            <button
                                className="btn btn-outline-light btn-sm my-2"
                                onClick={toggleLanguage}
                            >
                                {language === 'en' ? 'AL' : 'EN'}
                            </button>
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
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};