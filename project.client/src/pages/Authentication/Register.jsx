import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Auth.css";
import { useLanguage } from "../../contexts/LanguageContext";

const Register = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [userData, setUserData] = useState({
        Email: "",
        PasswordHash: "",
        Phone: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({
        Phone: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const validatePhone = (phone) => {
        const digits = phone.replace(/\D/g, "");
        return digits.length >= 10;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(false);
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

       
        if (!userData.Email || !userData.PasswordHash || !userData.Phone) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        if (!emailRegex.test(userData.Email)) {
            setError(t("invalidEmail"));
            setIsLoading(false);
            return;
        }

        if (!passwordRegex.test(userData.PasswordHash)) {
            setError(t("passwordRequirements"));
            setIsLoading(false);
            return;
        }

        if (!validatePhone(userData.Phone)) {
            setError(t("phoneRequirements"));
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Email: userData.Email,
                    PasswordHash: userData.PasswordHash,
                    Phone: userData.Phone
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.field === "email") {
                    setError(data.message);
                } else {
                    setError(data.message || t("registrationFail"));
                }
                return;
            }

            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const isPhoneError = touched.Phone && !validatePhone(userData.Phone);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">Registration successful!</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="Email"
                            value={userData.Email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("password")}</label>
                        <input
                            type="password"
                            className="form-control"
                            name="PasswordHash"
                            value={userData.PasswordHash}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">{t("phoneNumber")}</label>
                        <input
                            type="tel"
                            className={`form-control ${isPhoneError ? "is-invalid" : ""}`}
                            name="Phone"
                            value={userData.Phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {isPhoneError && (
                            <div className="invalid-feedback">
                                Please enter a valid phone number (minimum 10 digits)
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? t("processing") : t("register")}
                    </button>
                </form>

                <div className="auth-footer mt-3">
                    <button
                        className="btn btn-link p-0"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;