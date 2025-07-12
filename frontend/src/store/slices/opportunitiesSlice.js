import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import opportunitiesService from '../../api/opportunities';

// Initial state
const initialState = {
  // Opportunities lists
  jobs: [],
  courses: [],
  projects: [],
  recommended: [],
  
  // Current opportunity details
  currentOpportunity: null,
  
  // User applications/enrollments
  applications: [],
  
  // Loading states
  loading: {
    jobs: false,
    courses: false,
    projects: false,
    recommended: false,
    opportunity: false,
    applications: false,
    application: false
  },
  
  // Error states
  error: {
    jobs: null,
    courses: null,
    projects: null,
    recommended: null,
    opportunity: null,
    applications: null,
    application: null
  },
  
  // Pagination and filters
  pagination: {
    jobs: { page: 1, totalPages: 1, totalItems: 0 },
    courses: { page: 1, totalPages: 1, totalItems: 0 },
    projects: { page: 1, totalPages: 1, totalItems: 0 }
  },
  
  filters: {
    jobs: {},
    courses: {},
    projects: {}
  }
};

// Async thunks
export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchOpportunities',
  async ({ type, page = 1, filters = {} }, { rejectWithValue }) => {
    try {
      const data = await opportunitiesService.getOpportunities({ 
        ...filters, 
        page,
        type: type === 'all' ? undefined : type
      });
      return { type, data };
    } catch (error) {
      return rejectWithValue({ 
        type, 
        error: error.response?.data?.detail || 'Fırsatlar yüklenirken bir hata oluştu.' 
      });
    }
  }
);

export const fetchRecommendedOpportunities = createAsyncThunk(
  'opportunities/fetchRecommended',
  async (_, { rejectWithValue }) => {
    try {
      return await opportunitiesService.getRecommendedOpportunities();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Önerilen fırsatlar yüklenirken bir hata oluştu.'
      );
    }
  }
);

export const fetchOpportunityById = createAsyncThunk(
  'opportunities/fetchById',
  async ({ type, id }, { rejectWithValue }) => {
    try {
      return await opportunitiesService.getOpportunityById(type, id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Fırsat detayları yüklenirken bir hata oluştu.'
      );
    }
  }
);

export const applyForJob = createAsyncThunk(
  'opportunities/applyForJob',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      return await opportunitiesService.applyForJob(jobId, applicationData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Başvuru sırasında bir hata oluştu.'
      );
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'opportunities/enrollInCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      return await opportunitiesService.enrollInCourse(courseId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Kursa kayıt olunurken bir hata oluştu.'
      );
    }
  }
);

export const joinProject = createAsyncThunk(
  'opportunities/joinProject',
  async ({ projectId, joinData }, { rejectWithValue }) => {
    try {
      return await opportunitiesService.joinProject(projectId, joinData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Projeye katılırken bir hata oluştu.'
      );
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  'opportunities/fetchUserApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await opportunitiesService.getUserApplications();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || 'Başvurular yüklenirken bir hata oluştu.'
      );
    }
  }
);

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    clearCurrentOpportunity: (state) => {
      state.currentOpportunity = null;
      state.error.opportunity = null;
    },
    
    setFilters: (state, action) => {
      const { type, filters } = action.payload;
      state.filters[type] = { ...state.filters[type], ...filters };
    },
    
    clearError: (state, action) => {
      const { type } = action.payload;
      if (type) {
        state.error[type] = null;
      } else {
        // Clear all errors if no type specified
        Object.keys(state.error).forEach(key => {
          state.error[key] = null;
        });
      }
    },
    
    resetOpportunities: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch opportunities
    builder
      .addCase(fetchOpportunities.pending, (state, action) => {
        const { type } = action.meta.arg;
        state.loading[type] = true;
        state.error[type] = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state[type] = data.items || [];
        state.pagination[type] = {
          page: data.page || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || 0
        };
        state.loading[type] = false;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        const { type, error } = action.payload;
        state.error[type] = error;
        state.loading[type] = false;
      });
      
    // Fetch recommended opportunities
    builder
      .addCase(fetchRecommendedOpportunities.pending, (state) => {
        state.loading.recommended = true;
        state.error.recommended = null;
      })
      .addCase(fetchRecommendedOpportunities.fulfilled, (state, action) => {
        state.recommended = action.payload;
        state.loading.recommended = false;
      })
      .addCase(fetchRecommendedOpportunities.rejected, (state, action) => {
        state.error.recommended = action.payload;
        state.loading.recommended = false;
      });
      
    // Fetch opportunity by ID
    builder
      .addCase(fetchOpportunityById.pending, (state) => {
        state.loading.opportunity = true;
        state.error.opportunity = null;
      })
      .addCase(fetchOpportunityById.fulfilled, (state, action) => {
        state.currentOpportunity = action.payload;
        state.loading.opportunity = false;
      })
      .addCase(fetchOpportunityById.rejected, (state, action) => {
        state.error.opportunity = action.payload;
        state.loading.opportunity = false;
      });
      
    // Apply for job
    builder
      .addCase(applyForJob.pending, (state) => {
        state.loading.application = true;
        state.error.application = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        // Update current opportunity's application status
        if (state.currentOpportunity) {
          state.currentOpportunity.hasApplied = true;
        }
        // Add to applications list
        state.applications.push(action.payload);
        state.loading.application = false;
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.error.application = action.payload;
        state.loading.application = false;
      });
      
    // Enroll in course
    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.loading.application = true;
        state.error.application = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        // Update current opportunity's enrollment status
        if (state.currentOpportunity) {
          state.currentOpportunity.isEnrolled = true;
        }
        // Add to applications list
        state.applications.push(action.payload);
        state.loading.application = false;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.error.application = action.payload;
        state.loading.application = false;
      });
      
    // Join project
    builder
      .addCase(joinProject.pending, (state) => {
        state.loading.application = true;
        state.error.application = null;
      })
      .addCase(joinProject.fulfilled, (state, action) => {
        // Update current opportunity's participation status
        if (state.currentOpportunity) {
          state.currentOpportunity.hasJoined = true;
        }
        // Add to applications list
        state.applications.push(action.payload);
        state.loading.application = false;
      })
      .addCase(joinProject.rejected, (state, action) => {
        state.error.application = action.payload;
        state.loading.application = false;
      });
      
    // Fetch user applications
    builder
      .addCase(fetchUserApplications.pending, (state) => {
        state.loading.applications = true;
        state.error.applications = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
        state.loading.applications = false;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.error.applications = action.payload;
        state.loading.applications = false;
      });
  }
});

export const { 
  clearCurrentOpportunity, 
  setFilters, 
  clearError,
  resetOpportunities 
} = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;
