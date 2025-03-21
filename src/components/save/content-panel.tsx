"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Calendar, Mail, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IconButton } from "@sparrowengg/twigs-react";
import {
  getUserContent,
  deleteContent,
  ContentType,
  getContentTypes,
} from "@/app/lib/content";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Text, Input, Button as TwigsButton } from "@sparrowengg/twigs-react";
import { saveEventForSchedule, updateScheduledEvent } from "@/app/lib/schedule";

interface Content {
  id: number;
  name: string;
  content: string;
  content_type_id: number;
  created_at: string;
  updated_at: string;
  word_count?: number;
  schedules?: { publish_at: string }[];
}

interface ScheduleDetails {
  contentId: number;
  contentName: string;
  scheduledDate: string;
  scheduledTime: string;
}

interface ContentPanelProps {
  projectId: string | null;
  selectedContentId: string | null;
  onSelectContent: (id: string) => void;
  userId: string;
  onContentChange: () => void;
}

export function ContentPanel({
  projectId,
  selectedContentId,
  onSelectContent,
  userId,
  onContentChange,
}: ContentPanelProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduledContent, setScheduledContent] =
    useState<ScheduleDetails | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const types = await getContentTypes();
        setContentTypes(types);
      } catch (error) {
        console.error("Error fetching content types:", error);
        toast({
          title: "Error",
          description: "Failed to load content types",
          variant: "destructive",
        });
      }
    };

    fetchContentTypes();
  }, []);

  useEffect(() => {
    const loadContents = async () => {
      if (!projectId || !userId) return;
      try {
        setIsLoading(true);
        const result = await getUserContent(userId, projectId);
        setContents(result);
      } catch (error) {
        console.error("Error loading contents:", error);
        toast({
          title: "Error",
          description: "Failed to load contents",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContents();
  }, [projectId, userId]);

  const getContentTypeIcon = (typeId: number) => {
    switch (typeId) {
      case 1:
        return <FileText className="h-4 w-4" />;
      case 2:
        return <Calendar className="h-4 w-4" />;
      case 3:
        return <Mail className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeName = (typeId: number) => {
    const contentType = contentTypes.find((type) => type.id === typeId);
    return contentType ? contentType.type_name : "Unknown";
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await deleteContent(contentId, userId);
      setContents(
        contents.filter((content) => content.id.toString() !== contentId)
      );
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
      onContentChange();
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  const handleScheduleContent = (content: Content) => {
    let formattedDate = format(new Date(), "yyyy-MM-dd");
    let formattedTime = format(new Date(), "HH:mm");

    // Use existing schedule if available
    if (content.schedules && content.schedules.length > 0) {
      const scheduleDate = new Date(content.schedules[0].publish_at);
      formattedDate = format(scheduleDate, "yyyy-MM-dd");
      formattedTime = format(scheduleDate, "HH:mm");
    }

    setScheduledContent({
      contentId: content.id,
      contentName: content.name,
      scheduledDate: formattedDate,
      scheduledTime: formattedTime,
    });
    setIsScheduleDialogOpen(true);
  };

  const handleSaveSchedule = async () => {
    if (!scheduledContent) return;

    try {
      const payload = {
        content_id: scheduledContent.contentId,
        user_id: userId,
        publish_at: `${scheduledContent.scheduledDate}T${scheduledContent.scheduledTime}:00Z`,
      };

      // Find the content to check if it already has a schedule
      const contentToSchedule = contents.find(
        (content) => content.id === scheduledContent.contentId
      );

      let response;

      if (
        contentToSchedule?.schedules &&
        contentToSchedule.schedules.length > 0
      ) {
        // Update existing schedule
        response = await updateScheduledEvent(
          contentToSchedule.schedules[0]?.id,
          payload
        );
      } else {
        // Create new schedule
        response = await saveEventForSchedule(payload);
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: contentToSchedule?.schedules?.length
            ? "Schedule updated successfully"
            : "Content scheduled successfully",
        });
        if (projectId) {
          const result = await getUserContent(userId, projectId);
          setContents(result);
        }

        onContentChange();
      } else {
        toast({
          title: "Error",
          description: contentToSchedule?.schedules?.length
            ? "Failed to update schedule"
            : "Failed to schedule content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scheduling content:", error);
      toast({
        title: "Error",
        description: "Failed to schedule content",
        variant: "destructive",
      });
    } finally {
      setIsScheduleDialogOpen(false);
    }
  };

  const filteredContents = contents.filter((content) =>
    content.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(filteredContents);

  return (
    <div className="w-96 border-r flex flex-col">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="h-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="w-full p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-3 w-24 mt-2" />
                <Skeleton className="h-3 w-40 mt-2" />
                <Skeleton className="h-3 w-16 mt-2" />
              </div>
            ))}
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="p-4 space-y-2">
            <p className="text-muted-foreground">No content found</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredContents.map((content) => (
              <div
                style={{
                  background:
                    selectedContentId === content.id.toString()
                      ? "#E6F5F6"
                      : "transparent",
                }}
                key={content.id}
                className={`w-full text-left p-3 rounded-lg transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onSelectContent(content.id.toString())}
                    className="font-medium hover:underline flex items-center gap-2"
                  >
                    {getContentTypeIcon(content.content_type_id)}
                    <span>{content.name}</span>
                  </button>
                  {content?.schedules?.[0]?.publish_at && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                      {format(
                        new Date(content.schedules[0].publish_at),
                        "MMM d, h:mm a"
                      )}
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <IconButton
                        color="secondary"
                        variant="ghost"
                        icon={<Edit className="h-4 w-4" />}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleScheduleContent(content)}
                      >
                        {content.schedules && content.schedules.length > 0
                          ? "Edit Schedule"
                          : "Schedule"}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onSelectContent(content.id.toString())}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleDeleteContent(content.id.toString())
                        }
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getContentTypeName(content.content_type_id)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Updated{" "}
                  {formatDistanceToNow(new Date(content.updated_at), {
                    addSuffix: true,
                  })}
                </div>
                {content.word_count && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {content.word_count} words
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold">
              Schedule Content
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 space-y-6">
            <div className="grid gap-4">
              <div>
                <Text size="lg" css={{ fontWeight: "$6" }}>
                  Content Name
                </Text>
                <Text>{scheduledContent?.contentName}</Text>
              </div>

              <div>
                <Text size="lg" css={{ fontWeight: "$6" }}>
                  Schedule Date
                </Text>
                <Input
                  type="date"
                  value={scheduledContent?.scheduledDate}
                  min={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setScheduledContent((prev) =>
                      prev ? { ...prev, scheduledDate: e.target.value } : null
                    )
                  }
                  className="h-9 mb-4"
                />
              </div>

              <div>
                <Text size="lg" css={{ fontWeight: "$6" }}>
                  Schedule Time
                </Text>
                <Input
                  type="time"
                  value={scheduledContent?.scheduledTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setScheduledContent((prev) =>
                      prev ? { ...prev, scheduledTime: e.target.value } : null
                    )
                  }
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <TwigsButton
              variant="outline"
              size="md"
              color="error"
              onClick={() => setIsScheduleDialogOpen(false)}
              className="hover:bg-gray-100 transition-colors"
            >
              Cancel
            </TwigsButton>
            <TwigsButton
              size="md"
              variant="outline"
              onClick={handleSaveSchedule}
              className="hover:bg-primary/90 transition-colors"
            >
              Schedule
            </TwigsButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
