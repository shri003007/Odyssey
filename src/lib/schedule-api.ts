// Schedule Management API Service

export type ScheduleStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface Schedule {
  id: number;
  content_id: number;
  user_id: number;
  profile_id: number;
  publish_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  status: ScheduleStatus;
  ran_at?: string;
}

export interface CreateScheduleRequest {
  content_id: number;
  user_id: number;
  profile_id: number;
  publish_at: string;
  status?: ScheduleStatus;
}

export interface UpdateScheduleRequest {
  user_id: number; // Required for authentication
  profile_id?: number;
  publish_at?: string;
  status?: ScheduleStatus;
  ran_at?: string;
}

export interface GetSchedulesOptions {
  user_id: number;
  from?: string;
  to?: string;
  profile_id?: number;
  status?: ScheduleStatus | ScheduleStatus[];
}

// API base URL - should be configured from environment variables
const SCHEDULE_API_URL = process.env.NEXT_PUBLIC_SCHEDULE_SERVICE_URL || 'http://localhost:8000';

// Helper to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }
  return response.json();
};

// Schedule API services
export const scheduleApi = {
  // Health check
  async healthCheck(userId: number): Promise<{ status: string; message: string; mode: string }> {
    const response = await fetch(`${SCHEDULE_API_URL}/schedule-test?user_id=${userId}`);
    return handleResponse(response);
  },

  // Get schedules with optional filters
  async getSchedules(options: GetSchedulesOptions): Promise<{ status: string; data: Schedule[] }> {
    // Build query string from options
    const params = new URLSearchParams();
    if (options.user_id) params.append('user_id', options.user_id.toString());
    if (options.from) params.append('from', options.from);
    if (options.to) params.append('to', options.to);
    if (options.profile_id) params.append('profile_id', options.profile_id.toString());
    
    if (options.status) {
      if (Array.isArray(options.status)) {
        options.status.forEach(status => params.append('status', status));
      } else {
        params.append('status', options.status);
      }
    }
    
    const response = await fetch(`${SCHEDULE_API_URL}/schedule?${params.toString()}`);
    
    return handleResponse(response);
  },

  // Get a specific schedule by ID
  async getSchedule(scheduleId: number, userId: number): Promise<{ status: string; data: Schedule }> {
    const response = await fetch(`${SCHEDULE_API_URL}/schedule/${scheduleId}?user_id=${userId}`);
    
    return handleResponse(response);
  },

  // Create a new schedule
  async createSchedule(request: CreateScheduleRequest): Promise<{ status: string; data: Schedule }> {
    const response = await fetch(`${SCHEDULE_API_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    return handleResponse(response);
  },

  // Update an existing schedule
  async updateSchedule(scheduleId: number, request: UpdateScheduleRequest): Promise<{ status: string; data: Schedule }> {
    const response = await fetch(`${SCHEDULE_API_URL}/schedule/${scheduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    return handleResponse(response);
  },

  // Delete (soft-delete) a schedule
  async deleteSchedule(scheduleId: number, userId: number): Promise<{ status: string; message: string }> {
    const response = await fetch(`${SCHEDULE_API_URL}/schedule/${scheduleId}?user_id=${userId}`, {
      method: 'DELETE'
    });
    
    return handleResponse(response);
  }
}; 