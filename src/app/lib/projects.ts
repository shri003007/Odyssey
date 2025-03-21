interface Project {
    id: number;
    name: string;
    description?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  }
  
  interface ApiResponse<T> {
    status: 'success';
    data: T;
  }
  
  export async function getUserProjects(userId: string): Promise<Project[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_SERVICE_URL}/projects/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const result: ApiResponse<Project[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
  
  export async function createProject(data: { name: string; description?: string; user_id: string }): Promise<Project> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_SERVICE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const result: ApiResponse<Project> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
  
  export async function getProjectDetails(projectId: string, userId: string): Promise<Project> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_SERVICE_URL}/projects/${projectId}/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      const result: ApiResponse<Project> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching project details:', error);
      throw error;
    }
  }
  
  export async function updateProject(projectId: string, userId: string, data: { name?: string; description?: string }): Promise<Project> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_SERVICE_URL}/projects/${projectId}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      const result: ApiResponse<Project> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }
  
  export async function deleteProject(projectId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_SERVICE_URL}/projects/${projectId}/user/${userId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
  
  export async function searchProjects(userId: string, query: string): Promise<Project[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_SERVICE_URL}/projects/search?user_id=${userId}&query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search projects');
      }
      const result: ApiResponse<Project[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  }
  
  