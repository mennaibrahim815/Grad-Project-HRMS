import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";


export const fetchAllEmployees = createAsyncThunk(
  "employees/fetchAll",
  async ({ page = 1, limit = 5, jobType }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users`, {
        params: {
          page,
          limit,
          ...(jobType && { jobType })
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);
//Fetches full profile details of a specific user
export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch employee");
    }
  }
);
// 1. البحث في الموظفين
export const searchEmployees = createAsyncThunk(
  "employees/search",
  async (query, { rejectWithValue }) => {
    try {
   
      const response = await axios.get(`/employees/search?query=${query}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  },
);
// البحث المتقدم في الموظفين
export const searchEmployeesByName = createAsyncThunk(
  "employees/searchByName",
  async (name, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`/users/search`, {
        params: { name }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

export const fetchEmployeeSummary = createAsyncThunk(
  "employees/fetchSummary",
  async (id, { rejectWithValue }) => {
    try {

      const response = await axios.get(`/employees/${id}/summary`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch employee",
      );
    }
  },
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/users/${id}`, updatedData); // ← /users بدل /employees
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update employee");
    }
  }
);
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);


export const fetchHRs = createAsyncThunk(
  "employees/fetchAllHRs",
  async ({ page = 1, limit = 5, jobType }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/users/hrs", {
        params: {
          page,
          limit,
          ...(jobType && { jobType }),
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch HRs"
      );
    }
  }
);
const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    employeesList: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      limit: 5,
    },
    searchResults: [],
    employeeDetail: null,
    selectedEmployee: null,
    loading: false,
    searchLoading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchLoading = false;
      state.error = null;
    },
    resetEmployeeDetail: (state) => {
      state.employeeDetail = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
   
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        console.log("API Response:", action.payload);
        state.loading = false;

        const { users, pagination } = action.payload.data;

        state.employeesList = users || [];

        if (pagination) {
          state.pagination = {
            currentPage: pagination.currentPage ?? pagination.page ?? 1,
            totalPages: pagination.totalPages ?? pagination.pages ?? 1,
            totalRecords: pagination.totalRecords ?? pagination.total ?? 0,
            limit: pagination.limit ?? 5,
          };
        }
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Fetches full profile details of a specific user
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeDetail = action.payload.data.user; //
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // البحث
      .addCase(searchEmployees.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchEmployees.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(searchEmployees.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
        state.searchResults = [];
      })


      .addCase(searchEmployeesByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchEmployeesByName.fulfilled, (state, action) => {
        state.loading = false;

        console.log("Search Response:", action.payload); // ← شوف الـ structure

       
        const raw = action.payload.data?.results
          ?? action.payload.data
          ?? action.payload
          ?? [];

        state.employeesList = Array.isArray(raw) ? raw : [];

        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          totalRecords: state.employeesList.length,
        };
      })
      .addCase(searchEmployeesByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.employeesList = [];
      })
    
      .addCase(fetchEmployeeSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeSummary.fulfilled, (state, action) => {

        state.loading = false;
        state.employeeDetail = action.payload;
      })
      .addCase(fetchEmployeeSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data.user;


        if (state.employeeDetail?._id === updatedUser._id) {
          state.employeeDetail = updatedUser;
        }


        const index = state.employeesList.findIndex(emp => emp._id === updatedUser._id);
        if (index !== -1) {
          state.employeesList[index] = updatedUser;
        }
      })

      // أثناء التحميل
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
      })

    
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employeesList = state.employeesList.filter(
          (emp) => emp._id !== action.payload
        );
        state.searchResults = state.searchResults.filter(
          (emp) => emp._id !== action.payload
        );

     
        if (state.pagination.totalRecords > 0) {
          state.pagination.totalRecords -= 1;
        }

        state.loading = false;
      }).addCase(fetchHRs.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchHRs.fulfilled, (state, action) => {
  state.loading = false;

  const { users, pagination } = action.payload.data;

  state.employeesList = users || [];

  state.pagination = {
    currentPage: pagination.currentPage ?? 1,
    totalPages: pagination.totalPages ?? 1,
    totalRecords: pagination.totalRecords ?? 0,
    limit: pagination.limit ?? 5,
  };
})
.addCase(fetchHRs.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  },
});

export const { clearSearch, resetEmployeeDetail } = employeeSlice.actions;
export default employeeSlice.reducer;
