import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  scheduleApi, 
  Schedule, 
  ScheduleStatus, 
  CreateScheduleRequest 
} from "@/lib/schedule-api";
import { useToast } from "@/components/ui/use-toast";
import { addHours, formatISO } from "date-fns";
import { Loader2 } from "lucide-react";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: number;
  userId: number;
  onScheduleCreated?: (schedule: Schedule) => void;
  initialSchedule?: Schedule; // For editing existing schedules
}

interface Profile {
  id: number;
  profile_name: string;
  platform: string;
}

// Define a type for API response profile
interface ApiProfile {
  id: number;
  profile_name: string;
  profile_context?: string;
  platform?: string;
  user_id: number;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function ScheduleDialog({
  open,
  onOpenChange,
  contentId,
  userId,
  onScheduleCreated,
  initialSchedule,
}: ScheduleDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: 1, profile_name: "Personal Twitter", platform: "twitter" },
    { id: 2, profile_name: "Company LinkedIn", platform: "linkedin" },
    { id: 3, profile_name: "Instagram Business", platform: "instagram" },
  ]);
  
  // Default publish time to 1 hour from now
  const defaultPublishDate = formatISO(addHours(new Date(), 1)).slice(0, 16);
  
  const [formData, setFormData] = useState<{
    profileId: number | null;
    publishAt: string;
    status: ScheduleStatus;
  }>({
    profileId: null,
    publishAt: defaultPublishDate,
    status: "pending",
  });

  // Load initial schedule data if editing
  useEffect(() => {
    if (initialSchedule) {
      setFormData({
        profileId: initialSchedule.profile_id,
        publishAt: initialSchedule.publish_at.slice(0, 16), // Format for datetime-local input
        status: initialSchedule.status,
      });
    } else {
      // Reset to defaults when creating a new schedule
      setFormData({
        profileId: null,
        publishAt: defaultPublishDate,
        status: "pending",
      });
    }
  }, [initialSchedule, open]);

  // Add a useEffect hook to fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      if (userId) {
        try {
          // Fetch profiles from API (assuming the endpoint URL)
          const response = await fetch(`${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profiles/user/${userId}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success' && Array.isArray(data.data)) {
              // Convert the profile data to the format we need
              const fetchedProfiles = data.data.map((profile: ApiProfile) => ({
                id: profile.id,
                profile_name: profile.profile_name,
                platform: profile.platform || 'unknown'
              }));
              
              setProfiles(fetchedProfiles);
            }
          }
        } catch (error) {
          console.error('Failed to fetch profiles:', error);
          // Fall back to mock data if there's an error
        }
      }
    };

    fetchProfiles();
  }, [userId, open]);

  const handleProfileChange = (value: string) => {
    setFormData({ ...formData, profileId: parseInt(value) });
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, publishAt: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value as ScheduleStatus });
  };

  const handleSubmit = async () => {
    if (!formData.profileId) {
      toast({
        title: "Error",
        description: "Please select a profile",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Format the datetime properly for API
      const publishAt = new Date(formData.publishAt).toISOString();
      
      if (initialSchedule) {
        // Update existing schedule
        const updateData = {
          user_id: userId,
          profile_id: formData.profileId,
          publish_at: publishAt,
          status: formData.status,
        };
        
        const result = await scheduleApi.updateSchedule(initialSchedule.id, updateData);
        toast({
          title: "Schedule updated",
          description: "Your content has been rescheduled successfully.",
        });
        
        if (onScheduleCreated) {
          onScheduleCreated(result.data);
        }
      } else {
        // Create new schedule
        const scheduleData: CreateScheduleRequest = {
          content_id: contentId,
          user_id: userId,
          profile_id: formData.profileId,
          publish_at: publishAt,
          status: formData.status,
        };
        
        const result = await scheduleApi.createSchedule(scheduleData);
        toast({
          title: "Content scheduled",
          description: "Your content has been scheduled successfully.",
        });
        
        if (onScheduleCreated) {
          onScheduleCreated(result.data);
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error scheduling content:", error);
      toast({
        title: "Error",
        description: "Failed to schedule content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialSchedule ? "Edit Schedule" : "Schedule Content"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="profile" className="text-right text-sm font-medium">
              Profile
            </label>
            <Select
              value={formData.profileId?.toString() || ""}
              onValueChange={handleProfileChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id.toString()}>
                    {profile.profile_name} ({profile.platform})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="datetime" className="text-right text-sm font-medium">
              Date & Time
            </label>
            <Input
              id="datetime"
              type="datetime-local"
              value={formData.publishAt}
              onChange={handleDateTimeChange}
              className="col-span-3"
              min={formatISO(new Date()).slice(0, 16)}
            />
          </div>

          {initialSchedule && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right text-sm font-medium">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialSchedule ? "Save Changes" : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 