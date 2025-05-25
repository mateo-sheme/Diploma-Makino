import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const translations = {
        en: {
            // Navbar
            search: "Search",
            sell: "Sell",
            diaryCar: "Diary Car",
            login: "Login",
            logout: "Logout",

            // SearchBox
            anyBrand: "Any Brand",
            anyModel: "Any Model",
            minPrice: "Min Price",
            maxPrice: "Max Price",
            usage: "Usage",
            used: "Used",
            new: "New",
            fuel: "Fuel",
            gasoline: "Gasoline",
            diesel: "Diesel",
            electric: "Electric",
            hybrid: "Hybrid",
            transmission: "Transmission",
            manual: "Manual",
            automatic: "Automatic",
            minYear: "Min Year",
            maxYear: "Max Year",
            searchOffers: "Search Offers",

            // Login/Register
            email: "Email",
            password: "Password",
            loggingIn: "Logging in...",
            register: "Register",
            phoneNumber: "Phone Number",
            processing: "Processing...",
            registrationSuccessful: "Registration successful!",
            invalidEmail: "Invalid email format.",
            passwordRequirements: "Password must be at least 6 characters and include a number.",
            phoneRequirements: "Phone number must be at least 10 digits.",
            registrationFail: "Registration failed. Please try again.",

            // CarDetails
            year: "Year",
            kilometers: "Kilometers",
            contactSeller: "Contact Seller",

            // Sell
            sellYourCar: "Sell Your Car",
            vin: "VIN",
            brand: "Brand",
            model: "Model",
            fuelType: "Fuel Type",
            price: "Price \u20AC",
            contactNumber: "Contact Number",
            uploadPhotos: "Upload up to 10 photos",
            submitListing: "Submit Listing",
            invalidVin: "Invalid VIN. Use 17 letters/numbers.",
            invalidPhone: "Invalid phone number format.",
            listingCreated: "Listing created!",
            select: "Select",
            submitting: "Submitting...",

            // DiaryCar translations
            myCarDiary: "My Car Diary",
            myCars: "My Cars",
            addCar: "Add Car",
            noCarsAdded: "No cars added yet",
            unnamedCar: "Unnamed Car",
            edit: "Edit",
            delete: "Delete",
            noCarSelected: "No car selected",
            addCarToStart: "Add a car to start tracking maintenance",
            addFirstCar: "Add Your First Car",
            addNewCar: "Add New Car",
            editCar: "Edit Car",
            saveCar: "Save Car",
            updateCar: "Update Car",
            cancel: "Cancel",
            maintenanceHistory: "Maintenance History",
            addMaintenance: "Add Maintenance",
            editMaintenance: "Edit Maintenance Record",
            addMaintenanceRecord: "Add Maintenance Record",
            noMaintenanceRecord: "No maintenanace history",
            saveRecord: "Save Record",
            updateRecord: "Update Record",
            date: "Date",
            type: "Type",
            currentKm: "Current KM",
            nextMaintenanceKm: "Next KM",
            notes: "Notes",
            action: "Action",
            licensePlate: "License Plate",
            filterCars: "Filter Cars",
            all: "All",
            loadingCars: "Loading cars...",
            noCarsFound: "No cars found matching your criteria.",
            noImage: "No Image",
            viewDetails: "View Details",
            failedToFetchCars: "Failed to fetch cars",

        },
        al: {
            // Navbar
            search: "K\u00EBrko",
            sell: "Shit",
            diaryCar: "Ditari i Makin\u00EBs",
            login: "Hyr",
            logout: "Dil",
            register: "Regjistrohu",

            // SearchBox
            anyBrand: "\u00C7do Mark\u00EB",
            anyModel: "\u00C7do Model",
            minPrice: "\u00C7mimi Minimal",
            maxPrice: "\u00C7mimi Maksimal",
            usage: "P\u00EBrdorimi",
            used: "I p\u00EBrdorur",
            new: "I ri",
            fuel: "Karburanti",
            gasoline: "Benzin\u00EB",
            diesel: "Naft\u00EB",
            electric: "Elektrik",
            hybrid: "Hibrid",
            transmission: "Marshi",
            manual: "Manual",
            automatic: "Automatik",
            minYear: "Viti Minimal",
            maxYear: "Viti Maksimal",
            minKm: "Kilometra Minimal",
            maxKm: "Kilometra Maksimal",
            searchOffers: "K\u00EBrko Oferta",

            // Login/Register
            email: "Email",
            password: "Fjal\u00EBkalimi",
            loggingIn: "Duke u ky\u00C7ur...",
            phoneNumber: "Numri i Telefonit",
            processing: "Duke u p\u00EBrpunuar...",
            registrationSuccessful: "Regjistrimi u krye me sukses!",
            invalidEmail: "Formati i email-it \u00EBsht\u00EB i pavlefsh\u00EBm.",
            passwordRequirements: "Fjal\u00EBkalimi duhet t\u00EB jet\u00EB s\u00EB paku 6 karaktere dhe t\u00EB p\u00EBrmbaj\u00EB nj\u00EB num\u00EBr.",
            phoneRequirements: "Numri i telefonit duhet t\u00EB jet\u00EB s\u00EB paku 10 shifra.",
            registrationFail: "Regjistrimi d\u00EBshtoi, provo p\u00EBrs\u00EBri",

            // CarDetails
            year: "Viti",
            kilometers: "Kilometrat",
            contactSeller: "Kontakto Shit\u00EBsin",

            // Sell
            sellYourCar: "Shit Makin\u00EBn T\u00EBnde",
            vin: "VIN",
            brand: "Marka",
            model: "Modeli",
            fuelType: "Lloji i Karburantit",
            contactNumber: "Numri i Kontaktit",
            uploadPhotos: "Ngarko deri n\u00EB 10 foto",
            submitListing: "Publiko njoftimin",
            invalidVin: "VIN i pavlefsh\u00EBm. P\u00EBrdorni 17 shkronja/numra.",
            invalidPhone: "Format i pavlefsh\u00EBm i numrit t\u00EB telefonit.",
            listingCreated: "Listimi u krijua!",
            price: "\u00C7mimi \u20AC",
            select: "Zgjidh",
            submitting: "Duke d\u00EBrguar...",

            // DiaryCar translations
            myCarDiary: "Ditari i makinave t\u00EB mia",
            myCars: "Makinat e mia",
            addCar: "Shto Makin\u00EB",
            noCarsAdded: "Asnj\u00EB makin\u00EB e shtuar ende",
            unnamedCar: "Makin\u00EB pa Em\u00EBr",
            edit: "Ndrysho",
            delete: "Fshi",
            noCarSelected: "Asnj\u00EB makin\u00EB e zgjedhur",
            addCarToStart: "Shtoni nj\u00EB makin\u00EB p\u00EBr t\u00EB filluar t\u00EB gjurmoni mir\u00EBmbajtjen",
            addFirstCar: "Shtoni Makin\u00EBn tuaj t\u00EB Par\u00EB",
            addNewCar: "Shto Makin\u00EB t\u00EB Re",
            editCar: "Ndrysho Makin\u00EB",
            saveCar: "Ruaj Makin\u00EB",
            updateCar: "P\u00EBrdit\u00EBso Makin\u00EB",
            cancel: "Anulo",
            maintenanceHistory: "Historia e Mir\u00EBmbajtjes",
            addMaintenance: "Shto Mir\u00EBmbajtje",
            editMaintenance: "Ndrysho Regjistrin e Mir\u00EBmbajtjes",
            addMaintenanceRecord: "Shto Regjist\u00EBr Mir\u00EBmbajtjeje",
            noMaintenanceRecord: "Asnj\u00EB historik mir\u00EBmbajtje",
            saveRecord: "Ruaj Regjistrin",
            updateRecord: "P\u00EBrdit\u00EBso Regjistrin",
            date: "Data",
            type: "Lloji",
            nextMaintenanceKm: "KM Tjet\u00EBr",
            notes: "Sh\u00EBnime",
            action: "Veprim",
            licensePlate: "Targa",
            currentKm: "Km t\u00EB tanishme",

            filterCars: "Filtro Makinat",
            all: "T\u00EB gjitha",
            loadingCars: "Duke ngarkuar makinat...",
            noCarsFound: "Nuk u gjet\u00EBn makina q\u00EB p\u00EBrputhen me kriteret tuaja.",
            noImage: "Asnj\u00EB Foto",
            viewDetails: "Shiko Detajet",
            failedToFetchCars: "D\u00EBshtoi n\u00EB marrjen e makinave",
        }
    };

    const t = (key) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

LanguageProvider.propTypes = {
    children: PropTypes.node.isRequired
};


export const useLanguage = () => useContext(LanguageContext);