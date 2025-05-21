import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // You'll need to create this (see step 2)
import PropTypes from 'prop-types';

export default function AuthGuard({ children }) {
    const { currentUser } = useAuth(); // Checks if user is logged in
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [currentUser, navigate]);

    return currentUser ? children : null; // Render children only if logged in
}

AuthGuard.propTypes = {
    children: PropTypes.node.isRequired, // Add prop validation
};