import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Project } from '../slices/projectsSlice';

export const selectProjectsState = (state: RootState) => state.projects;

export const selectProjects = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.projects
);

export const selectCurrentProject = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.currentProject
);

export const selectProjectsLoading = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.loading
);

export const selectProjectsError = createSelector(
  [selectProjectsState],
  (projectsState) => projectsState.error
);

// Select a project by its ID
export const selectProjectById = (id: string) => 
  createSelector(
    [selectProjects],
    (projects) => projects.find((project: Project) => project.id === id) || null
  );

// Get projects by profileId
export const selectProjectsByProfileId = (profileId: string) =>
  createSelector(
    [selectProjects],
    (projects) => projects.filter((project: Project) => project.profileId === profileId)
  );

// Get projects by status
export const selectProjectsByStatus = (status: Project['status']) =>
  createSelector(
    [selectProjects],
    (projects) => projects.filter((project: Project) => project.status === status)
  ); 