import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootswatch/dist/Litera/bootstrap.min.css";
import { useAuth } from '../../contexts/AuthContext';
import "./Auth.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Get login function from context
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (!emailRegex.test(email)) {
            setError("Invalid email format.");
            setIsLoading(false);
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 6 characters and include a number.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const userData = await response.json();
            login(userData); // Update auth context with user data
            navigate("/"); // Redirect to home after successful login
        } catch (err) {
            setError(err.message || "Invalid email or password");
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
                            Password
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
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="auth-footer mt-3">
                    <button
                        className="btn btn-link p-0"
                        onClick={() => navigate("/register")}
                    >
                        Register here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;