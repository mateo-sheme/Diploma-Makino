import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    return currentUser ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export { PrivateRoute };
