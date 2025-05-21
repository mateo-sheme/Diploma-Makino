import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Check for existing user on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        navigate('/'); // Redirect to home after login
    };

    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Add prop validation
};
export { AuthContext };
export function useAuth() {
    return useContext(AuthContext);
}