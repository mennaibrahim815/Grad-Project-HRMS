import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../services/axios";

// 1. Fetch All Applicants
export const fetchAllApplicants = createAsyncThunk(
  "hiring/fetchAll",
  async ({ status, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/applicants", {
        params: {
          page,
          limit,
          ...(status && status !== "All" && { status }),
        },
      });
      return response.data;
    } catch (err) {
      console.log("Full error:", err.response);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applicants");
    }
  }
);

// 2. Search Applicants
export const searchHiring = createAsyncThunk(
  "hiring/search",
  async ({ name, status, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/applicants/search`, {
        params: {
          name,
          page,
          limit,
          ...(status && status !== "All" && { status }),
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

// 3. Fetch Single Applicant
export const fetchApplicantById = createAsyncThunk(
  "hiring/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/applicants/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applicant");
    }
  }
);

// 4. Delete Applicant
export const deleteApplicant = createAsyncThunk(
  "hiring/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/applicants/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete applicant");
    }
  }
);
// 5.Fetch Hiring Statistics
export const fetchHiringSummary = createAsyncThunk(
  "hiring/fetchHiringSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`applicants/hiring-statistics`, {

      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch payroll summary");
    }
  }
)
// 6. Create Job
export const createJob = createAsyncThunk(
  "hiring/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/jobs", jobData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create job");
    }
  }
);
// 7. Update Applicant Status
export const updateApplicantStatus = createAsyncThunk(
  "hiring/updateStatus",
  async ({ id, status, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/applicants/${id}`, {
        status,
        ...(rejectionReason && { rejectionReason }),
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);
// 8. Fetch All Jobs (HR)
export const fetchAllJobs = createAsyncThunk(
  "hiring/fetchAllJobs",
  async ({ department, experienceLevel, jobType, page = 1, limit = 5 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/jobs", {
        params: {
          page, limit,
          ...(department && department !== "All" && { department }),
          ...(experienceLevel && experienceLevel !== "All" && { experienceLevel }),
          ...(jobType && jobType !== "All" && { jobType }),
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
    }
  }
);

// 9. Search Jobs (HR)
export const searchJobsHR = createAsyncThunk(
  "hiring/searchJobsHR",
  async (title, { rejectWithValue }) => {
    try {
      const response = await axios.get("/jobs/search", { params: { title } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

// 10. Delete Job
export const deleteJob = createAsyncThunk(
  "hiring/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/jobs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete job");
    }
  }
);

// 11. Fetch Job By ID
export const fetchJobById = createAsyncThunk(
  "hiring/fetchJobById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/jobs/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch job");
    }
  }
);

// 12. Update Job
export const updateJob = createAsyncThunk(
  "hiring/updateJob",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/jobs/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update job");
    }
  }
);

// 13. Fetch Applicants By Job
export const fetchApplicantsByJob = createAsyncThunk(
  "hiring/fetchApplicantsByJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/applicants/job/${jobId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applicants");
    }
  }
);

// 14.Onboard Applicant (Hired)
export const onboardApplicant = createAsyncThunk(
  "hiring/onboardApplicant",
  async ({ id, onboardData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/applicants/${id}/onboard`, onboardData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to onboard employee");
    }
  }
);

const hiringSlice = createSlice({
  name: "hiring",
  initialState: {
    analytics: null,
    list: [],
    selectedApplicant: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      limit: 5,
    },
    jobs: [],
    jobsPagination: { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 5 },
    jobsLoading: false,
    jobsSearchLoading: false,
    jobDeleteLoading: false,

    loading: false,
    searchLoading: false,
    detailsLoading: false,
    deleteLoading: false,
    summaryLoading: false,
    createLoading: false,
    error: null,

    selectedJob: null,
    jobDetailLoading: false,
    updateJobLoading: false,
    jobApplicants: [],
    jobApplicantsLoading: false,

  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data?.applicants || [];
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchAllApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search
      .addCase(searchHiring.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchHiring.fulfilled, (state, action) => {
        state.searchLoading = false;
        const results = action.payload.data?.results || [];
        state.list = results;
        state.pagination = action.payload.data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: results.length,
          limit: 5,
        };
      })
      .addCase(searchHiring.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
        state.list = [];
      })

      // Fetch Single
      .addCase(fetchApplicantById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
        state.selectedApplicant = null;
      })
      .addCase(fetchApplicantById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        // state.selectedApplicant = action.payload.data?.applicants?.[0] || null;
        state.selectedApplicant = action.payload.data?.applicant || null;
      })
      .addCase(fetchApplicantById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteApplicant.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteApplicant.fulfilled, (state, action) => {
        state.deleteLoading = false;

        state.list = state.list.filter((applicant) => applicant._id !== action.payload);
        state.pagination.totalRecords -= 1;
      })
      .addCase(deleteApplicant.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      // Fetch Hiring Summary
      .addCase(fetchHiringSummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })
      .addCase(fetchHiringSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchHiringSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = action.payload;
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        const updated = action.payload.data?.applicant;
        if (updated) {
          state.selectedApplicant = { ...state.selectedApplicant, status: updated.status };
          state.list = state.list.map((a) =>
            a._id === updated._id ? { ...a, status: updated.status } : a
          );
        }
      })
      // Fetch All Jobs
      .addCase(fetchAllJobs.pending, (state) => { state.jobsLoading = true; })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobs = action.payload.data?.jobs || [];
        if (action.payload.data?.pagination) state.jobsPagination = action.payload.data.pagination;
      })
      .addCase(fetchAllJobs.rejected, (state) => { state.jobsLoading = false; })

      // Search Jobs HR
      .addCase(searchJobsHR.pending, (state) => { state.jobsSearchLoading = true; })
      .addCase(searchJobsHR.fulfilled, (state, action) => {
        state.jobsSearchLoading = false;
        state.jobs = action.payload.data?.results || [];
      })
      .addCase(searchJobsHR.rejected, (state) => { state.jobsSearchLoading = false; })

      // Delete Job
      .addCase(deleteJob.pending, (state) => { state.jobDeleteLoading = true; })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobDeleteLoading = false;
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
        state.jobsPagination.totalRecords -= 1;
      })
      .addCase(deleteJob.rejected, (state) => { state.jobDeleteLoading = false; })

      // Fetch Job By ID
      .addCase(fetchJobById.pending, (state) => { state.jobDetailLoading = true; state.selectedJob = null; })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobDetailLoading = false;
        state.selectedJob = action.payload.data?.job || null;
      })
      .addCase(fetchJobById.rejected, (state) => { state.jobDetailLoading = false; })

      // Update Job
      .addCase(updateJob.pending, (state) => { state.updateJobLoading = true; })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.updateJobLoading = false;
        state.selectedJob = action.payload.data?.job || state.selectedJob;
      })
      .addCase(updateJob.rejected, (state) => { state.updateJobLoading = false; })

      // Fetch Applicants By Job
      .addCase(fetchApplicantsByJob.pending, (state) => { state.jobApplicantsLoading = true; })
      .addCase(fetchApplicantsByJob.fulfilled, (state, action) => {
        state.jobApplicantsLoading = false;
        state.jobApplicants = action.payload.data?.applicants || [];
      })
      .addCase(fetchApplicantsByJob.rejected, (state) => { state.jobApplicantsLoading = false; state.jobApplicants = []; })
      .addCase(onboardApplicant.pending, (state) => {
        state.loading = true; // أو يمكنك عمل ستايت مخصصة مثل onboardLoading
        state.error = null;
      })
      .addCase(onboardApplicant.fulfilled, (state, action) => {
        state.loading = false;

        // الـ ID الخاص بالمتقدم الذي تم تعيينه
        const onboardedId = action.meta.arg.id;

        // 1. تحديث حالة المتقدم في تفاصيل المتقدم المفتوحة حالياً (إن وجدت)
        if (state.selectedApplicant && state.selectedApplicant._id === onboardedId) {
          state.selectedApplicant = {
            ...state.selectedApplicant,
            status: "Hired"
          };
        }

        // 2. تحديث حالته داخل القائمة الرئيسية (List) ليصبح "Hired" بدلاً من حذفه
        state.list = state.list.map((applicant) =>
          applicant._id === onboardedId
            ? { ...applicant, status: "Hired" }
            : applicant
        );
      })
      .addCase(onboardApplicant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default hiringSlice.reducer;