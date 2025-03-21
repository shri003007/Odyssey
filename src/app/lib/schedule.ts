interface ScheduledEventsResponse {
  status: "success";
  data: Array<{
    id: number;
    content_id: number;
    user_id: number;
    profile_id: number;
    publish_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    status: string;
    ran_at: string | null;
    content: {
      id: number;
      name: string;
      content: string;
      user_id: number;
      created_at: string;
      project_id: number;
      updated_at: string;
      content_type_id: number;
    };
    profiles: {
      id: number;
      user_id: number;
      created_at: string;
      is_default: boolean;
      updated_at: string;
      profile_name: string;
      profile_context: string;
    };
  }>;
}

// Interface for schedule event data
interface ScheduleEventData {
  content_id: number;
  profile_id: number;
  publish_at: string;
  user_id: number;
  [key: string]: unknown; // For any additional properties
}

export async function getAllScheduledEvents(
  userId: string | null,
  options?: {
    from?: string;
    to?: string;
    profile_id?: string;
    status?: string;
  }
): Promise<ScheduledEventsResponse> {
  const urlParams = new URLSearchParams();
  
  if (userId) urlParams.append("user_id", userId);
  if (options?.from) urlParams.append("from", options.from);
  if (options?.to) urlParams.append("to", options.to);
  if (options?.profile_id) urlParams.append("profile_id", options.profile_id);
  if (options?.status) urlParams.append("status", options.status);

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_SCHEDULE_SERVICE_URL
    }/schedule?${userId ? `user_id=${userId}` : ''}`
  );
  return response.json();
}

export const deleteScheduledEvent = async (
  scheduledEventId: string | number | undefined,
  userId: string
) => {
  if (!scheduledEventId) {
    throw new Error("scheduledEventId is required");
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SCHEDULE_SERVICE_URL}/schedule/${scheduledEventId}?user_id=${userId}`,
    {
      method: "DELETE",
    }
  );
  return response;
};

export const saveEventForSchedule = async (event: ScheduleEventData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SCHEDULE_SERVICE_URL}/schedule`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );
  return response;
};

export const updateScheduledEvent = async (scheduleId: number, event: ScheduleEventData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SCHEDULE_SERVICE_URL}/schedule/${scheduleId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );
  return response;
};
