interface UserData {
    email: string;
    google_id: string;
    name: string;
    profile_image?: string;
  }
  
  interface UserResponse {
    id: number;
    name: string;
    email: string;
    profile_image: string | null;
    recent_login: string;
    google_id: string;
    joined_at: string;
  }
  
  interface ApiResponse {
    status: string;
    data: UserResponse;
  }
  
  export async function createOrUpdateUser(userData: UserData): Promise<UserResponse | null> {
    const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL;
    
    if (!userServiceUrl) {
      throw new Error('User service URL is not defined in environment variables');
    }
  
    try {
      console.log('Checking if user exists:', userData.google_id);
      
      // First, check if the user exists
      const checkResponse = await fetch(`${userServiceUrl}/users/${userData.google_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
      });
  
      if (checkResponse.ok) {
        // User exists, update the user
        console.log('User exists, updating:', userData.google_id);
        const updateResponse = await fetch(`${userServiceUrl}/users/${userData.google_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
          },
          body: JSON.stringify(userData),
        });
  
        if (!updateResponse.ok) {
          throw new Error('Failed to update user');
        }
  
        const updateResult: ApiResponse = await updateResponse.json();
        console.log('User updated:', updateResult);
        return updateResult.data;
      } else if (checkResponse.status === 404) {
        // User doesn't exist, create a new user
        console.log('User does not exist, creating new user:', userData.google_id);
        const createResponse = await fetch(`${userServiceUrl}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
          },
          body: JSON.stringify(userData),
        });
  
        if (!createResponse.ok) {
          throw new Error('Failed to create user');
        }
  
        const createResult: ApiResponse = await createResponse.json();
        console.log('New user created:', createResult);
        return createResult.data;
      } else {
        throw new Error(`Unexpected response when checking user: ${checkResponse.status}`);
      }
    } catch (error) {
      console.error('Error creating or updating user:', error);
      return null;
    }
  }
  
  