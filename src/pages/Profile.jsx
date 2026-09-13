function Profile({
    patient,
    onLogout
}) {

    return (
        <main className="page-container">

            {/* ================= PAGE HEADER ================= */}

            <section className="page-header">

                <span>
                    👤
                </span>

                <div>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your account information.
                    </p>

                </div>

            </section>


            {/* ================= PROFILE CARD ================= */}

            <section className="profile-card">

                {/* AVATAR */}

                <div className="profile-avatar">

                    {patient?.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                </div>


                {/* INFORMATION */}

                <div className="profile-info">

                    <h2>
                        {patient?.name}
                    </h2>

                    <p>
                        Patient
                    </p>


                    <div className="profile-fields">

                        {/* PATIENT ID */}

                        <div>

                            <span>
                                Patient ID
                            </span>

                            <strong>
                                {patient?.patientId}
                            </strong>

                        </div>


                        {/* EMAIL */}

                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {patient?.email}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* LOGOUT */}

                <button
                    className="profile-logout"
                    onClick={onLogout}
                >
                    Logout
                </button>

            </section>

        </main>
    );
}

export default Profile;