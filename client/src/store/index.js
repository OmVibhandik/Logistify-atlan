import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/booking/bookingSlice";
import trackingReducer from "../features/tracking/trackingSlice";
import driverReducer from "../features/driver/driverSlice";
import jobReducer from "../features/job/jobSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    tracking: trackingReducer,
    driver: driverReducer,
    job: jobReducer,
  },
});
