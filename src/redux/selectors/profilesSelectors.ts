import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Profile } from '../slices/profilesSlice';

export const selectProfilesState = (state: RootState) => state.profiles;

export const selectProfiles = createSelector(
  [selectProfilesState],
  (profilesState) => profilesState.profiles
);

export const selectCurrentProfile = createSelector(
  [selectProfilesState],
  (profilesState) => profilesState.currentProfile
);

export const selectProfilesLoading = createSelector(
  [selectProfilesState],
  (profilesState) => profilesState.loading
);

export const selectProfilesError = createSelector(
  [selectProfilesState],
  (profilesState) => profilesState.error
);

// Additional selector for getting a profile by ID
export const selectProfileById = (id: string) => 
  createSelector(
    [selectProfiles],
    (profiles) => profiles.find((profile: Profile) => profile.id === id) || null
  ); 