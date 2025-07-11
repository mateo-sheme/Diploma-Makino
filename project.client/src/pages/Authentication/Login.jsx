import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootswatch/dist/litera/bootstrap.min.css";
import { useAuth } from '../../contexts/AuthContext';
import "./Auth.css";
import { useLanguage } from "../../contexts/LanguageContext";

const Login = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { login } = useAuth(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Invalid email format.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    Email: email,       
                    PasswordHash: password 
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            login({
                userId: data.userId,
                email: data.email
            });
            navigate("/");

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">
                            {t("password")}
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 auth-button"
                        disabled={isLoading}
                    >
                        
                        {isLoading ? "Logging in..." : t("login") }  
                    </button>
                </form>

                <div className="auth-footer mt-3">
                    <button
                        className="btn btn-link p-0"
                        onClick={() => navigate("/register")}
                    >
                        {t("register")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;