import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useSelector } from "react-redux";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const BookingMap = ({ booking }) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const { driverLocation } = useSelector((state) => state.tracking);

  useEffect(() => {
    if (
      booking.status === "Pending" ||
      booking.status === "En Route to Pickup"
    ) {
      setCenter({
        lat: parseFloat(booking.pickupLocation.split(",")[0]),
        lng: parseFloat(booking.pickupLocation.split(",")[1]),
      });
    } else {
      setCenter({
        lat: parseFloat(booking.dropoffLocation.split(",")[0]),
        lng: parseFloat(booking.dropoffLocation.split(",")[1]),
      });
    }
  }, [booking]);

  return (
    // <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
    <LoadScript >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <Marker
          position={center}
          label={
            booking.status === "Pending" ||
            booking.status === "En Route to Pickup"
              ? "P"
              : "D"
          }
        />
        {driverLocation && <Marker position={driverLocation} label="D" />}
      </GoogleMap>
    </LoadScript>
  );
};

export default BookingMap;
