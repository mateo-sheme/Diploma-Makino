import { } from 'react';
import './App.css';
import {Route, Routes } from "react-router-dom"
import { Navbar } from "./components/Navbar.jsx"
import "bootswatch/dist/Litera/bootstrap.css";
import "bootswatch/dist/Litera/bootstrap.min.css";

import Home from './pages/Home'
import Search from './pages/Search'
import Sell from './pages/Sell'
import Mycar from './pages/Mycar'
import CarDetails from './pages/CarDetails';

function App() {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Search" element={<Search />} />
                <Route path="/Sell" element={<Sell />} />
                <Route path="/Mycar" element={<Mycar />} />
                <Route path="/car/:id" element={<CarDetails />} />
            </Routes>
            
        </div>
    );
}



export default App;