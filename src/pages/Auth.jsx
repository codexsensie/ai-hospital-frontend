function Auth({
    authMode,
    setAuthMode,

    loginEmail,
    setLoginEmail,

    loginPassword,
    setLoginPassword,

    registerName,
    setRegisterName,

    registerAge,
    setRegisterAge,

    registerGender,
    setRegisterGender,

    registerPhone,
    setRegisterPhone,

    registerEmail,
    setRegisterEmail,

    registerPassword,
    setRegisterPassword,

    authMessage,

    onLogin,
    onRegister
}) {

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* ================= LOGO ================= */}

                <div className="auth-logo">
                    🏥
                </div>


                <h1>
                    AI Hospital
                </h1>


                <p className="auth-subtitle">
                    Find hospitals, doctors and
                    medical services near you.
                </p>


                {/* ================================================= */}
                {/* LOGIN */}
                {/* ================================================= */}

                {authMode === "login" && (

                    <form
                        onSubmit={onLogin}
                        className="auth-form"
                    >

                        <h2>
                            Welcome Back
                        </h2>

                        <p>
                            Login to continue
                        </p>


                        {/* EMAIL */}

                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(event) =>
                                setLoginEmail(
                                    event.target.value
                                )
                            }
                            required
                        />


                        {/* PASSWORD */}

                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(event) =>
                                setLoginPassword(
                                    event.target.value
                                )
                            }
                            required
                        />


                        <button type="submit">
                            Login
                        </button>


                        {/* MESSAGE */}

                        {authMessage && (

                            <p className="auth-message">
                                {authMessage}
                            </p>

                        )}


                        {/* SWITCH */}

                        <p className="auth-switch">

                            Don't have an account?

                            <button
                                type="button"
                                onClick={() => {
                                    setAuthMode(
                                        "register"
                                    );
                                }}
                            >
                                Register
                            </button>

                        </p>

                    </form>

                )}


                {/* ================================================= */}
                {/* REGISTER */}
                {/* ================================================= */}

                {authMode === "register" && (

                    <form
                        onSubmit={onRegister}
                        className="auth-form"
                    >

                        <h2>
                            Create Account
                        </h2>

                        <p>
                            Register as a patient
                        </p>


                        {/* NAME */}

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={registerName}
                            onChange={(event) =>
                                setRegisterName(
                                    event.target.value
                                )
                            }
                            required
                        />


                        {/* AGE */}

                        <input
                            type="number"
                            placeholder="Age"
                            value={registerAge}
                            onChange={(event) =>
                                setRegisterAge(
                                    event.target.value
                                )
                            }
                            required
                        />


                        {/* GENDER */}

                        <select
                            value={registerGender}
                            onChange={(event) =>
                                setRegisterGender(
                                    event.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Select Gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>


                        {/* PHONE */}

                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={registerPhone}
                            onChange={(event) =>
                                setRegisterPhone(
                                    event.target.value
                                )
                            }
                            required
                        />


                        {/* EMAIL */}

                        <input
                            type="email"
                            placeholder="Email"
                            value={registerEmail}
                            onChange={(event) =>
                                setRegisterEmail(
                                    event.target.value
                                )
                            }
                            required
                        />


                        {/* PASSWORD */}

                        <input
                            type="password"
                            placeholder="Password"
                            value={registerPassword}
                            onChange={(event) =>
                                setRegisterPassword(
                                    event.target.value
                                )
                            }
                            required
                        />


                        {/* SUBMIT */}

                        <button type="submit">
                            Create Account
                        </button>


                        {/* MESSAGE */}

                        {authMessage && (

                            <p className="auth-message">
                                {authMessage}
                            </p>

                        )}


                        {/* SWITCH */}

                        <p className="auth-switch">

                            Already have an account?

                            <button
                                type="button"
                                onClick={() => {
                                    setAuthMode(
                                        "login"
                                    );
                                }}
                            >
                                Login
                            </button>

                        </p>

                    </form>

                )}

            </div>

        </div>
    );
}

export default Auth;