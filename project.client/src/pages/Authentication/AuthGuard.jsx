import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

export default function AuthGuard({ children }) {
    const { currentUser } = useAuth(); // shikon nese user eshte i loguar
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login'); // ne te kundert te con te login page
        }
    }, [currentUser, navigate]);

    return currentUser ? children : null; // te kthen tek childrens pages mbasi logohesh
}

AuthGuard.propTypes = {
    children: PropTypes.node.isRequired, 
};