/// <reference path="pages/sell/sell.jsx" />
import { } from 'react';
import './App.css';
import {Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar.jsx"
import "bootswatch/dist/Litera/bootstrap.css";
import "bootswatch/dist/Litera/bootstrap.min.css";
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './contexts/PrivateRoute';

import Home from './pages/Home/Home.jsx'
import Search from './pages/Search/Search.jsx'
import Sell from './pages/Sell/Sell.jsx'
import Mycar from './pages/MyCar/Mycar.jsx'
import CarDetails from './pages/Search/CarDetails.jsx';
import Login from './pages/Authentication/Login.jsx';
import Register from './pages/Authentication/Register.jsx';

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/sell" element={<PrivateRoute><Sell /></PrivateRoute>} />
                    <Route path="/mycar" element={<PrivateRoute><Mycar /></PrivateRoute>} />
                    <Route path="/car/:id" element={<CarDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </AuthProvider>
        </div>
    );
}



export default App;