function Home({ query, setQuery, onSearch, onQuickSearch }) {

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(event);
    };

    return (
        <main className="home-page">

            {/* ================= HERO ================= */}

            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-badge">
                        AI-Powered Healthcare Search
                    </span>

                    <h1>
                        Find the right
                        <span> medical care </span>
                        near you.
                    </h1>

                    <p>
                        Search for hospitals, medical tests
                        and doctors using simple natural language.
                    </p>

                    <form
                        className="hero-search"
                        onSubmit={handleSubmit}
                    >

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder='Try "MRI near me" or "cheap blood test"'
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                        />

                        <button type="submit">
                            Search
                        </button>

                    </form>

                </div>

            </section>


            {/* ================= POPULAR SERVICES ================= */}

            <section className="home-section">

                <div className="section-heading">

                    <h2>
                        Popular Services
                    </h2>

                    <p>
                        Quickly search for common medical services.
                    </p>

                </div>


                <div className="service-grid">

                    <button
                        className="service-card"
                        onClick={() =>
                            onQuickSearch("X-ray near me")
                        }
                    >

                        <span>
                            🩻
                        </span>

                        <strong>
                            X-Ray
                        </strong>

                        <small>
                            Find nearby X-Ray services
                        </small>

                    </button>


                    <button
                        className="service-card"
                        onClick={() =>
                            onQuickSearch("MRI near me")
                        }
                    >

                        <span>
                            🧲
                        </span>

                        <strong>
                            MRI Scan
                        </strong>

                        <small>
                            Find MRI centers nearby
                        </small>

                    </button>


                    <button
                        className="service-card"
                        onClick={() =>
                            onQuickSearch("blood test near me")
                        }
                    >

                        <span>
                            🩸
                        </span>

                        <strong>
                            Blood Test
                        </strong>

                        <small>
                            Compare blood test prices
                        </small>

                    </button>


                    <button
                        className="service-card"
                        onClick={() =>
                            onQuickSearch("CT scan near me")
                        }
                    >

                        <span>
                            🧠
                        </span>

                        <strong>
                            CT Scan
                        </strong>

                        <small>
                            Find CT scan facilities
                        </small>

                    </button>

                </div>

            </section>


            {/* ================= HOW IT WORKS ================= */}

            <section className="home-section">

                <div className="section-heading">

                    <h2>
                        How AI Hospital Works
                    </h2>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <span>
                            01
                        </span>

                        <h3>
                            Describe what you need
                        </h3>

                        <p>
                            Simply type your requirement
                            in natural language.
                        </p>

                    </div>


                    <div className="feature-card">

                        <span>
                            02
                        </span>

                        <h3>
                            Compare hospitals
                        </h3>

                        <p>
                            Compare distance, price,
                            ratings and availability.
                        </p>

                    </div>


                    <div className="feature-card">

                        <span>
                            03
                        </span>

                        <h3>
                            Book an appointment
                        </h3>

                        <p>
                            Select a doctor and available
                            slot to book instantly.
                        </p>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;