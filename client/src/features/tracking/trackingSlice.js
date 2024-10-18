import { createSlice } from "@reduxjs/toolkit";

const trackingSlice = createSlice({
  name: "tracking",
  initialState: {
    driverLocation: null,
  },
  reducers: {
    updateDriverLocation: (state, action) => {
      state.driverLocation = action.payload;
    },
  },
});

export const { updateDriverLocation } = trackingSlice.actions;
export default trackingSlice.reducer;
