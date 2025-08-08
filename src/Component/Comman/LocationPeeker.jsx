import React, { useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Autocomplete,
} from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const defaultCenter = {
    lat: 20.5937, // default latitude (example: India)
    lng: 78.9629, // default longitude
};

function LocationPicker({ location, setLocation }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBown6Ooh4vZrY1dBnkPecuN2WTaPRNwsA",
        libraries: ["places"],
    });

    const [autocomplete, setAutocomplete] = useState(null);

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address;
                setLocation({ lat, lng, address });
            }
        }
    };

    const onMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setLocation((prev) => ({ ...prev, lat, lng }));
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                    type="text"
                    placeholder="Search your farm location"
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                />
            </Autocomplete>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={location ? { lat: location.lat, lng: location.lng } : defaultCenter}
                zoom={location ? 15 : 5}
            >
                {location && (
                    <Marker
                        position={{ lat: location.lat, lng: location.lng }}
                        draggable={true}
                        onDragEnd={onMarkerDragEnd}
                    />
                )}
            </GoogleMap>
            {location?.address && (
                <p className="mt-1 text-gray-700">Selected Address: {location.address}</p>
            )}
        </div>
    );
}

export default LocationPicker;
