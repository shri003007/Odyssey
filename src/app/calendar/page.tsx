/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isToday,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List,
  Search,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Content, useContentContext } from "@/context/content-provider";
import {
  Box,
  Flex,
  IconButton,
  Heading,
  Text,
  Button,
  FormInput,
} from "@sparrowengg/twigs-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  deleteScheduledEvent,
  getAllScheduledEvents,
  updateScheduledEvent,
} from "../lib/schedule";
import { useAuth } from "@/context/auth-provider";
import { useToast } from "@/hooks/use-toast";

// API Response interface
interface ScheduledEventResponse {
  id: number;
  content_id: number;
  user_id: number;
  profile_id: number | null;
  publish_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  status: string;
  ran_at: null | string;
  scheduler_id?: null | number;
  content: {
    id: number;
    name: string;
    content: string;
    user_id: number;
    created_at: string;
    project_id: number;
    updated_at: string;
    content_type_id: number;
    content_types: {
      id: number;
      icon: null | string;
      value: string;
      user_id: null | number;
      type_name: string;
      is_default: boolean;
      profile_id: null | number;
      description: null | string;
      is_postable: boolean;
      post_medium: null | string;
    };
  };
  profiles: null | {
    id: number;
    user_id: number;
    created_at: string;
    is_default: boolean;
    updated_at: string;
    profile_name: string;
    profile_context: string;
  };
}

// Transform function to convert API response to Content type
function transformDataToContentFormat(data: ScheduledEventResponse[]): Content[] {
  return data.map(item => ({
    id: String(item.id),
    content_id: String(item.content_id),
    scheduler_id: item.id, // Using id as scheduler_id since it's required
    updated_at: new Date(item.updated_at),
    publish_at: new Date(item.publish_at),
    content: {
      id: String(item.content.id),
      name: item.content.name,
      content: item.content.content,
      created_at: new Date(item.content.created_at),
      priority: "Medium" as const,
      completed: false,
      content_types: {
        value: item.content.content_types.value || "",
        type_name: item.content.content_types.type_name || "",
        profile_id: item.profile_id || 0,
        is_postable: item.content.content_types.is_postable || false
      }
    },
    profiles: item.profiles ? {
      user_id: String(item.profiles.user_id),
      profile_id: String(item.profiles.id),
      profile_name: item.profiles.profile_name
    } : {
      user_id: String(item.user_id),
      profile_id: item.profile_id ? String(item.profile_id) : "0",
      profile_name: ""
    }
  }));
}

export default function ContentCalendarPage() {
  const { toast } = useToast();
  const { contents, setContents } = useContentContext();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarViewMode, setCalendarViewMode] = useState("month");
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar");
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date()),
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Content[]>([]);
  const [isDayEventsDialogOpen, setIsDayEventsDialogOpen] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  // We'll revert to a simpler approach
  type ContentWithStringPublishAt = {
    id: string;
    content_id: string;
    scheduler_id: number;
    updated_at: Date;
    publish_at: string;
    content: {
      id: string;
      name: string;
      content: string;
      created_at: Date;
      priority: "Low" | "Medium" | "High";
      completed: boolean;
      content_types: {
        value: string;
        type_name: string;
        profile_id: number;
        is_postable: boolean;
      };
    };
    profiles: {
      user_id: string;
      profile_id: string;
      profile_name: string;
      content_types: unknown[];
    };
  };
  
  const [editedContent, setEditedContent] = useState<ContentWithStringPublishAt | null>(null);
  const { userId } = useAuth();

  // Handle date navigation
  const navigateDate = (direction: "prev" | "next") => {
    // Set animation direction
    setSlideDirection(direction === "prev" ? "right" : "left");

    // Update the date
    if (calendarViewMode === "day") {
      setSelectedDate(
        direction === "prev"
          ? subDays(selectedDate, 1)
          : addDays(selectedDate, 1)
      );
    } else if (calendarViewMode === "week") {
      const newDate =
        direction === "prev"
          ? subWeeks(selectedDate, 1)
          : addWeeks(selectedDate, 1);
      setSelectedDate(newDate);
      setDateRange({
        start: startOfWeek(newDate),
        end: endOfWeek(newDate),
      });
    } else if (calendarViewMode === "month") {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
      setSelectedDate(newDate);
    }
  };

  // Update date range when view mode changes
  useEffect(() => {
    if (calendarViewMode === "day") {
      // Single day view
      setDateRange({
        start: selectedDate,
        end: selectedDate,
      });
    } else if (calendarViewMode === "week") {
      // Week view
      setDateRange({
        start: startOfWeek(selectedDate),
        end: endOfWeek(selectedDate),
      });
    } else if (calendarViewMode === "month") {
      // Month view
      setDateRange({
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate),
      });
    }
  }, [calendarViewMode, selectedDate]);

  // Get contents for a specific day (used in month view)
  const getContentsForDay = (date: Date) => {
    return contents?.filter((content) => isSameDay(content.publish_at, date));
  };

  // Add handler for opening content details
  const handleOpenContentDetails = (content: Content) => {
    setSelectedContent(content);
    setIsEditMode(false);
    setIsDetailDialogOpen(true);
  };
  const fetchScheduledEvents = async () => {
    try {
      const res = await getAllScheduledEvents(userId);
      const transformedData = transformDataToContentFormat(res.data as unknown as ScheduledEventResponse[]);
      setContents(transformedData);
    } catch (error) {
      console.error("Error fetching scheduled events:", error);
    }
  };

  useEffect(() => {
    fetchScheduledEvents();
  }, [userId, setContents]);

  // Handle delete confirmation

  // Open delete confirmation dialog
  const handleDeleteClick = (content: Content) => {
    setContentToDelete(content);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userId) return;
    
    try {
      const response = await deleteScheduledEvent(contentToDelete?.id, userId);

      console.log(response);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "The scheduled event has been successfully deleted.",
        });

        // Refetch the scheduled events
        const res = await getAllScheduledEvents(userId);
        // Transform the data
        const transformedData = transformDataToContentFormat(res.data as unknown as ScheduledEventResponse[]);
        setContents(transformedData);
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the event. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // Handle clicking on a day in the month view
  const handleDayClick = (day: Date) => {
    const eventsForDay = getContentsForDay(day);
    setSelectedDayEvents(eventsForDay);
    setSelectedDayDate(day);
    setIsDayEventsDialogOpen(true);
  };

  // Handle edit schedule
  const handleEditSchedule = (event: Content) => {
    setSelectedContent(event);
    // Convert the date to a string format for the datetime-local input
    const formattedDate = format(new Date(event.publish_at), "yyyy-MM-dd'T'HH:mm");
    
    const editableEvent = {
      ...event,
      publish_at: formattedDate
    };
    
    // @ts-expect-error - Bypassing type checking temporarily
    setEditedContent(editableEvent);
    setIsEditMode(true);
    setIsDetailDialogOpen(true);
  };

  // Handle save edited content
  const handleSaveEditedContent = async () => {
    if (!editedContent || !userId) return;
    
    try {
      // Format the date to include timezone information
      const selectedDateTime = new Date(editedContent.publish_at);
      const formattedDateTime = selectedDateTime.toISOString(); // This will format as "YYYY-MM-DDTHH:mm:ss.sssZ"

      // @ts-expect-error - Bypassing type checking temporarily
      const response = await updateScheduledEvent(Number(editedContent.id), {
        id: Number(editedContent.id),
        publish_at: formattedDateTime,
        status: "pending",
        user_id: Number(userId),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "The scheduled event has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update the event. Please try again.",
          variant: "destructive",
        });
      }

      // Refetch the scheduled events
      const res = await getAllScheduledEvents(userId);
      // Transform the data
      const transformedData = transformDataToContentFormat(res.data as unknown as ScheduledEventResponse[]);
      setContents(transformedData);
      
      setIsDetailDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the event. Please try again.",
        variant: "destructive",
      });
      console.error("Update error:", error);
    }
  };

  const filteredContents = contents
    ? contents.filter((content) =>
        searchQuery
          ? content.content.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : true
      )
    : [];

  return (
    <Box className="container mx-auto p-4">
      <Flex className="mb-6 space-x-4">
        <Button
          leftIcon={<CalendarIcon />}
          variant={activeView === "calendar" ? "default" : "outline"}
          size="md"
          onClick={() => setActiveView("calendar")}
        >
          Calendar
        </Button>
        <Button
          leftIcon={<List />}
          size="md"
          variant={activeView === "list" ? "default" : "outline"}
          onClick={() => setActiveView("list")}
        >
          List
        </Button>
      </Flex>

      {/* Calendar View Controls */}
      {activeView === "calendar" && (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="mb-6"
        >
          <Flex alignItems="center" gap="10px">
            <IconButton
              onClick={() => navigateDate("prev")}
              size="md"
              variant="ghost"
              icon={<ChevronLeft size={16} />}
              aria-label="Previous"
            />
            <Box
              style={{
                overflow: "hidden",
                position: "relative",
                width: "340px",
                height: "40px",
              }}
            >
              <motion.div
                key={selectedDate.toString()}
                initial={{
                  x:
                    slideDirection === "left"
                      ? 100
                      : slideDirection === "right"
                      ? -100
                      : 0,
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  x:
                    slideDirection === "left"
                      ? -100
                      : slideDirection === "right"
                      ? 100
                      : 0,
                  opacity: 0,
                  scale: 0.9,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1,
                }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {calendarViewMode === "day" && (
                  <Heading size="h4">
                    {format(selectedDate, "MMMM d, yyyy")}
                  </Heading>
                )}
                {calendarViewMode === "week" && (
                  <Heading size="h4">
                    {format(dateRange.start, "MMM d")} -{" "}
                    {format(dateRange.end, "MMM d, yyyy")}
                  </Heading>
                )}
                {calendarViewMode === "month" && (
                  <Heading size="h4">
                    {format(selectedDate, "MMMM yyyy")}
                  </Heading>
                )}
              </motion.div>
            </Box>
            <IconButton
              onClick={() => navigateDate("next")}
              size="md"
              variant="ghost"
              icon={<ChevronRight size={16} />}
              aria-label="Next"
            />
          </Flex>

          <Flex className="space-x-2">
            <Tabs
              defaultValue="day"
              onValueChange={(value) => setCalendarViewMode(value)}
              value={calendarViewMode}
            >
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </Tabs>
          </Flex>
        </Flex>
      )}

      {/* Week View */}
      {activeView === "calendar" && calendarViewMode === "week" && (
        <Card className="mb-8">
          <CardContent className="p-0">
            <Box className="grid grid-cols-7 gap-px bg-gray-100">
              {eachDayOfInterval({
                start: dateRange.start,
                end: dateRange.end,
              }).map((day) => (
                <Box
                  onClick={() => handleDayClick(day)}
                  css={{
                    cursor: "pointer",
                    height: "200px",
                    overflow: "hidden",
                  }}
                  key={day.toString()}
                  className={`p-4 bg-white ${
                    isToday(day) ? "ring-2 ring-[#00828D] ring-inset" : ""
                  }`}
                >
                  <Flex direction="column" alignItems="center" className="mb-3">
                    <Text variant="body" color="subdued">
                      {format(day, "EEE")}
                    </Text>
                    <Heading level="3" className="text-xl font-bold">
                      {format(day, "d")}
                    </Heading>
                  </Flex>

                  <div
                    className="space-y-3 mt-2 overflow-y-auto"
                    style={{ maxHeight: "130px" }}
                  >
                    {getContentsForDay(day)
                      ?.slice(0, 2)
                      .map((content) => (
                        <div key={content.id}>
                          <Card>
                            <CardContent className="p-0">
                              <div className="flex justify-between items-start">
                                <Badge
                                  variant="success"
                                  className="line-clamp-1 flex-1"
                                >
                                  {content.content.name}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}

                    {getContentsForDay(day)?.length > 2 && (
                      <Text
                        variant="caption"
                        className="text-blue-600 hover:underline cursor-pointer mt-1"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleDayClick(day);
                        }}
                      >
                        +{getContentsForDay(day)?.length - 2} more
                      </Text>
                    )}
                  </div>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Month View */}
      {activeView === "calendar" && calendarViewMode === "month" && (
        <Card className="mb-8">
          <CardContent className="p-0">
            <Box className="grid grid-cols-7 text-center p-2 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => {
                  const today = new Date();
                  const isToday = today.getDay() === index;

                  return (
                    <Text
                      key={day}
                      variant="caption"
                      fontWeight="semibold"
                      css={{
                        color: isToday ? "#00828D" : "inherit",
                        fontWeight: isToday ? "bold" : "normal",
                      }}
                    >
                      {day}
                    </Text>
                  );
                }
              )}
            </Box>
            <Box
              className="grid grid-cols-7"
              css={{ gap: "5px", margin: "5px" }}
            >
              {Array.from({ length: 35 }).map((_, index) => {
                const day = new Date(startOfMonth(selectedDate));
                day.setDate(1 - day.getDay() + index);
                const isCurrentMonth = isSameMonth(day, selectedDate);
                const contentsForDay = getContentsForDay(day);
                return (
                  <Box
                    key={day.toString()}
                    className={`p-2 hover:z-10 relative ${
                      isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${
                      contentsForDay?.length > 0
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                    }`}
                    css={{
                      border: "1px solid $secondary100",
                      minHeight: "120px",
                    }}
                    onClick={() =>
                      contentsForDay?.length > 0 && handleDayClick(day)
                    }
                  >
                    <Text
                      variant="caption"
                      fontWeight="semibold"
                      className={`${
                        isSameDay(day, new Date())
                          ? "bg-black rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                          : ""
                      }`}
                      css={{
                        textAlign: "right",
                        ...(isSameDay(day, new Date()) && {
                          color: "white",
                        }),
                      }}
                    >
                      {format(day, "d")}
                    </Text>
                    <Flex flexDirection="column" gap="2px" className="mt-2">
                      {contentsForDay?.slice(0, 2).map((content) => (
                        <div key={content.id}>
                          <Card>
                            <CardContent className="p-0">
                              <div className="flex justify-between items-start">
                                <Badge
                                  variant="success"
                                  className="line-clamp-1 flex-1"
                                >
                                  {content.content.name}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}

                      {contentsForDay?.length > 2 && (
                        <Text
                          variant="caption"
                          className="text-blue-600 hover:underline cursor-pointer mt-1"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleDayClick(day);
                          }}
                        >
                          +{contentsForDay?.length - 2} more
                        </Text>
                      )}
                    </Flex>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* List View Controls */}
      {activeView === "list" && (
        <Box className="mb-6">
          <Heading size="h4">Content List</Heading>

          <FormInput
            leftIcon={<Search />}
            placeholder="Search contents..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </Box>
      )}

      {/* Content List View */}
      {activeView === "list" && (
        <Card>
          <CardContent className="p-0">
            <Box className="overflow-hidden rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left">Content</th>
                    <th className="px-4 py-3 text-left">Scheduled Date</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredContents.length > 0 ? (
                    filteredContents.map((content) => (
                      <tr
                        key={content.id}
                        className="bg-white dark:bg-gray-950"
                      >
                        <td className="px-4 py-3">
                          <Flex alignItems="center">
                            <Box>
                              <Text variant="body" fontWeight="semibold">
                                {content.content.name}
                              </Text>
                            </Box>
                          </Flex>
                        </td>

                        <td className="px-4 py-3">
                          {format(content.publish_at, "MMM d, yyyy, h:mm a")}
                        </td>

                        <td className="px-4 py-3">
                          {content.content.content_types.value}
                        </td>
                        <td className="px-4 py-3">
                          <Flex gap="10px">
                            <IconButton
                              variant="ghost"
                              icon={<Eye />}
                              size="sm"
                              color="primary"
                              onClick={() => handleOpenContentDetails(content)}
                            ></IconButton>
                            <IconButton
                              variant="ghost"
                              icon={<Edit />}
                              size="sm"
                              color="primary"
                              onClick={() => handleEditSchedule(content)}
                            ></IconButton>
                            <IconButton
                              variant="ghost"
                              icon={<Trash2 />}
                              size="sm"
                              color="error"
                              onClick={() => handleDeleteClick(content)}
                            ></IconButton>
                          </Flex>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center">
                        <Text variant="body" color="subdued">
                          No results found
                        </Text>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      )}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold">
              {isEditMode ? "Edit Schedule" : selectedContent?.content.name}
            </DialogTitle>
          </DialogHeader>

          {isEditMode ? (
            <div className="py-6 space-y-6">
              <div className="grid gap-4">
                <div>
                  <Text size="lg" css={{ fontWeight: "$6" }}>
                    Content Name
                  </Text>
                  <Text>{selectedContent?.content.name}</Text>
                </div>

                <div>
                  <Text size="lg" css={{ fontWeight: "$6" }}>
                    Schedule Date and Time
                  </Text>
                  <FormInput
                    type="datetime-local"
                    value={editedContent?.publish_at}
                    min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditedContent(editedContent ? {
                        ...editedContent,
                        publish_at: e.target.value,
                      } : null)
                    }
                    required
                  />
                </div>

                {/* Add any other editable fields here */}
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text size="xl" css={{ fontWeight: "$7" }}>
                    Content Name
                  </Text>
                  <Text>{selectedContent?.content.name}</Text>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text size="xl" css={{ fontWeight: "$7" }}>
                    Scheduled Date
                  </Text>
                  <Text>
                    {selectedContent?.publish_at
                      ? format(
                          selectedContent.publish_at,
                          "MMM d, yyyy 'at' h:mm a"
                        )
                      : ""}
                  </Text>
                </div>
              </div>

              <div>
                <Text size="xl" css={{ fontWeight: "$7" }}>
                  Content Preview
                </Text>
                <Box
                  className="content-preview border rounded-lg p-5 bg-white shadow-inner"
                  css={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    overflowX: "hidden",
                    lineHeight: "1.6",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: selectedContent?.content?.content,
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
              className="hover:bg-gray-100 transition-colors"
            >
              Close
            </Button>
            {isEditMode && (
              <Button
                size="md"
                variant="outline"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleSaveEditedContent();
                  setIsDetailDialogOpen(false);
                }}
                className="hover:bg-gray-100 transition-colors"
              >
                Save
              </Button>
            )}
            <Button
              size="md"
              variant="secondary"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setIsEditMode(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Text variant="body">
              Are you sure you want to delete &ldquo;
              {contentToDelete?.content.name}&rdquo;? This action cannot be
              undone.
            </Text>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="solid" color="error" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Events Dialog */}
      <Dialog
        open={isDayEventsDialogOpen}
        onOpenChange={setIsDayEventsDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader className=" pb-4">
            <DialogTitle className="text-xl font-bold">
              Events for{" "}
              {selectedDayDate ? format(selectedDayDate, "MMMM d, yyyy") : ""}
            </DialogTitle>
          </DialogHeader>
          <div
            className="py-6"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <Flex justifyContent="space-between" alignItems="center">
                        <Box>
                          <Heading level="4" className="font-medium">
                            {event.content.name}
                          </Heading>
                          <Text variant="caption" color="subdued">
                            {format(event.publish_at, "h:mm a")}
                          </Text>
                        </Box>
                        <Flex gap="10px">
                          <Button
                            variant="outline"
                            size="md"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleOpenContentDetails(event);
                              setIsDayEventsDialogOpen(false);
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="md"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleEditSchedule(event);
                              setIsDayEventsDialogOpen(false);
                            }}
                          >
                            Edit Schedule
                          </Button>
                        </Flex>
                      </Flex>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Text variant="body" color="subdued" className="text-center py-4">
                No events scheduled for this day
              </Text>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              size="md"
              color="secondary"
              onClick={() => setIsDayEventsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
