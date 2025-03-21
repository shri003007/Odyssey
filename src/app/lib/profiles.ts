export interface Profile {
  id: number;
  created_at: string;
  profile_name: string;
  profile_context: string;
  is_default: boolean;
}

export interface ContentType {
  id: number;
  type_name: string;
  description: string | null;
  icon: string | null;
  prompt_template?: string;
}

export interface ProfileContentType {
  id: string;
  profile_id: string;
  content_type_id: string;
  prompt_template: string;
  created_at: string;
  updated_at: string;
  content_types?: ContentType;
}

interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}

// Event schedule data interface
interface ScheduleEvent {
  user_id: string;
  profile_id: number;
  content_id: number;
  publish_at: string;
  status?: string;
}

// Existing profile management functions
export async function getProfiles(userId: string): Promise<Profile[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Profile fetch error:", errorData);
      throw new Error(
        `Failed to fetch profiles: ${response.status} ${response.statusText}`
      );
    }
    const result: ApiResponse<Profile[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
}


export const saveEventForSchedule = async (event: ScheduleEvent) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Error saving event for schedule:', error);
    throw error;
  }
}




export async function getProfile(id: number, userId: string): Promise<Profile | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}/user/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    const result: ApiResponse<Profile> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function createProfile(
  data: {
    profile_name: string;
    profile_context: string;
    is_default: boolean;
  },
  userId: string
): Promise<Profile | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, user_id: userId }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create profile");
    }
    const result: ApiResponse<Profile> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error creating profile:", error);
    return null;
  }
}

// New content type management functions
export async function addProfileContentTypes(
  profileId: number,
  contentTypes: Array<{
    content_type_id: number;
    prompt_template: string;
  }>
): Promise<ProfileContentType[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/content-types`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content_types: contentTypes }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add content types");
    }
    const result: ApiResponse<ProfileContentType[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error adding content types:", error);
    throw error;
  }
}

export async function updateProfileContentType(
  profileId: number,
  contentTypeId: number,
  promptTemplate: string
): Promise<ProfileContentType> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/content-types/${contentTypeId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt_template: promptTemplate }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update content type");
    }
    const result: ApiResponse<ProfileContentType> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error updating content type:", error);
    throw error;
  }
}

export async function batchUpdateProfileContentTypes(
  profileId: number,
  contentTypes: Array<{
    content_type_id: number;
    prompt_template: string;
  }>
): Promise<ProfileContentType[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/content-types/batch`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content_types: contentTypes }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to batch update content types");
    }
    const result: ApiResponse<ProfileContentType[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error batch updating content types:", error);
    throw error;
  }
}

//Removed deleteProfileContentType function

interface ContentTypeTemplate {
  id?: string;
  profile_id: string;
  content_type_id: string;
  prompt_template: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
  content_types?: {
    type_name: string;
  };
}

export async function getContentTypeTemplate(
  profileId: number,
  contentTypeId: number
): Promise<ContentTypeTemplate> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/content-types/${contentTypeId}/template`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch template");
    }
    const result: ApiResponse<ContentTypeTemplate> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw error;
  }
}

// Existing profile management functions (continued)
export async function updateProfile(
  id: number,
  data: {
    profile_name?: string;
    profile_context?: string;
    is_default?: boolean;
  },
  userId: string
): Promise<Profile | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}/user/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update profile");
    }
    const result: ApiResponse<Profile> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
}

export async function deleteProfile(
  id: number,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${id}/user/${userId}`,
      {
        method: "DELETE",
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Error deleting profile:", error);
    return false;
  }
}

export async function getDefaultProfile(
  userId: string
): Promise<Profile | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/default/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch default profile");
    }
    const result: ApiResponse<Profile> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching default profile:", error);
    return null;
  }
}

export async function addProfileContentType(
  profileId: number,
  contentTypeId: number,
  promptTemplate: string
): Promise<ProfileContentType> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/content-types`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_types: [
            {
              content_type_id: contentTypeId,
              prompt_template: promptTemplate,
            },
          ],
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add content type");
    }
    const result: ApiResponse<ProfileContentType> = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error adding content type:", error);
    throw error;
  }
}
