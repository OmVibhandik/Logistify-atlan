import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  }
);

export const getUserBookings = createAsyncThunk(
  "booking/getUserBookings",
  async () => {
    const response = await api.get("/bookings");
    return response.data;
  }
);

export const getAllBookings = createAsyncThunk(
  "booking/getAllBookings",
  async () => {
    const response = await api.get("/bookings/all");
    return response.data;
  }
);

export const estimatePrice = createAsyncThunk(
  "booking/estimatePrice",
  async (bookingData) => {
    const response = await api.post("/bookings/estimate", bookingData);
    return response.data;
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    currentBooking: null,
    isLoading: false,
    error: null,
    estimatedPrice: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getUserBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      .addCase(estimatePrice.fulfilled, (state, action) => {
        state.estimatedPrice = action.payload.estimatedPrice;
      });
  },
});

export default bookingSlice.reducer;
