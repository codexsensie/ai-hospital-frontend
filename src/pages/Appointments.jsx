function Appointments({
    appointments,
    appointmentMessage,
    onCancelAppointment,
    onFindHospital
}) {

    return (
        <main className="page-container">

            {/* ================= PAGE HEADER ================= */}

            <section className="page-header">

                <span>
                    📅
                </span>

                <div>

                    <h1>
                        My Appointments
                    </h1>

                    <p>
                        Manage your upcoming appointments.
                    </p>

                </div>

            </section>


            {/* ================= MESSAGE ================= */}

            {appointmentMessage && (

                <div className="search-message">
                    {appointmentMessage}
                </div>

            )}


            {/* ================= EMPTY STATE ================= */}

            {appointments.length === 0 &&
                !appointmentMessage && (

                <div className="empty-state">

                    <div>
                        📅
                    </div>

                    <h2>
                        No appointments yet
                    </h2>

                    <p>
                        Your booked appointments will
                        appear here.
                    </p>

                    <button
                        onClick={onFindHospital}
                    >
                        Find a Hospital
                    </button>

                </div>

            )}


            {/* ================= APPOINTMENT LIST ================= */}

            <div className="appointment-list">

                {appointments.map((appointment) => (

                    <div
                        className="appointment-card"
                        key={
                            appointment.appointmentId
                        }
                    >

                        {/* ICON */}

                        <div className="appointment-icon">

                            🏥

                        </div>


                        {/* DETAILS */}

                        <div className="appointment-details">

                            <span className="appointment-status">
                                CONFIRMED
                            </span>


                            <h3>
                                {
                                    appointment.doctorName
                                }
                            </h3>


                            <p>
                                {
                                    appointment.hospitalName
                                }
                            </p>


                            <div className="appointment-meta">

                                <span>
                                    🕐{" "}

                                    {new Date(
                                        appointment.slotTime
                                    ).toLocaleString()}
                                </span>


                                <span>
                                    🎫 Appointment #

                                    {
                                        appointment.appointmentId
                                    }
                                </span>

                            </div>

                        </div>


                        {/* CANCEL */}

                        <button
                            className="cancel-button"
                            onClick={() =>
                                onCancelAppointment(
                                    appointment.appointmentId
                                )
                            }
                        >
                            Cancel
                        </button>

                    </div>

                ))}

            </div>

        </main>
    );
}

export default Appointments;