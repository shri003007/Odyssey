import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Profile {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProfilesState {
  profiles: Profile[];
  currentProfile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfilesState = {
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null,
};

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setProfilesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfilesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentProfile: (state, action: PayloadAction<Profile | null>) => {
      state.currentProfile = action.payload;
    },
    addProfile: (state, action: PayloadAction<Profile>) => {
      state.profiles.push(action.payload);
    },
    updateProfile: (state, action: PayloadAction<Profile>) => {
      const index = state.profiles.findIndex(profile => profile.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
      }
    },
    deleteProfile: (state, action: PayloadAction<string>) => {
      state.profiles = state.profiles.filter(profile => profile.id !== action.payload);
      if (state.currentProfile?.id === action.payload) {
        state.currentProfile = null;
      }
    },
  },
});

export const {
  setProfilesLoading,
  setProfilesError,
  setProfiles,
  setCurrentProfile,
  addProfile,
  updateProfile,
  deleteProfile,
} = profilesSlice.actions;

export default profilesSlice.reducer; 