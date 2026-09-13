import {
    APIProvider,
    Map,
    AdvancedMarker,
    InfoWindow
} from "@vis.gl/react-google-maps";

function HospitalMap({
    latitude,
    longitude,
    hospitals,
    selectedHospital,
    onSelectHospital
}) {

    return (
        <APIProvider
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        >

            <Map
                defaultCenter={{
                    lat: latitude,
                    lng: longitude
                }}
                defaultZoom={12}
                mapId="9b12fcc478fe15d23fcb7ea4"
                style={{
                    width: "100%",
                    height: "500px"
                }}
            >

                {/* User location */}

                <AdvancedMarker
                    position={{
                        lat: latitude,
                        lng: longitude
                    }}
                    title="Your Location"
                />

                {/* Hospital markers */}

                {(hospitals || []).map((hospital) => (

                    <AdvancedMarker
                        key={hospital.hospitalId}
                        position={{
                            lat: hospital.latitude,
                            lng: hospital.longitude
                        }}
                        title={hospital.hospitalName}
                        onClick={() =>
                            onSelectHospital(hospital)
                        }
                    />

                ))}

                {/* Selected hospital information */}

                {selectedHospital && (

                    <InfoWindow
                        position={{
                            lat: selectedHospital.latitude,
                            lng: selectedHospital.longitude
                        }}
                    >

                        <div>

                            <h3>
                                {selectedHospital.hospitalName}
                            </h3>

                            <p>
                                🏥 {
                                    selectedHospital.serviceName
                                }
                            </p>

                            <p>
                                💰 ₹{
                                    selectedHospital.price
                                }
                            </p>

                            <p>
                                📏 {
                                    selectedHospital.distanceKm
                                } km
                            </p>

                            <p>
                                ⭐ {
                                    selectedHospital.rating ??
                                    "No rating"
                                }
                            </p>

                            <p>
                                🕐 {
                                    selectedHospital.openNow
                                        ? "Open now"
                                        : "Closed"
                                }
                            </p>

                            <button
                                onClick={() =>
                                    onSelectHospital(
                                        selectedHospital
                                    )
                                }
                            >
                                View Doctors
                            </button>

                        </div>

                    </InfoWindow>

                )}

            </Map>

        </APIProvider>
    );
}

export default HospitalMap;