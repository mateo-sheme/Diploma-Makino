import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootswatch/dist/Litera/bootstrap.min.css";
import "./Auth.css";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        const phoneRegex = /^\+\d{1,4}[\s-]?(\d[\s-]?){9,}$/;

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

        if (!phoneRegex.test(formatPhoneNumber)) {
            setError("Phone number must be 10 to 15 digits, optionally starting with '+'.");
            setIsLoading(false);
            return;
        }

        const formatPhoneNumber = (value) => {
            // Remove all non-digit characters
            const digits = value.replace(/\D/g, "");

            // Format: +355 67 123 4567 or general format with spacing
            if (digits.startsWith("355") && digits.length > 3) {
                const code = digits.slice(0, 3);
                const part1 = digits.slice(3, 5);
                const part2 = digits.slice(5, 8);
                const part3 = digits.slice(8, 12);
                return `+${code}${part1 ? " " + part1 : ""}${part2 ? " " + part2 : ""}${part3 ? " " + part3 : ""}`;
            }

            // General fallback: space every 3-4 digits
            const match = value.match(/^(\+\d{1,4})/);
            const prefix = match ? match[1] : "";

            // Group remaining digits in 3s or 4s
            const groups = digits.match(/.{1,3}/g) || [];
            return `${prefix} ${groups.join(" ")}`.trim();
        };

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, phone }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }

            navigate("/login"); // Redirect to login after successful registration
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Register</h2>
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

                    <div className="mb-3">
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
                            minLength={6}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="form-label">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="auth-footer mt-3">
                    <button
                        className="btn btn-link p-0"
                        onClick={() => navigate("/login")}
                    >
                        Login here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;