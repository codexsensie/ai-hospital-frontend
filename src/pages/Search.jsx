import HospitalMap from "../Map";

function Search({
    query,
    setQuery,
    onSearch,
    message,
    results,
    location,
    selectedHospital,
    onSelectHospital,
    doctors,
    doctorMessage,
    selectedDoctor,
    onViewSlots,
    slots,
    slotMessage,
    onBookAppointment,
    bookingMessage,
    bookingSuccess,
    onViewAppointments
}) {

    return (
        <main className="page-container">

            {/* ================= PAGE HEADER ================= */}

            <section className="page-header">

                <span>
                    🔍
                </span>

                <div>

                    <h1>
                        Search Hospitals
                    </h1>

                    <p>
                        Find hospitals and medical services
                        near you.
                    </p>

                </div>

            </section>


            {/* ================= SEARCH FORM ================= */}

            <form
                className="search-page-form"
                onSubmit={onSearch}
            >

                <input
                    type="text"
                    placeholder='Example: "MRI near me under 5000"'
                    value={query}
                    onChange={(event) =>
                        setQuery(event.target.value)
                    }
                />

                <button type="submit">
                    Search
                </button>

            </form>


            {/* ================= SEARCH MESSAGE ================= */}

            {message && (

                <div className="search-message">
                    {message}
                </div>

            )}


            {/* ================= SEARCH RESULTS ================= */}

            {results.length > 0 &&
                location && (

                <section className="search-results">

                    <div className="results-header">

                        <h2>
                            Hospitals
                        </h2>

                        <span>
                            {results.length} found
                        </span>

                    </div>


                    {/* ================= MAP ================= */}

                    <div className="map-wrapper">

                        <HospitalMap
                            latitude={
                                location.latitude
                            }

                            longitude={
                                location.longitude
                            }

                            hospitals={
                                results
                            }

                            selectedHospital={
                                selectedHospital
                            }

                            onSelectHospital={
                                onSelectHospital
                            }
                        />

                    </div>


                    {/* ================= HOSPITAL CARDS ================= */}

                    <div className="hospital-results">

                        {results.map((hospital) => (

                            <div
                                className={
                                    selectedHospital?.hospitalId ===
                                    hospital.hospitalId
                                        ? "hospital-card selected"
                                        : "hospital-card"
                                }

                                key={
                                    hospital.hospitalId
                                }

                                onClick={() =>
                                    onSelectHospital(
                                        hospital
                                    )
                                }
                            >

                                <div className="hospital-card-top">

                                    <div>

                                        <h3>
                                            {
                                                hospital.hospitalName
                                            }
                                        </h3>

                                        <p>
                                            {
                                                hospital.address
                                            }
                                        </p>

                                    </div>


                                    <span className="rating">

                                        ⭐{" "}

                                        {
                                            hospital.rating ??
                                            "N/A"
                                        }

                                    </span>

                                </div>


                                <div className="hospital-info">

                                    <span>
                                        🏥{" "}

                                        {
                                            hospital.serviceName
                                        }
                                    </span>


                                    <span>
                                        💰 ₹
                                        {
                                            hospital.price
                                        }
                                    </span>


                                    <span>
                                        📍{" "}

                                        {
                                            hospital.distanceKm
                                        } km
                                    </span>


                                    <span>
                                        🕐{" "}

                                        {
                                            hospital.openNow
                                                ? "Open now"
                                                : "Closed"
                                        }
                                    </span>

                                </div>


                                <button
                                    className="view-doctors-button"

                                    onClick={(event) => {

                                        event.stopPropagation();

                                        onSelectHospital(
                                            hospital
                                        );

                                    }}
                                >
                                    View Doctors
                                </button>

                            </div>

                        ))}

                    </div>

                </section>

            )}


            {/* ================================================= */}
            {/* DOCTORS */}
            {/* ================================================= */}

            {selectedHospital && (

                <section className="doctor-section">

                    <div className="section-heading">

                        <h2>
                            Doctors at{" "}
                            {
                                selectedHospital.hospitalName
                            }
                        </h2>

                        <p>
                            Select a doctor to view
                            available appointment slots.
                        </p>

                    </div>


                    {doctorMessage && (

                        <p className="info-message">
                            {doctorMessage}
                        </p>

                    )}


                    <div className="doctor-grid">

                        {doctors.map((doctor) => (

                            <div
                                className={
                                    selectedDoctor?.doctorId ===
                                    doctor.doctorId
                                        ? "doctor-card selected"
                                        : "doctor-card"
                                }

                                key={
                                    doctor.doctorId
                                }
                            >

                                <div className="doctor-avatar">
                                    👨‍⚕️
                                </div>


                                <h3>
                                    {doctor.name}
                                </h3>


                                <p>
                                    {
                                        doctor.departmentName
                                    }
                                </p>


                                <p>
                                    {
                                        doctor.experience
                                    } years experience
                                </p>


                                <strong>
                                    ₹
                                    {
                                        doctor.consultationFee
                                    }
                                </strong>


                                <button
                                    onClick={() =>
                                        onViewSlots(
                                            doctor
                                        )
                                    }
                                >
                                    View Slots
                                </button>

                            </div>

                        ))}

                    </div>

                </section>

            )}


            {/* ================================================= */}
            {/* SLOTS */}
            {/* ================================================= */}

            {selectedDoctor && (

                <section className="slots-section">

                    <div className="section-heading">

                        <h2>
                            Available Slots
                        </h2>

                        <p>
                            {
                                selectedDoctor.name
                            }
                        </p>

                    </div>


                    {slotMessage && (

                        <p className="info-message">
                            {slotMessage}
                        </p>

                    )}


                    <div className="slots-grid">

                        {slots.map((slot) => (

                            <button
                                className="slot-button"

                                key={
                                    slot.slotId
                                }

                                onClick={() =>
                                    onBookAppointment(
                                        slot
                                    )
                                }
                            >

                                🕐{" "}

                                {new Date(
                                    slot.slotTime
                                ).toLocaleString()}

                            </button>

                        ))}

                    </div>


                    {/* ================= BOOKING MESSAGE ================= */}

                    {bookingMessage && (

                        <div
                            className={
                                bookingSuccess
                                    ? "booking-message success"
                                    : "booking-message"
                            }
                        >

                            <span>
                                {
                                    bookingSuccess
                                        ? "✓"
                                        : "ℹ"
                                }
                            </span>


                            {bookingMessage}


                            {bookingSuccess && (

                                <button
                                    onClick={
                                        onViewAppointments
                                    }
                                >
                                    View My Appointments
                                </button>

                            )}

                        </div>

                    )}

                </section>

            )}

        </main>
    );
}

export default Search;