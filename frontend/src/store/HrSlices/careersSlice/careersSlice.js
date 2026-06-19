import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../../services/axios";
import axiosPublic from "../../../services/axiosPublic"

// ─────────────────────────────────────────────
// 1. Fetch All Jobs (with filters + pagination)
// GET /api/jobs?department=&experienceLevel=&jobType=&page=1&limit=6
// ─────────────────────────────────────────────
export const fetchJobs = createAsyncThunk(
    "careers/fetchJobs",
    async ({ department, experienceLevel, jobType, page = 1, limit = 6 } = {}, { rejectWithValue }) => {
        try {
            const response = await axiosPublic.get("/jobs", {
                params: {
                    page,
                    limit,
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

// ─────────────────────────────────────────────
// 2. Search Jobs by title
// GET /api/jobs/search?title=developer
// ─────────────────────────────────────────────
export const searchJobs = createAsyncThunk(
    "careers/searchJobs",
    async (title, { rejectWithValue }) => {
        try {
            const response = await axiosPublic.get("/jobs/search", {
                params: { title },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Search failed");
        }
    }
);

// ─────────────────────────────────────────────
// 3. Fetch Single Job by ID
// GET /api/jobs/:id
// ─────────────────────────────────────────────
export const fetchJobById = createAsyncThunk(
    "careers/fetchJobById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosPublic.get(`/jobs/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch job");
        }
    }
);

// ─────────────────────────────────────────────
// 4. Apply to a Job
// POST /api/applicants/apply/:jobId  (multipart/form-data)
// ─────────────────────────────────────────────
export const applyToJob = createAsyncThunk(
    "careers/applyToJob",
    async ({ jobId, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosPublic.post(`/applicants/apply/${jobId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (err) {
            // ✅ اطبعي كل حاجة عشان تشوفي الـ error الحقيقي
            console.log("Full axios error:", err);
            console.log("err.response:", err.response);
            console.log("err.message:", err.message);
            console.log("err.code:", err.code);

            const errData = err.response?.data;
            if (Array.isArray(errData)) return rejectWithValue(errData);
            return rejectWithValue(errData?.message || "Failed to submit application");
        }
    }
);
// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────
const careersSlice = createSlice({
    name: "careers",
    initialState: {
        // Jobs list
        jobs: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
            limit: 6,
        },
        loading: false,

        // Search
        searchResults: null,   // null = مفيش search نشطة ، [] = search فيها 0 نتايج
        searchLoading: false,
        isSearchMode: false,   // flag عشان الـ page تعرف تعرض إيه

        // Single Job
        selectedJob: null,
        jobLoading: false,

        // Apply
        applyLoading: false,
        applySuccess: false,

        // Filters (بنحتفظ بيهم عشان نعمل re-fetch بعد reset)
        activeFilters: {
            department: "All",
            experienceLevel: "All",
            jobType: "All",
        },

        error: null,
    },

    reducers: {
        // تحديث الـ filters من الـ FilterBar
        setFilters(state, action) {
            state.activeFilters = { ...state.activeFilters, ...action.payload };
        },
        // رجّع الـ search mode للـ false (لما يضغط Clear)
        clearSearch(state) {
            state.searchResults = null;
            state.isSearchMode = false;
        },
        // reset بعد نجاح الـ apply عشان يقدر يقدم تاني
        resetApply(state) {
            state.applySuccess = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // ── Fetch All Jobs ──────────────────────────
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.data?.jobs || [];
                if (action.payload.data?.pagination) {
                    state.pagination = action.payload.data.pagination;
                }
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── Search Jobs ─────────────────────────────
            .addCase(searchJobs.pending, (state) => {
                state.searchLoading = true;
                state.error = null;
                state.isSearchMode = true;
            })
            .addCase(searchJobs.fulfilled, (state, action) => {
                state.searchLoading = false;
                // results = [{ _id, title, status, date }]
                state.searchResults = action.payload.data?.results || [];
            })
            .addCase(searchJobs.rejected, (state, action) => {
                state.searchLoading = false;
                state.error = action.payload;
                state.searchResults = [];
            })

            // ── Fetch Single Job ────────────────────────
            .addCase(fetchJobById.pending, (state) => {
                state.jobLoading = true;
                state.error = null;
                state.selectedJob = null;
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.jobLoading = false;
                state.selectedJob = action.payload.data?.job || null;
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.jobLoading = false;
                state.error = action.payload;
            })

            // ── Apply to Job ────────────────────────────
            .addCase(applyToJob.pending, (state) => {
                state.applyLoading = true;
                state.applySuccess = false;
                state.error = null;
            })
            .addCase(applyToJob.fulfilled, (state) => {
                state.applyLoading = false;
                state.applySuccess = true;
            })
            .addCase(applyToJob.rejected, (state, action) => {
                state.applyLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearSearch, resetApply } = careersSlice.actions;
export default careersSlice.reducer;