'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { 
  setUser, 
  setUserLoading, 
  setProfiles, 
  setProfilesLoading, 
  setProfilesError,
  setProjects, 
  setProjectsLoading, 
  setProjectsError
} from '@/redux';
import { getProfiles } from '@/app/lib/profiles';
import { getUserProjects } from '@/app/lib/projects';
import { useAuth } from '@/context/auth-provider'; // Assuming this is the correct import path

interface DataFetcherProps {
  children: React.ReactNode;
}

export function DataFetcher({ children }: DataFetcherProps) {
  const dispatch = useAppDispatch();
  
  const { user, userId, isLoading: authLoading } = useAuth(); // Get user from auth context

  // Set user data from auth context to Redux
  useEffect(() => {
    if (authLoading) {
      dispatch(setUserLoading(true));
      return;
    }
    
    if (user) {
      // Format user data to match Redux User interface
      const userData = {
        id: userId || '',
        email: user.email || '',
        name: user.displayName || '',
        profilePicture: user.photoURL || undefined,
        isAuthenticated: true,
      };
      
      dispatch(setUser(userData));
    } else {
      dispatch(setUser(null));
    }
  }, [user, authLoading, dispatch]);

  // Fetch profiles data
  useEffect(() => {
    const fetchProfilesData = async () => {
      if (!userId) return;
      
      try {
        dispatch(setProfilesLoading(true));
        const profilesData = await getProfiles(userId);
        
        // Transform API profile format to Redux profile format
        const transformedProfiles = profilesData.map(profile => ({
          id: String(profile.id),
          name: profile.profile_name,
          description: profile.profile_context,
          targetAudience: '', // Not provided by API, add if needed
          socialMedia: {}, // Not provided by API, add if needed
          createdAt: profile.created_at,
          updatedAt: profile.created_at, // API doesn't seem to have updated_at for profiles
        }));
        
        dispatch(setProfiles(transformedProfiles));
      } catch (error) {
        console.error('Error fetching profiles data:', error);
        dispatch(setProfilesError(error instanceof Error ? error.message : 'An unknown error occurred'));
      }
    };

    fetchProfilesData();
  }, [userId, dispatch]);

  // Fetch projects data
  useEffect(() => {
    const fetchProjectsData = async () => {
      if (!userId) return;
      
      try {
        dispatch(setProjectsLoading(true));
        const projectsData = await getUserProjects(userId);
        
        // Transform API project format to Redux project format
        const transformedProjects = projectsData.map(project => ({
          id: String(project.id),
          name: project.name,
          description: project.description || '',
          profileId: '', // Not provided by API, add if needed
          status: 'active' as const, // Default status, adjust if API provides this
          createdAt: project.created_at,
          updatedAt: project.updated_at,
        }));
        
        dispatch(setProjects(transformedProjects));
      } catch (error) {
        console.error('Error fetching projects data:', error);
        dispatch(setProjectsError(error instanceof Error ? error.message : 'An unknown error occurred'));
      }
    };

    fetchProjectsData();
  }, [userId, dispatch]);

  return <>{children}</>;
}

export default DataFetcher; 