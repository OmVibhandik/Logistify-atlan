import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const getDriverJobs = createAsyncThunk("job/getDriverJobs", async () => {
  const response = await api.get("/jobs/driver");
  return response.data;
});

export const updateJobStatus = createAsyncThunk(
  "job/updateStatus",
  async ({ jobId, status }) => {
    const response = await api.put(`/jobs/${jobId}/status`, { status });
    return response.data;
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDriverJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDriverJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(getDriverJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      });
  },
});

export default jobSlice.reducer;
