import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import profileService from '../../api/profile';

// Create entity adapters for normalized state
const connectionsAdapter = createEntityAdapter();
const experiencesAdapter = createEntityAdapter();
const educationAdapter = createEntityAdapter();
const skillsAdapter = createEntityAdapter();

// Initial state
const initialState = {
  // Profile data
  profile: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
  isFollowing: false,
  connectionStatus: 'none', // 'none', 'pending', 'connected', 'received'
  
  // Skills
  skills: {
    ...skillsAdapter.getInitialState(),
    loading: false,
    error: null,
    formData: {
      id: null,
      name: '',
      level: 0,
      category: '',
      isFeatured: false
    }
  },
  
  // Experiences
  experiences: {
    ...experiencesAdapter.getInitialState(),
    loading: false,
    error: null,
    formData: {
      id: null,
      title: '',
      company: '',
      location: '',
      description: '',
      startDate: null,
      endDate: null,
      isCurrent: false,
      companyLogo: ''
    }
  },
  
  // Education
  education: {
    ...educationAdapter.getInitialState(),
    loading: false,
    error: null,
    formData: {
      id: null,
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: null,
      endDate: null,
      isCurrent: false,
      description: '',
      activities: '',
      grade: ''
    }
  },
  
  // Connections
  connections: {
    ...connectionsAdapter.getInitialState(),
    total: 0,
    loading: false,
    error: null,
    searchQuery: '',
    currentFilter: 'all',
    page: 1,
    limit: 10
  },
  
  // Connection requests
  connectionRequests: {
    ...connectionsAdapter.getInitialState(),
    loading: false,
    error: null,
    incoming: [],
    outgoing: []
  },
  
  // Connection suggestions
  connectionSuggestions: {
    ...connectionsAdapter.getInitialState(),
    loading: false,
    error: null
  },
  
  // Activity feed
  activityFeed: {
    ids: [],
    entities: {},
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    limit: 10
  },
  
  // Form states
  forms: {
    about: {
      isEditing: false,
      isSubmitting: false,
      error: null
    },
    skills: {
      isEditing: false,
      isSubmitting: false,
      error: null
    },
    experience: {
      isEditing: false,
      isSubmitting: false,
      error: null
    },
    education: {
      isEditing: false,
      isSubmitting: false,
      error: null
    }
  }
};

// Helper function to handle async thunk state updates
const handleAsyncThunk = (builder, thunk, stateKey, dataKey = 'payload') => {
  builder
    .addCase(thunk.pending, (state) => {
      const path = stateKey.split('.');
      let current = state;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[`${path[path.length - 1]}Loading`] = true;
      current[`${path[path.length - 1]}Error`] = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      const path = stateKey.split('.');
      let current = state;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[`${path[path.length - 1]}Loading`] = false;
      current[path[path.length - 1]] = action[dataKey];
    })
    .addCase(thunk.rejected, (state, action) => {
      const path = stateKey.split('.');
      let current = state;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[`${path[path.length - 1]}Loading`] = false;
      current[`${path[path.length - 1]}Error`] = action.payload || 'An error occurred';
    });
};

// Async thunks
// Profile thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isCurrentUser = !userId || userId === state.auth.user?.id;
      
      const [profile, connectionStatus] = await Promise.all([
        profileService.getProfile(userId || state.auth.user?.id),
        isCurrentUser ? Promise.resolve('self') : profileService.getConnectionStatus(userId)
      ]);
      
      return { 
        profile,
        isFollowing: profile.isFollowing || false,
        connectionStatus: isCurrentUser ? 'self' : connectionStatus.status
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const updatedProfile = await profileService.updateProfile(userId, profileData);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'profile/uploadProfilePhoto',
  async (file, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const updatedProfile = await profileService.uploadProfilePhoto(userId, formData);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload profile photo');
    }
  }
);

export const uploadCoverPhoto = createAsyncThunk(
  'profile/uploadCoverPhoto',
  async (file, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const updatedProfile = await profileService.uploadCoverPhoto(userId, formData);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload cover photo');
    }
  }
);

// This declaration was causing a duplicate error - removed

// Second declaration of uploadProfilePhoto removed to prevent duplication

export const updateSkills = createAsyncThunk(
  'profile/updateSkills',
  async (skills, { rejectWithValue }) => {
    try {
      const data = await profileService.updateUserSkills(skills);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update skills');
    }
  }
);

// Skills thunks
export const fetchSkills = createAsyncThunk(
  'profile/fetchSkills',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const targetUserId = userId || state.auth.user?.id;
      
      if (!targetUserId) {
        throw new Error('User not authenticated');
      }
      
      const skills = await profileService.getUserSkills(targetUserId);
      return skills || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
    }
  }
);

export const addSkill = createAsyncThunk(
  'profile/addSkill',
  async (skillData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const newSkill = await profileService.addUserSkill(userId, skillData);
      return newSkill;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add skill');
    }
  }
);

export const updateSkill = createAsyncThunk(
  'profile/updateSkill',
  async ({ id, ...skillData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const updatedSkill = await profileService.updateUserSkill(id, skillData);
      return updatedSkill;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update skill');
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'profile/deleteSkill',
  async (skillId, { rejectWithValue }) => {
    try {
      await profileService.deleteUserSkill(skillId);
      return skillId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete skill');
    }
  }
);

// Experience thunks
export const fetchExperiences = createAsyncThunk(
  'profile/fetchExperiences',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const targetUserId = userId || state.auth.user?.id;
      
      if (!targetUserId) {
        throw new Error('User not authenticated');
      }
      
      const experiences = await profileService.getExperiences(targetUserId);
      return experiences || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch experiences');
    }
  }
);

export const addExperience = createAsyncThunk(
  'profile/addExperience',
  async (experienceData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const newExperience = await profileService.addExperience(userId, experienceData);
      return newExperience;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add experience');
    }
  }
);

export const updateExperience = createAsyncThunk(
  'profile/updateExperience',
  async ({ id, ...experienceData }, { rejectWithValue }) => {
    try {
      const updatedExperience = await profileService.updateExperience(id, experienceData);
      return updatedExperience;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update experience');
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'profile/deleteExperience',
  async (experienceId, { rejectWithValue }) => {
    try {
      await profileService.deleteExperience(experienceId);
      return experienceId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete experience');
    }
  }
);

// Education thunks
export const fetchEducation = createAsyncThunk(
  'profile/fetchEducation',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const targetUserId = userId || state.auth.user?.id;
      
      if (!targetUserId) {
        throw new Error('User not authenticated');
      }
      
      const education = await profileService.getEducation(targetUserId);
      return education || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch education');
    }
  }
);

export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async (educationData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const newEducation = await profileService.addEducation(userId, educationData);
      return newEducation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add education');
    }
  }
);

export const updateEducation = createAsyncThunk(
  'profile/updateEducation',
  async ({ id, ...educationData }, { rejectWithValue }) => {
    try {
      const updatedEducation = await profileService.updateEducation(id, educationData);
      return updatedEducation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update education');
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'profile/deleteEducation',
  async (educationId, { rejectWithValue }) => {
    try {
      await profileService.deleteEducation(educationId);
      return educationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete education');
    }
  }
);

// Connections thunks
export const fetchConnections = createAsyncThunk(
  'profile/fetchConnections',
  async (params, { rejectWithValue, getState }) => {
    try {
      const { page = 1, limit = 10, search = '', filter = 'all' } = params || {};
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { connections, total } = await profileService.getConnections({
        page,
        limit,
        search,
        status: filter === 'all' ? undefined : filter
      });
      
      return { connections, total, page, limit, search, filter };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch connections');
    }
  }
);

export const fetchConnectionRequests = createAsyncThunk(
  'profile/fetchConnectionRequests',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { incoming, outgoing } = await profileService.getConnectionRequests();
      return { incoming, outgoing };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch connection requests');
    }
  }
);

export const fetchConnectionSuggestions = createAsyncThunk(
  'profile/fetchConnectionSuggestions',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const suggestions = await profileService.getConnectionSuggestions();
      return suggestions;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch connection suggestions');
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'profile/sendConnectionRequest',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const currentUserId = auth.user?.id;
      
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }
      
      const request = await profileService.sendConnectionRequest(userId);
      return { request, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send connection request');
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  'profile/acceptConnectionRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const connection = await profileService.acceptConnectionRequest(requestId);
      return { requestId, connection };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to reject connection request');
    }
  }
);

export const removeConnection = createAsyncThunk(
  'profile/removeConnection',
  async (userId, { rejectWithValue }) => {
    try {
      await profileService.removeConnection(userId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove connection');
    }
  }
);

// Second declarations of experience thunks removed to prevent duplication

// Second declarations of education thunks removed to prevent duplication

// Activity Feed
export const fetchActivityFeed = createAsyncThunk(
  'profile/fetchActivityFeed',
  async (params, { rejectWithValue }) => {
    try {
      const data = await profileService.getActivityFeed(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch activity feed');
    }
  }
);

// Second declaration of fetchConnectionSuggestions removed to prevent duplication

// Reject Connection Request thunk
export const rejectConnectionRequest = createAsyncThunk(
  'profile/rejectConnectionRequest',
  async (requestId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      await profileService.rejectConnectionRequest(requestId);
      return { requestId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject connection request');
    }
  }
);

// Follow User thunk
export const followUser = createAsyncThunk(
  'profile/followUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const currentUserId = auth.user?.id;
      
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }
      
      await profileService.followUser(userId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

// Unfollow User thunk
export const unfollowUser = createAsyncThunk(
  'profile/unfollowUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const currentUserId = auth.user?.id;
      
      if (!currentUserId) {
        throw new Error('User not authenticated');
      }
      
      await profileService.unfollowUser(userId);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

// removeConnection is defined above
// No need to redefine it here

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Clear all errors in the profile state
    clearProfileError: (state) => {
      state.error = null;
      state.updateError = null;
      state.skills.error = null;
      state.experiences.error = null;
      state.education.error = null;
      state.connections.error = null;
      state.connectionRequests.error = null;
      state.connectionSuggestions.error = null;
      state.activityFeed.error = null;
      
      // Clear form errors
      state.forms.about.error = null;
      state.forms.skills.error = null;
      state.forms.experience.error = null;
      state.forms.education.error = null;
    },
    
    // Form state management
    setFormEditing: (state, action) => {
      const { form, isEditing } = action.payload;
      if (state.forms[form]) {
        state.forms[form].isEditing = isEditing;
      }
    },
    
    // Connections state management
    setConnectionsSearchQuery: (state, action) => {
      state.connections.searchQuery = action.payload;
    },
    setConnectionsFilter: (state, action) => {
      state.connections.currentFilter = action.payload;
      state.connections.page = 1; // Reset to first page when filter changes
    },
    setConnectionsPage: (state, action) => {
      state.connections.page = action.payload;
    },
    
    // Form data management
    setSkillFormData: (state, action) => {
      state.skills.formData = { ...state.skills.formData, ...action.payload };
    },
    resetSkillForm: (state) => {
      state.skills.formData = initialState.skills.formData;
    },
    
    setExperienceFormData: (state, action) => {
      state.experiences.formData = { ...state.experiences.formData, ...action.payload };
    },
    resetExperienceForm: (state) => {
      state.experiences.formData = initialState.experiences.formData;
    },
    
    setEducationFormData: (state, action) => {
      state.education.formData = { ...state.education.formData, ...action.payload };
    },
    resetEducationForm: (state) => {
      state.education.formData = initialState.education.formData;
    },
    
    // Reset entire profile state
    resetProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    // Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.isFollowing = action.payload.isFollowing;
        state.connectionStatus = action.payload.connectionStatus;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })
      
      // Upload Profile Photo
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })
      
      // Upload Cover Photo
      .addCase(uploadCoverPhoto.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(uploadCoverPhoto.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(uploadCoverPhoto.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })
      
      // Skills
      .addCase(fetchSkills.pending, (state) => {
        state.skills.loading = true;
        state.skills.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills.loading = false;
        state.skills.ids = action.payload.map(skill => skill.id);
        state.skills.entities = action.payload.reduce((acc, skill) => {
          acc[skill.id] = skill;
          return acc;
        }, {});
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.skills.loading = false;
        state.skills.error = action.payload;
      })
      .addCase(addSkill.pending, (state) => {
        state.forms.skills.isSubmitting = true;
        state.forms.skills.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.forms.skills.isSubmitting = false;
        state.forms.skills.isEditing = false;
        state.skills.ids.push(action.payload.id);
        state.skills.entities[action.payload.id] = action.payload;
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.forms.skills.isSubmitting = false;
        state.forms.skills.error = action.payload;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.skills.entities[action.payload.id] = action.payload;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills.ids = state.skills.ids.filter(id => id !== action.payload);
        delete state.skills.entities[action.payload];
      })
      
      // Experiences
      .addCase(fetchExperiences.pending, (state) => {
        state.experiences.loading = true;
        state.experiences.error = null;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.experiences.loading = false;
        state.experiences.ids = action.payload.map(exp => exp.id);
        state.experiences.entities = action.payload.reduce((acc, exp) => {
          acc[exp.id] = exp;
          return acc;
        }, {});
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.experiences.loading = false;
        state.experiences.error = action.payload;
      })
      .addCase(addExperience.pending, (state) => {
        state.forms.experience.isSubmitting = true;
        state.forms.experience.error = null;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.forms.experience.isSubmitting = false;
        state.forms.experience.isEditing = false;
        state.experiences.ids.push(action.payload.id);
        state.experiences.entities[action.payload.id] = action.payload;
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.forms.experience.isSubmitting = false;
        state.forms.experience.error = action.payload;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.experiences.entities[action.payload.id] = action.payload;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences.ids = state.experiences.ids.filter(id => id !== action.payload);
        delete state.experiences.entities[action.payload];
      })
      
      // Education
      .addCase(fetchEducation.pending, (state) => {
        state.education.loading = true;
        state.education.error = null;
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.education.loading = false;
        state.education.ids = action.payload.map(edu => edu.id);
        state.education.entities = action.payload.reduce((acc, edu) => {
          acc[edu.id] = edu;
          return acc;
        }, {});
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.education.loading = false;
        state.education.error = action.payload;
      })
      .addCase(addEducation.pending, (state) => {
        state.forms.education.isSubmitting = true;
        state.forms.education.error = null;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.forms.education.isSubmitting = false;
        state.forms.education.isEditing = false;
        state.education.ids.push(action.payload.id);
        state.education.entities[action.payload.id] = action.payload;
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.forms.education.isSubmitting = false;
        state.forms.education.error = action.payload;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.education.entities[action.payload.id] = action.payload;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.education.ids = state.education.ids.filter(id => id !== action.payload);
        delete state.education.entities[action.payload];
      })
      
      // Connections
      .addCase(fetchConnections.pending, (state) => {
        state.connections.loading = true;
        state.connections.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        const { connections, total, page, search, filter } = action.payload;
        state.connections.loading = false;
        state.connections.ids = connections.map(conn => conn.id);
        state.connections.entities = connections.reduce((acc, conn) => {
          acc[conn.id] = conn;
          return acc;
        }, {});
        state.connections.total = total;
        state.connections.page = page;
        state.connections.searchQuery = search;
        state.connections.currentFilter = filter;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.connections.loading = false;
        state.connections.error = action.payload;
      })
      
      // Connection Requests
      .addCase(fetchConnectionRequests.pending, (state) => {
        state.connectionRequests.loading = true;
        state.connectionRequests.error = null;
      })
      .addCase(fetchConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests.loading = false;
        state.connectionRequests.incoming = action.payload.incoming;
        state.connectionRequests.outgoing = action.payload.outgoing;
      })
      .addCase(fetchConnectionRequests.rejected, (state, action) => {
        state.connectionRequests.loading = false;
        state.connectionRequests.error = action.payload;
      })
      
      // Connection Suggestions
      .addCase(fetchConnectionSuggestions.pending, (state) => {
        state.connectionSuggestions.loading = true;
        state.connectionSuggestions.error = null;
      })
      .addCase(fetchConnectionSuggestions.fulfilled, (state, action) => {
        state.connectionSuggestions.loading = false;
        state.connectionSuggestions.ids = action.payload.map(user => user.id);
        state.connectionSuggestions.entities = action.payload.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      })
      .addCase(fetchConnectionSuggestions.rejected, (state, action) => {
        state.connectionSuggestions.loading = false;
        state.connectionSuggestions.error = action.payload;
      })
      
      // Send Connection Request
      .addCase(sendConnectionRequest.pending, (state, action) => {
        const userId = action.meta.arg;
        state.connectionStatus = 'pending';
        state.connectionRequests.outgoing.push({
          id: `temp-${Date.now()}`,
          toUser: userId,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        const { request, userId } = action.payload;
        // Replace temporary request with actual request
        state.connectionRequests.outgoing = state.connectionRequests.outgoing.map(req => 
          req.toUser === userId && !req.id.startsWith('temp-') ? request : req
        );
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.connectionStatus = 'none';
        state.connectionRequests.outgoing = state.connectionRequests.outgoing.filter(
          req => !(req.toUser === userId && req.id.startsWith('temp-'))
        );
      })
      
      // Accept Connection Request
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        const { requestId, connection } = action.payload;
        // Remove from incoming requests
        state.connectionRequests.incoming = state.connectionRequests.incoming.filter(
          req => req.id !== requestId
        );
        // Add to connections
        state.connections.ids.push(connection.id);
        state.connections.entities[connection.id] = connection;
        state.connections.total += 1;
        // Update connection status
        state.connectionStatus = 'connected';
      })
      
      // Reject Connection Request
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        // Remove from incoming requests
        state.connectionRequests.incoming = state.connectionRequests.incoming.filter(
          req => req.id !== requestId
        );
      })
      
      // Remove Connection
      .addCase(removeConnection.fulfilled, (state, action) => {
        const { connectionId } = action.payload;
        // Remove from connections
        state.connections.ids = state.connections.ids.filter(id => id !== connectionId);
        delete state.connections.entities[connectionId];
        state.connections.total = Math.max(0, state.connections.total - 1);
        // Update connection status
        state.connectionStatus = 'none';
      })
      
      // Follow User
      .addCase(followUser.fulfilled, (state) => {
        state.isFollowing = true;
      })
      
      // Unfollow User
      .addCase(unfollowUser.fulfilled, (state) => {
        state.isFollowing = false;
      });
  }
});

// Export all the actions
export const { 
  clearProfileError,
  setFormEditing,
  setConnectionsSearchQuery,
  setConnectionsFilter,
  setConnectionsPage,
  setSkillFormData,
  resetSkillForm,
  setExperienceFormData,
  resetExperienceForm,
  setEducationFormData,
  resetEducationForm,
  resetProfileState 
} = profileSlice.actions;

// Export selectors
export const selectProfile = (state) => state.profile.profile;
export const selectIsProfileLoading = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;
export const selectIsUpdatingProfile = (state) => state.profile.updating;
export const selectProfileUpdateError = (state) => state.profile.updateError;
export const selectIsFollowing = (state) => state.profile.isFollowing;
export const selectConnectionStatus = (state) => state.profile.connectionStatus;

// Skills selectors
export const {
  selectAll: selectAllSkills,
  selectById: selectSkillById,
  selectIds: selectSkillIds
} = skillsAdapter.getSelectors((state) => state.profile.skills);

export const selectSkillsLoading = (state) => state.profile.skills.loading;
export const selectSkillsError = (state) => state.profile.skills.error;
export const selectSkillFormData = (state) => state.profile.skills.formData;

// Experiences selectors
export const {
  selectAll: selectAllExperiences,
  selectById: selectExperienceById,
  selectIds: selectExperienceIds
} = experiencesAdapter.getSelectors((state) => state.profile.experiences);

export const selectExperiencesLoading = (state) => state.profile.experiences.loading;
export const selectExperiencesError = (state) => state.profile.experiences.error;
export const selectExperienceFormData = (state) => state.profile.experiences.formData;

// Education selectors
export const {
  selectAll: selectAllEducation,
  selectById: selectEducationById,
  selectIds: selectEducationIds
} = educationAdapter.getSelectors((state) => state.profile.education);

export const selectEducationLoading = (state) => state.profile.education.loading;
export const selectEducationError = (state) => state.profile.education.error;
export const selectEducationFormData = (state) => state.profile.education.formData;

// Connections selectors
export const {
  selectAll: selectAllConnections,
  selectById: selectConnectionById,
  selectIds: selectConnectionIds
} = connectionsAdapter.getSelectors((state) => state.profile.connections);

export const selectConnectionsLoading = (state) => state.profile.connections.loading;
export const selectConnectionsError = (state) => state.profile.connections.error;
export const selectConnectionsSearchQuery = (state) => state.profile.connections.searchQuery;
export const selectConnectionsFilter = (state) => state.profile.connections.currentFilter;
export const selectConnectionsPagination = (state) => ({
  page: state.profile.connections.page,
  limit: state.profile.connections.limit,
  total: state.profile.connections.total
});

// Connection requests selectors
export const selectIncomingConnectionRequests = (state) => state.profile.connectionRequests.incoming;
export const selectOutgoingConnectionRequests = (state) => state.profile.connectionRequests.outgoing;
export const selectConnectionRequestsLoading = (state) => state.profile.connectionRequests.loading;
export const selectConnectionRequestsError = (state) => state.profile.connectionRequests.error;

// Connection suggestions selectors
export const selectAllConnectionSuggestions = (state) => {
  const { ids, entities } = state.profile.connectionSuggestions;
  return ids.map(id => entities[id]);
};
export const selectConnectionSuggestionsLoading = (state) => state.profile.connectionSuggestions.loading;
export const selectConnectionSuggestionsError = (state) => state.profile.connectionSuggestions.error;

// Form state selectors
export const selectFormState = (form) => (state) => state.profile.forms[form];

export default profileSlice.reducer;
