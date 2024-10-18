import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getAllDrivers = createAsyncThunk("driver/getAll", async () => {
  const response = await api.get("/drivers");
  return response.data;
});

export const updateDriver = createAsyncThunk(
  "driver/update",
  async ({ id, ...driverData }) => {
    const response = await api.put(`/drivers/${id}`, driverData);
    return response.data;
  }
);

export const deleteDriver = createAsyncThunk("driver/delete", async (id) => {
  await api.delete(`/drivers/${id}`);
  return id;
});

export const updateDriverLocation = createAsyncThunk(
  "driver/updateLocation",
  async (location) => {
    const response = await api.put("/drivers/location", location);
    return response.data;
  }
);

const driverSlice = createSlice({
  name: "driver",
  initialState: {
    drivers: [],
    currentDriver: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDrivers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDrivers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.drivers = action.payload;
      })
      .addCase(getAllDrivers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(
          (driver) => driver._id === action.payload._id
        );
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter(
          (driver) => driver._id !== action.payload
        );
      })
      .addCase(updateDriverLocation.fulfilled, (state, action) => {
        state.currentDriver = { ...state.currentDriver, ...action.payload };
      });
  },
});

export default driverSlice.reducer;
