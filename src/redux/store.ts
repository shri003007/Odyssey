import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import profilesReducer from './slices/profilesSlice';
import projectsReducer from './slices/projectsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    profiles: profilesReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 