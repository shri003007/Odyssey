interface Content {
  id: number;
  name: string;
  content: string;
  user_id: string;
  content_type_id: number;
  project_id?: number;
  created_at: string;
  updated_at: string;
  content_types?: {
    icon: string | null;
    type_name: string;
  };
  projects?: {
    name: string;
  };
}

interface ApiResponse<T> {
  status: 'success';
  data: T;
}

export async function saveContent(data: {
  name: string;
  content: string;
  user_id: string;
  content_type_id: number;
  project_id?: number;
}): Promise<Content> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      throw new Error('Failed to save content');
    }
    const result: ApiResponse<Content> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
}

export async function getUserContent(userId: string, projectId?: string, page: number = 1, limit: number = 20): Promise<Content[]> {
  try {
    let url = `${process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL}/content/user/${userId}?page=${page}&limit=${limit}`;
    if (projectId) {
      url += `&project_id=${projectId}`;
    }
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user content');
    }
    const result: ApiResponse<Content[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching user content:', error);
    throw error;
  }
}

export async function getContentDetails(contentId: string, userId: string): Promise<Content> {
  try {
    console.log(`${process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL}/content/${contentId}/user/${userId}`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL}/content/${contentId}/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch content details');
    }
    const result: ApiResponse<Content> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching content details:', error);
    throw error;
  }
}

export async function updateContent(contentId: string, userId: string, data: {
  name?: string;
  content?: string;
  project_id?: number;
}): Promise<Content> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL}/content/${contentId}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update content');
    }
    const result: ApiResponse<Content> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}

export async function deleteContent(contentId: string, userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL}/content/${contentId}/user/${userId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

export async function searchContent(userId: string, query: string, contentTypeId?: string, projectId?: string): Promise<Content[]> {
  try {
    let url = `${process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL}/content/search?user_id=${userId}&query=${encodeURIComponent(query)}`;
    if (contentTypeId) {
      url += `&content_type_id=${contentTypeId}`;
    }
    if (projectId) {
      url += `&project_id=${projectId}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search content');
    }
    const result: ApiResponse<Content[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
}

export interface ContentType {
  id: number;
  type_name: string;
  description: string | null;
  icon: string | null;
}

export async function getContentTypes(): Promise<ContentType[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_TYPE_API}/content-types`);
    if (!response.ok) {
      throw new Error('Failed to fetch content types');
    }
    const result: ApiResponse<ContentType[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching content types:', error);
    throw error;
  }
}

export interface CreateContentTypeRequest {
type_name: string;
description: string;
icon?: string;
value: string;
profile_id: string;
}

export async function getProfileContentTypes(profileId: string): Promise<ContentType[]> {
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_TYPE_API}/content-types/profile/${profileId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch profile content types');
  }
  const result: ApiResponse<ContentType[]> = await response.json();
  return result.data;
} catch (error) {
  console.error('Error fetching profile content types:', error);
  throw error;
}
}

export async function createContentType(data: CreateContentTypeRequest): Promise<ContentType> {
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_TYPE_API}/content-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create content type');
  }
  
  const result: ApiResponse<ContentType> = await response.json();
  return result.data;
} catch (error) {
  console.error('Error creating content type:', error);
  throw error;
}
}

export async function updateContentType(
profileId: number,
contentTypeId: number,
data: {
  type_name?: string;
  description?: string;
  icon?: string;
  value?: string;
}
): Promise<ContentType> {
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_TYPE_API}/content-types/profile/${profileId}/type/${contentTypeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update content type');
  }
  const result: ApiResponse<ContentType> = await response.json();
  return result.data;
} catch (error) {
  console.error('Error updating content type:', error);
  throw error;
}
}

export async function deleteContentType(profileId: number, contentTypeId: number): Promise<void> {
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_TYPE_API}/content-types/profile/${profileId}/type/${contentTypeId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete content type');
  }
} catch (error) {
  console.error('Error deleting content type:', error);
  throw error;
}
}

