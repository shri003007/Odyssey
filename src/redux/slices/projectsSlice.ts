import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  description: string;
  profileId: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  budget?: number;
  startDate?: string;
  endDate?: string;
  content?: {
    title?: string;
    body?: string;
    media?: string[];
  };
  metrics?: {
    views?: number;
    engagement?: number;
    conversions?: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjectsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProjectsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    },
    filterProjectsByProfile: (state, action: PayloadAction<string>) => {
      // This is just to demonstrate a more complex action
      // The actual filtering should happen in a selector
      state.projects = state.projects.filter(project => project.profileId === action.payload);
    },
  },
});

export const {
  setProjectsLoading,
  setProjectsError,
  setProjects,
  setCurrentProject,
  addProject,
  updateProject,
  deleteProject,
  filterProjectsByProfile,
} = projectsSlice.actions;

export default projectsSlice.reducer; 