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

function App() {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Search" element={<Search />} />
                <Route path="/Sell" element={<Sell />} />
                <Route path="/Mycar" element={<Mycar />} />
            </Routes>
            
        </div>
    );
}



export default App;