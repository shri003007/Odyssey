// Store
export * from './store';

// Hooks
export * from './hooks';

// Export all from slices
export {
  // User slice
  setUserLoading,
  setUserError,
  setUser,
  logoutUser,
  updateUserProfile,
} from './slices/userSlice';
export type { User } from './slices/userSlice';

export {
  // Profiles slice
  setProfilesLoading,
  setProfilesError,
  setProfiles,
  setCurrentProfile,
  addProfile,
  updateProfile,
  deleteProfile,
} from './slices/profilesSlice';
export type { Profile } from './slices/profilesSlice';

export {
  // Projects slice
  setProjectsLoading,
  setProjectsError,
  setProjects,
  setCurrentProject,
  addProject,
  updateProject,
  deleteProject,
  filterProjectsByProfile,
} from './slices/projectsSlice';
export type { Project } from './slices/projectsSlice';

// Selectors
export * from './selectors/userSelectors';
export * from './selectors/profilesSelectors';
export * from './selectors/projectsSelectors';

// Provider
export * from './ClientProvider'; 