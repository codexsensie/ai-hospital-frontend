import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Appointments from "./pages/Appointments";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://ai-hospital-backend-1.onrender.com";

function App() {

    // =========================================================
    // AUTHENTICATION
    // =========================================================

    const [token, setToken] = useState(
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("jwt") ||
        ""
    );

    const [patient, setPatient] = useState(() => {
        try {
            const storedPatient =
                localStorage.getItem("patient");

            return storedPatient
                ? JSON.parse(storedPatient)
                : null;
        } catch {
            return null;
        }
    });


    // =========================================================
    // NAVIGATION
    // =========================================================

    const [currentPage, setCurrentPage] = useState(
        token ? "home" : "auth"
    );


    // =========================================================
    // AUTH MODE
    // login / register
    // =========================================================

    const [authMode, setAuthMode] = useState("login");


    // =========================================================
    // LOGIN FORM
    // =========================================================

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");


    // =========================================================
    // REGISTER FORM
    // =========================================================

    const [registerName, setRegisterName] = useState("");
    const [registerAge, setRegisterAge] = useState("");
    const [registerGender, setRegisterGender] = useState("");
    const [registerPhone, setRegisterPhone] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");


    // =========================================================
    // AUTH MESSAGE
    // =========================================================

    const [authMessage, setAuthMessage] = useState("");


    // =========================================================
    // SEARCH
    // =========================================================

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState("");

    const [location, setLocation] = useState({
        latitude: 28.6139,
        longitude: 77.2090
    });


    // =========================================================
    // HOSPITAL / DOCTOR / SLOT
    // =========================================================

    const [selectedHospital, setSelectedHospital] =
        useState(null);

    const [doctors, setDoctors] = useState([]);
    const [doctorMessage, setDoctorMessage] = useState("");

    const [selectedDoctor, setSelectedDoctor] =
        useState(null);

    const [slots, setSlots] = useState([]);
    const [slotMessage, setSlotMessage] = useState("");


    // =========================================================
    // BOOKING
    // =========================================================

    const [bookingMessage, setBookingMessage] =
        useState("");

    const [bookingSuccess, setBookingSuccess] =
        useState(false);


    // =========================================================
    // APPOINTMENTS
    // =========================================================

    const [appointments, setAppointments] =
        useState([]);

    const [appointmentMessage, setAppointmentMessage] =
        useState("");


    // =========================================================
    // COMMON API HELPER
    // =========================================================

    const apiRequest = async (
        url,
        options = {}
    ) => {

        const currentToken =
            token ||
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("jwt") ||
            "";

        const headers = {
            ...(options.body
                ? {
                    "Content-Type": "application/json"
                }
                : {}),
            ...(options.headers || {})
        };

        if (currentToken) {
            headers.Authorization =
                `Bearer ${currentToken}`;
        }

        const response = await fetch(
            url,
            {
                ...options,
                headers
            }
        );

        const text = await response.text();

        let data = {};

        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                data = {
                    message: text
                };
            }
        }

        if (!response.ok) {

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                throw new Error(
                    data?.message ||
                    "Your session has expired. Please login again."
                );
            }

            throw new Error(
                data?.message ||
                data?.error ||
                `Request failed (${response.status})`
            );
        }

        return data;
    };


    // =========================================================
    // NAVIGATION
    // =========================================================

    const navigateTo = (page) => {

        if (
            (page === "appointments" ||
                page === "profile") &&
            !token
        ) {
            setAuthMode("login");
            setCurrentPage("auth");
            setAuthMessage(
                "Please login to continue."
            );
            return;
        }

        setCurrentPage(page);
    };


    // =========================================================
    // GET USER LOCATION
    // =========================================================

    const getUserLocation = () => {

        return new Promise((resolve) => {

            if (!navigator.geolocation) {
                resolve(location);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {

                    const newLocation = {
                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude
                    };

                    setLocation(newLocation);

                    resolve(newLocation);
                },

                () => {
                    // If permission is denied,
                    // use Delhi fallback location.
                    resolve(location);
                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    };


    // =========================================================
    // SEARCH LOGIC
    // =========================================================

    const performSearch = async (searchQuery) => {

        if (!searchQuery || !searchQuery.trim()) {
            setMessage(
                "Please enter a medical service."
            );
            return;
        }

        if (!token) {
            setAuthMode("login");
            setCurrentPage("auth");
            setAuthMessage(
                "Please login before searching."
            );
            return;
        }

        setMessage("Searching...");
        setResults([]);

        setSelectedHospital(null);
        setDoctors([]);
        setSelectedDoctor(null);
        setSlots([]);

        try {

            const userLocation =
                await getUserLocation();

            const data = await apiRequest(
                `${API_BASE_URL}/ai/search`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        query: searchQuery,

                        latitude:
                            userLocation.latitude,

                        longitude:
                            userLocation.longitude
                    })
                }
            );

            const foundHospitals = data.results || [];

            setResults(foundHospitals);

            setMessage(
                data.message ||
                (foundHospitals.length > 0
                    ? `Found ${foundHospitals.length} matching hospital${foundHospitals.length > 1 ? "s" : ""}`
                    : "No matching hospitals found")
            );

        } catch (error) {

            console.error(
                "Search error:",
                error
            );

            setResults([]);

            setMessage(
                error.message ||
                "Unable to search hospitals."
            );
        }
    };


    // =========================================================
    // NORMAL SEARCH FORM
    // =========================================================

    const handleSearch = async (event) => {

        if (event) {
            event.preventDefault();
        }

        await performSearch(query);
    };


    // =========================================================
    // QUICK SEARCH
    // X-RAY / MRI / BLOOD TEST / CT
    // =========================================================

    const handleQuickSearch = async (quickQuery) => {

        setQuery(quickQuery);

        setCurrentPage("search");

        await performSearch(quickQuery);
    };


    // =========================================================
    // SELECT HOSPITAL
    // LOAD DOCTORS
    // =========================================================

    const handleSelectHospital = async (hospital) => {

        setSelectedHospital(hospital);

        setDoctors([]);
        setDoctorMessage("Loading doctors...");

        setSelectedDoctor(null);

        setSlots([]);
        setSlotMessage("");

        try {

            const data = await apiRequest(
                `${API_BASE_URL}/doctors`,
                {
                    method: "GET"
                }
            );

            const allDoctors =
                Array.isArray(data)
                    ? data
                    : [];

            const hospitalDoctors =
                allDoctors.filter(
                    (doctor) =>
                        Number(
                            doctor.hospitalId
                        ) === Number(
                            hospital.hospitalId
                        )
                );

            setDoctors(hospitalDoctors);

            if (hospitalDoctors.length === 0) {

                setDoctorMessage(
                    "No doctors found for this hospital."
                );

            } else {

                setDoctorMessage(
                    `${hospitalDoctors.length} doctor${hospitalDoctors.length > 1 ? "s" : ""} available`
                );
            }

        } catch (error) {

            console.error(
                "Doctor loading error:",
                error
            );

            setDoctors([]);

            setDoctorMessage(
                error.message ||
                "Unable to load doctors."
            );
        }
    };


    // =========================================================
    // VIEW DOCTOR SLOTS
    // =========================================================

    const handleViewSlots = async (doctor) => {

        setSelectedDoctor(doctor);

        setSlots([]);
        setSlotMessage("Loading available slots...");

        setBookingMessage("");
        setBookingSuccess(false);

        try {

            const data = await apiRequest(
                `${API_BASE_URL}/doctors/${doctor.doctorId}/slots`,
                {
                    method: "GET"
                }
            );

            const doctorSlots =
                Array.isArray(data)
                    ? data
                    : [];

            setSlots(doctorSlots);

            const availableSlots =
                doctorSlots.filter(
                    (slot) =>
                        !slot.booked &&
                        !slot.isBooked
                );

            if (doctorSlots.length === 0) {

                setSlotMessage(
                    "No slots available for this doctor."
                );

            } else if (
                availableSlots.length === 0
            ) {

                setSlotMessage(
                    "All slots are currently booked."
                );

            } else {

                setSlotMessage(
                    `${availableSlots.length} slot${availableSlots.length > 1 ? "s" : ""} available`
                );
            }

        } catch (error) {

            console.error(
                "Slot loading error:",
                error
            );

            setSlots([]);

            setSlotMessage(
                error.message ||
                "Unable to load slots."
            );
        }
    };


    // =========================================================
    // BOOK APPOINTMENT
    // =========================================================

    const handleBookAppointment = async (
        slot
    ) => {

        if (!selectedDoctor || !slot) {
            return;
        }

        setBookingMessage(
            "Booking appointment..."
        );

        setBookingSuccess(false);

        try {

            const data = await apiRequest(
                `${API_BASE_URL}/appointments`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        doctorId:
                            selectedDoctor.doctorId,

                        slotId:
                            slot.slotId
                    })
                }
            );

            setBookingSuccess(true);

            setBookingMessage(
                `Appointment booked successfully! Appointment #${data.appointmentId}`
            );

            // Update selected slot locally
            setSlots((previousSlots) =>
                previousSlots.map(
                    (currentSlot) =>
                        currentSlot.slotId ===
                        slot.slotId
                            ? {
                                ...currentSlot,
                                isBooked: true,
                                booked: true
                            }
                            : currentSlot
                )
            );

        } catch (error) {

            console.error(
                "Booking error:",
                error
            );

            setBookingSuccess(false);

            setBookingMessage(
                error.message ||
                "Unable to book appointment."
            );
        }
    };


    // =========================================================
    // LOAD MY APPOINTMENTS
    // =========================================================

    const loadAppointments = async () => {

        if (!token) {
            setAppointments([]);
            return;
        }

        try {

            const data = await apiRequest(
                `${API_BASE_URL}/appointments/me`,
                {
                    method: "GET"
                }
            );

            setAppointments(
                Array.isArray(data)
                    ? data
                    : []
            );

            setAppointmentMessage("");

        } catch (error) {

            console.error(
                "Appointments error:",
                error
            );

            setAppointments([]);

            setAppointmentMessage(
                error.message ||
                "Unable to load appointments."
            );
        }
    };


    // =========================================================
    // CANCEL APPOINTMENT
    // =========================================================

    const handleCancelAppointment = async (
        appointmentId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this appointment?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await apiRequest(
                `${API_BASE_URL}/appointments/${appointmentId}`,
                {
                    method: "DELETE"
                }
            );

            setAppointmentMessage(
                "Appointment cancelled successfully."
            );

            await loadAppointments();

        } catch (error) {

            console.error(
                "Cancel appointment error:",
                error
            );

            setAppointmentMessage(
                error.message ||
                "Unable to cancel appointment."
            );
        }
    };


    // =========================================================
    // LOGIN
    // =========================================================

    const handleLogin = async (event) => {

        if (event) {
            event.preventDefault();
        }

        setAuthMessage("Logging in...");

        try {

            const data = await apiRequest(
                `${API_BASE_URL}/patients/login`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        email: loginEmail,
                        password: loginPassword
                    })
                }
            );

            const newToken =
                data.token;

            if (!newToken) {
                throw new Error(
                    "Login succeeded but no token was returned."
                );
            }

            const patientData = {
                patientId:
                    data.patientId,

                name:
                    data.name,

                email:
                    data.email
            };

            // Save authentication
            localStorage.setItem(
                "token",
                newToken
            );

            localStorage.setItem(
                "patient",
                JSON.stringify(patientData)
            );

            setToken(newToken);
            setPatient(patientData);

            // Clear form
            setLoginEmail("");
            setLoginPassword("");

            setAuthMessage("");

            setCurrentPage("home");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setAuthMessage(
                error.message ||
                "Login failed."
            );
        }
    };


    // =========================================================
    // REGISTER
    // =========================================================

    const handleRegister = async (event) => {

        if (event) {
            event.preventDefault();
        }

        setAuthMessage("Creating account...");

        try {

            await apiRequest(
                `${API_BASE_URL}/patients/register`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        name:
                            registerName,

                        age:
                            Number(
                                registerAge
                            ),

                        gender:
                            registerGender,

                        phone:
                            registerPhone,

                        email:
                            registerEmail,

                        password:
                            registerPassword
                    })
                }
            );

            setAuthMessage(
                "Registration successful. Please login."
            );

            // Switch to login
            setAuthMode("login");

            // Put registered email
            setLoginEmail(
                registerEmail
            );

            // Clear registration form
            setRegisterName("");
            setRegisterAge("");
            setRegisterGender("");
            setRegisterPhone("");
            setRegisterEmail("");
            setRegisterPassword("");

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setAuthMessage(
                error.message ||
                "Registration failed."
            );
        }
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("jwt");
        localStorage.removeItem("patient");

        setToken("");
        setPatient(null);

        setQuery("");
        setResults([]);

        setSelectedHospital(null);
        setDoctors([]);

        setSelectedDoctor(null);
        setSlots([]);

        setAppointments([]);

        setBookingMessage("");
        setAppointmentMessage("");

        setAuthMode("login");

        setAuthMessage(
            "You have been logged out."
        );

        setCurrentPage("auth");
    };


    // =========================================================
    // LOAD APPOINTMENTS WHEN LOGGED IN
    // =========================================================

    useEffect(() => {

        if (token) {
            loadAppointments();
        }

    }, [token]);


    // =========================================================
    // REFRESH APPOINTMENTS EVERY TIME THE
    // APPOINTMENTS PAGE IS OPENED
    // (covers navbar clicks, not just the
    // "View My Appointments" button after booking)
    // =========================================================

    useEffect(() => {

        if (
            currentPage === "appointments" &&
            token
        ) {
            loadAppointments();
        }

    }, [currentPage]);


    // =========================================================
    // NAVBAR
    // =========================================================

    const renderNavbar = () => {

        if (!token) {
            return null;
        }

        return (
            <nav className="navbar">

                <div
                    className="navbar-brand"
                    onClick={() =>
                        navigateTo("home")
                    }
                >

                    <span className="navbar-logo">
                        🏥
                    </span>

                    <span>
                        AI Hospital
                    </span>

                </div>


                <div className="navbar-links">

                    <button
                        className={
                            currentPage === "home"
                                ? "nav-link active"
                                : "nav-link"
                        }
                        onClick={() =>
                            navigateTo("home")
                        }
                    >
                        Home
                    </button>


                    <button
                        className={
                            currentPage === "search"
                                ? "nav-link active"
                                : "nav-link"
                        }
                        onClick={() =>
                            navigateTo("search")
                        }
                    >
                        Search
                    </button>


                    <button
                        className={
                            currentPage === "appointments"
                                ? "nav-link active"
                                : "nav-link"
                        }
                        onClick={() =>
                            navigateTo("appointments")
                        }
                    >
                        Appointments
                    </button>


                    <button
                        className={
                            currentPage === "profile"
                                ? "nav-link active"
                                : "nav-link"
                        }
                        onClick={() =>
                            navigateTo("profile")
                        }
                    >
                        Profile
                    </button>

                </div>


                <div className="navbar-user">

                    <span>
                        👤{" "}
                        {patient?.name ||
                            "Patient"}
                    </span>

                </div>

            </nav>
        );
    };


    // =========================================================
    // FOOTER
    // =========================================================

    const renderFooter = () => {

        if (!token) {
            return null;
        }

        return (
            <footer className="footer">

                <div className="footer-content">

                    <div>
                        <strong>
                            🏥 AI Hospital
                        </strong>

                        <p>
                            AI-powered healthcare
                            discovery and booking.
                        </p>
                    </div>


                    <div>
                        <p>
                            © 2026 AI Hospital
                        </p>
                    </div>

                </div>

            </footer>
        );
    };


    // =========================================================
    // PAGE RENDERING
    // =========================================================

    const renderPage = () => {

        // -----------------------------------------------------
        // AUTH
        // -----------------------------------------------------

        if (
            currentPage === "auth" ||
            !token
        ) {

            return (
                <Auth
                    authMode={authMode}
                    setAuthMode={setAuthMode}

                    loginEmail={loginEmail}
                    setLoginEmail={
                        setLoginEmail
                    }

                    loginPassword={
                        loginPassword
                    }
                    setLoginPassword={
                        setLoginPassword
                    }

                    registerName={
                        registerName
                    }
                    setRegisterName={
                        setRegisterName
                    }

                    registerAge={
                        registerAge
                    }
                    setRegisterAge={
                        setRegisterAge
                    }

                    registerGender={
                        registerGender
                    }
                    setRegisterGender={
                        setRegisterGender
                    }

                    registerPhone={
                        registerPhone
                    }
                    setRegisterPhone={
                        setRegisterPhone
                    }

                    registerEmail={
                        registerEmail
                    }
                    setRegisterEmail={
                        setRegisterEmail
                    }

                    registerPassword={
                        registerPassword
                    }
                    setRegisterPassword={
                        setRegisterPassword
                    }

                    authMessage={
                        authMessage
                    }

                    onLogin={
                        handleLogin
                    }

                    onRegister={
                        handleRegister
                    }
                />
            );
        }


        // -----------------------------------------------------
        // HOME
        // -----------------------------------------------------

        if (
            currentPage === "home"
        ) {

            return (
                <Home
                    query={query}
                    setQuery={setQuery}

                    onSearch={
                        handleSearch
                    }

                    onQuickSearch={
                        handleQuickSearch
                    }
                />
            );
        }


        // -----------------------------------------------------
        // SEARCH
        // -----------------------------------------------------

        if (
            currentPage === "search"
        ) {

            return (
                <Search
                    query={query}
                    setQuery={setQuery}

                    onSearch={
                        handleSearch
                    }

                    message={
                        message
                    }

                    results={
                        results
                    }

                    location={
                        location
                    }

                    selectedHospital={
                        selectedHospital
                    }

                    onSelectHospital={
                        handleSelectHospital
                    }

                    doctors={
                        doctors
                    }

                    doctorMessage={
                        doctorMessage
                    }

                    selectedDoctor={
                        selectedDoctor
                    }

                    onViewSlots={
                        handleViewSlots
                    }

                    slots={
                        slots
                    }

                    slotMessage={
                        slotMessage
                    }

                    onBookAppointment={
                        handleBookAppointment
                    }

                    bookingMessage={
                        bookingMessage
                    }

                    bookingSuccess={
                        bookingSuccess
                    }

                    onViewAppointments={() =>
                        navigateTo(
                            "appointments"
                        )
                    }
                />
            );
        }


        // -----------------------------------------------------
        // APPOINTMENTS
        // -----------------------------------------------------

        if (
            currentPage === "appointments"
        ) {

            return (
                <Appointments
                    appointments={
                        appointments
                    }

                    appointmentMessage={
                        appointmentMessage
                    }

                    onCancelAppointment={
                        handleCancelAppointment
                    }

                    onFindHospital={() =>
                        navigateTo("search")
                    }
                />
            );
        }


        // -----------------------------------------------------
        // PROFILE
        // -----------------------------------------------------

        if (
            currentPage === "profile"
        ) {

            return (
                <Profile
                    patient={patient}
                    onLogout={
                        handleLogout
                    }
                />
            );
        }


        // -----------------------------------------------------
        // FALLBACK
        // -----------------------------------------------------

        return (
            <Home
                query={query}
                setQuery={setQuery}

                onSearch={
                    handleSearch
                }

                onQuickSearch={
                    handleQuickSearch
                }
            />
        );
    };


    // =========================================================
    // FINAL UI
    // =========================================================

    return (
        <div className="app">

            {renderNavbar()}

            {renderPage()}

            {renderFooter()}

        </div>
    );
}

export default App;
