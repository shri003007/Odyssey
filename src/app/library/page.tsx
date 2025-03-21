"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  FormInput,
  Button,
  FormLabel,
  Textarea,
} from "@sparrowengg/twigs-react";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";
import {
  Search,
  Grid3X3,
  List,
  FileText,
  Image as ImageIcon,
  Video,
  Clock,
  PenSquare,
  Upload,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { getUserContent, searchContent } from "@/app/lib/content";
import { Skeleton } from "@/components/ui/skeleton";
import { NavSidebar } from "@/components/nav-sidebar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { saveEventForSchedule, updateScheduledEvent } from "../lib/schedule";
import { useToast } from "@/hooks/use-toast";

// Type definition for library items
interface LibraryItem {
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
  // Additional UI fields
  type?: string;
  format?: string;
  fileSize?: string;
  thumbnail?: string;
  tags?: string[];
  category?: string;
  title?: string;
  createdAt?: string;
  schedules?: {
    publish_at: Date;
    scheduler_id: number;
    platform: string;
    notes: string;
  }[];
}

// Define Project interface to match the projects structure
interface Project {
  id: number;
  name: string;
  description?: string;
  user_id: string;
}

interface ScheduleDetails {
  contentId: number;
  contentName: string;
  scheduledDate: string;
  scheduledTime: string;
  platform: string;
  notes: string;
}

// Create a safe version of the Button component to prevent hydration errors
function SafeButton(props: React.ComponentProps<typeof TwigsButton>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Always provide a size prop if not provided
  const buttonProps = {
    ...props,
    size: props.size || "md",
  };

  return <TwigsButton {...buttonProps} />;
}

function LibraryPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pl-16 flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b flex items-center px-6 justify-between">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-9 w-64 rounded-md" />
          </div>
          <div className="p-6">
            <Flex className="justify-between items-center mb-6">
              <Box>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </Box>
              <Flex className="gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </Flex>
            </Flex>
            <Skeleton className="h-10 w-full mb-6" />
            <Skeleton className="h-8 w-full mb-6" />
            <Box className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const router = useRouter();
  const { user, userId, isLoading: authLoading } = useAuth();
  const [, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [, setProjects] = useState<Project[]>([]);
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDetails, setScheduleDetails] =
    useState<ScheduleDetails | null>(null);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const { toast } = useToast();
  const { profiles } = useAuth();

  // const TAB_CATEGORIES = [
  //   { value: "all", label: "All Items" },
  //   { value: "documents", label: "Documents" },
  //   { value: "images", label: "Images" },
  //   { value: "videos", label: "Videos" },
  //   { value: "social", label: "Social Media" },
  //   { value: "email", label: "Email" },
  // ];

  // Ensure component only renders after mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch content and projects when the user ID is available
  useEffect(() => {
    async function fetchContent() {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch content
        const data = await getUserContent(userId || "");
        const processedData = data.map(processContentItem);
        setLibraryItems(processedData);

        // Also fetch projects for grouping
        const projectsData = await fetch(
          `${process.env.NEXT_PUBLIC_PROJECT_SERVICE_URL}/projects/user/${userId}`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch projects");
            return res.json();
          })
          .then((result) => result.data);

        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, []);

  // Handle search query changes
  useEffect(() => {
    async function handleSearch() {
      if (!userId || !searchQuery.trim()) {
        // If no search query, revert to regular list
        const data = await getUserContent(userId || "");
        const processedData = data.map(processContentItem);
        setLibraryItems(processedData);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchContent(userId, searchQuery);
        const processedData = data.map(processContentItem);
        setLibraryItems(processedData);
      } catch (err) {
        console.error("Error searching content:", err);
        setError("Search failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce search
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, userId]);

  // Process content items to match UI expectations
  const processContentItem = (item: LibraryItem): LibraryItem => {
    // Determine content type
    let type = "document";
    if (item.content_types?.type_name) {
      const typeName = item.content_types.type_name.toLowerCase();
      if (typeName.includes("image")) type = "image";
      else if (typeName.includes("video")) type = "video";
    }

    // Generate thumbnail
    let thumbnail = `https://ui-avatars.com/api/?name=DOC&background=3B82F6&color=fff&size=80`;
    if (type === "image") {
      thumbnail = `https://ui-avatars.com/api/?name=IMG&background=6366F1&color=fff&size=80`;
    } else if (type === "video") {
      thumbnail = `https://ui-avatars.com/api/?name=VID&background=F97316&color=fff&size=80`;
    }

    // Extract tags from content or use default
    const tags = extractTags(item.content);

    // Determine category
    const category = determineCategory(item.content, type);

    // Calculate file size (mock)
    const fileSize = generateMockFileSize(type);

    return {
      ...item,
      title: item.name,
      type,
      format: type === "document" ? "docx" : type === "image" ? "png" : "mp4",
      fileSize,
      thumbnail,
      tags,
      category,
      createdAt: formatDate(item.created_at),
    };
  };

  // Helper functions
  const extractTags = (content: string): string[] => {
    // Simple extraction of potential tags from content
    const words = content.toLowerCase().split(/\s+/);
    const commonTags = ["Twitter", "LinkedIn"];

    return commonTags.filter((tag) => words.includes(tag)) || ["content"];
  };

  const determineCategory = (content: string, type: string): string => {
    const text = content.toLowerCase();

    if (
      text.includes("social") ||
      text.includes("facebook") ||
      text.includes("twitter") ||
      text.includes("instagram")
    )
      return "social";
    if (text.includes("email") || text.includes("newsletter")) return "email";
    if (text.includes("blog") || text.includes("article")) return "blog";
    if (text.includes("product") || text.includes("service")) return "product";
    if (
      text.includes("brand") ||
      text.includes("logo") ||
      text.includes("identity")
    )
      return "brand";
    if (type === "video") return "video";

    return type;
  };

  const generateMockFileSize = (type: string): string => {
    if (type === "document")
      return `${Math.floor(Math.random() * 500) + 100} KB`;
    if (type === "image")
      return `${Math.floor(Math.random() * 3) + 1}.${
        Math.floor(Math.random() * 9) + 1
      } MB`;
    if (type === "video")
      return `${Math.floor(Math.random() * 20) + 5}.${
        Math.floor(Math.random() * 9) + 1
      } MB`;
    return "1.0 MB";
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group library items by project
  // const groupContentByProject = (items: LibraryItem[]) => {
  //   // Create a map for quick project lookup
  //   const projectMap = new Map<number, Project>();
  //   projects.forEach((project) => {
  //     projectMap.set(project.id, project);
  //   });

  //   // Group items by project_id
  //   const groupedMap = new Map<number | null, LibraryItem[]>();

  //   items.forEach((item) => {
  //     const projectId = item.project_id || null;
  //     if (!groupedMap.has(projectId)) {
  //       groupedMap.set(projectId, []);
  //     }
  //     groupedMap.get(projectId)?.push(item);
  //   });

  //   // Convert to array structure
  //   const result = [];

  //   // Add grouped items with projects first
  //   groupedMap.forEach((items, projectId) => {
  //     if (projectId !== null) {
  //       const project = projectMap.get(projectId);
  //       if (project) {
  //         result.push({
  //           projectId,
  //           projectName: project.name,
  //           items,
  //         });
  //       }
  //     }
  //   });

  //   // Add ungrouped items last
  //   if (groupedMap.has(null)) {
  //     result.push({
  //       projectId: null,
  //       projectName: "No Project",
  //       items: groupedMap.get(null) || [],
  //     });
  //   }

  //   return result;
  // };

  // const groupedContent = groupContentByProject(filteredItems);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-500/10 text-blue-600";
      case "image":
        return "bg-purple-500/10 text-purple-600";
      case "video":
        return "bg-amber-500/10 text-amber-600";
      default:
        return "bg-neutral-200 text-neutral-600";
    }
  };

  const handleScheduleClick = (e: React.MouseEvent, item: LibraryItem) => {
    e.stopPropagation(); // Prevent navigation to item details
    setSelectedItem(item);
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async () => {
    // Get first available profile ID or default to 1
    // const profileId = profiles && profiles.length > 0 ? profiles[0].id : 1;

    const payload = {
      content_id: scheduleDetails?.contentId || 0,
      user_id: userId ? parseInt(userId) : 0,
      // profile_id: profileId,
      publish_at: `${scheduleDetails?.scheduledDate}T${scheduleDetails?.scheduledTime}:00Z`,
    };

    const response = await saveEventForSchedule(payload);

    console.log(response);

    if (response.ok) {
      toast({
        title: "Success",
        description: "The scheduled event has been successfully saved.",
      });

      const data = await getUserContent(userId || "");
      const processedData = data.map(processContentItem);
      setLibraryItems(processedData);
    } else {
      toast({
        title: "Error",
        description: "Failed to save the scheduled event. Please try again.",
        variant: "destructive",
      });
    }

    // Close the modal
    setScheduleModalOpen(false);
    // Reset the form
    setSelectedItem(null);
  };

  if (!mounted) {
    return null;
  }

  // Show loading state
  if (authLoading) {
    return <LibraryPageSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavSidebar />
        <main className="pl-16 flex h-screen overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="h-16 border-b flex items-center px-6 justify-between">
              <h1 className="text-xl font-semibold">Content Library</h1>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Error Loading Content Library
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <SafeButton onClick={() => window.location.reload()}>
                Try Again
              </SafeButton>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavSidebar />
      <main className="pl-16 flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b flex items-center px-6 justify-between">
            <h1 className="text-xl font-semibold">Content Library</h1>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value)}
              className="w-64"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid" className="flex items-center gap-1.5">
                  <Grid3X3 className="h-3.5 w-3.5" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1.5">
                  <List className="h-3.5 w-3.5" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <Flex className="flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <Box>
                <Heading as="h2" className="text-2xl font-bold mb-2">
                  Your Content
                </Heading>
                <Text className="text-sm text-muted-foreground ml-2">
                  ({libraryItems.length}{" "}
                  {libraryItems.length === 1 ? "item" : "items"})
                </Text>
              </Box>

              <Flex className="gap-3 mt-4 md:mt-0">
                <Button
                  leftIcon={<PenSquare size={16} />}
                  variant="outline"
                  size="md"
                  onClick={() => router.push("/create")}
                >
                  Create New
                </Button>
              </Flex>
            </Flex>

            {/* Search and filters */}
            <Flex className="flex-col md:flex-row gap-4 mb-8">
              <Box className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <FormInput
                  leftIcon={<Search />}
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                />
              </Box>
            </Flex>

            {/* Tabs */}
            {/* <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8 inline-block"
            >
              <TabsList className="bg-muted/30 p-1 rounded-md flex flex-wrap gap-1 md:flex-nowrap overflow-x-auto">
                {TAB_CATEGORIES.map((category) => (
                  <TabsTrigger key={category.value} value={category.value}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs> */}

            {/* Empty state */}
            {libraryItems?.length === 0 && (
              <Card className="p-8 text-center">
                <CardContent className="pt-6 flex flex-col items-center">
                  <Heading as="h3" className="text-xl font-semibold mb-3">
                    No content found
                  </Heading>
                  <Text className="mb-6">
                    {searchQuery
                      ? "No items match your search criteria. Try adjusting your search or filters."
                      : "You haven't created any content yet. Get started by creating new content."}
                  </Text>
                  <Button
                    leftIcon={<PenSquare size={16} />}
                    size="md"
                    css={{
                      width: "fit-content",
                    }}
                    onClick={() => {
                      if (searchQuery) {
                        setSearchQuery("");
                        setActiveTab("all");
                      } else {
                        router.push("/create");
                      }
                    }}
                  >
                    {searchQuery ? "Clear Filters" : "Create Content"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Project-grouped Library Content */}
            {libraryItems?.length > 0 && (
              <Box className="space-y-10">
                {/* Display all items without grouping */}
                <Box className="space-y-5">
                  <Flex alignItems="center" className="border-b pb-2"></Flex>

                  {viewMode === "grid" ? (
                    <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {libraryItems.map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border hover:border-primary/30 group"
                          onClick={() => router.push(`/library/${item.id}`)}
                        >
                          <CardContent className="p-0">
                            <Box className="relative h-40 bg-muted/50 flex items-center justify-center overflow-hidden group-hover:bg-muted/70 transition-colors duration-300">
                              {item.type === "image" ? (
                                <Image
                                  src={item.thumbnail || ""}
                                  alt={item.name}
                                  width={200}
                                  height={160}
                                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <Box
                                  className="w-20 h-20 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-110"
                                  style={{
                                    backgroundColor: "rgba(var(--muted))",
                                  }}
                                >
                                  <Image
                                    src={item.thumbnail || ""}
                                    alt={item.type || ""}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                  />
                                </Box>
                              )}
                            </Box>
                            <Box className="p-5">
                              <Flex className="items-center justify-between mb-3">
                                <Box
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${getTypeColor(
                                    item.type || ""
                                  )}`}
                                >
                                  {item.content_types?.type_name || "Document"}
                                </Box>
                                <Text className="text-xs text-muted-foreground">
                                  {item.fileSize}
                                </Text>
                              </Flex>
                              <Heading
                                as="h4"
                                className="text-base font-semibold line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300"
                              >
                                {item.name}
                              </Heading>
                              <Flex className="flex-wrap gap-1.5 mb-3">
                                {item.tags?.slice(0, 3).map((tag) => (
                                  <Box
                                    key={tag}
                                    className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-md"
                                  >
                                    {tag}
                                  </Box>
                                ))}
                              </Flex>
                              <Flex className="items-center justify-between text-xs text-muted-foreground mt-2">
                                <Flex className="items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  <Text>
                                    {item.createdAt ||
                                      formatDate(item.created_at)}
                                  </Text>
                                </Flex>
                              </Flex>
                              <Flex className="mt-4">
                                <SafeButton
                                  onClick={(e: React.MouseEvent) =>
                                    handleScheduleClick(e, item)
                                  }
                                  rightIcon={<Calendar className="h-4 w-4" />}
                                  variant="outline"
                                >
                                  Schedule
                                </SafeButton>
                              </Flex>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Card className="overflow-hidden border">
                      <CardContent className="p-0 divide-y">
                        {libraryItems.map((item) => (
                          <Flex
                            key={item.id}
                            className="p-5 hover:bg-muted/10 transition-colors duration-300 cursor-pointer items-center group"
                            onClick={() => router.push(`/library/${item.id}`)}
                          >
                            <Box className="bg-muted/30 w-14 h-14 flex items-center justify-center rounded-lg mr-5 group-hover:bg-muted/50 transition-colors duration-300">
                              {getTypeIcon(item.type || "document")}
                            </Box>
                            <Box className="flex-grow">
                              <Heading
                                as="h3"
                                className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300"
                              >
                                {item.name}
                              </Heading>
                              <Flex className="text-xs text-muted-foreground gap-4">
                                <Text>{item.fileSize}</Text>
                                {item.projects?.name && (
                                  <Text>{item.projects.name}</Text>
                                )}
                                <Text>
                                  {item.content_types?.type_name || "Document"}
                                </Text>
                              </Flex>
                            </Box>
                            <Box
                              className={`px-3 py-1.5 rounded-full text-xs font-medium mr-4 ${getTypeColor(
                                item.type || ""
                              )}`}
                            >
                              {item.content_types?.type_name || "Document"}
                            </Box>
                            <Flex className="gap-2">
                              <SafeButton
                                onClick={(e: React.MouseEvent) =>
                                  handleScheduleClick(e, item)
                                }
                                rightIcon={<Calendar className="h-4 w-4" />}
                                variant="outline"
                              >
                                Schedule
                              </SafeButton>
                            </Flex>
                          </Flex>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </Box>
            )}
          </div>
        </div>
      </main>

      {/* Schedule Modal */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent>
          <DialogTitle>
            <Heading className="text-xl font-semibold">
              Schedule Content
            </Heading>
            <Text className="text-sm text-muted-foreground mt-1">
              {selectedItem?.name}
            </Text>
          </DialogTitle>

          <Box className="space-y-4">
            <Box>
              <FormLabel htmlFor="scheduledDate">Date</FormLabel>
              <FormInput
                id="scheduledDate"
                type="date"
                value={scheduleDetails?.scheduledDate || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setScheduleDetails({
                    ...scheduleDetails,
                    contentId: selectedItem?.id || 0,
                    contentName: selectedItem?.name || "",
                    scheduledDate: e.target.value,
                  } as ScheduleDetails)
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </Box>
            <Box>
              <FormLabel htmlFor="scheduledTime">Time</FormLabel>
              <FormInput
                id="scheduledTime"
                type="time"
                value={scheduleDetails?.scheduledTime || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setScheduleDetails({
                    ...scheduleDetails,
                    scheduledTime: e.target.value,
                  } as ScheduleDetails)
                }
              />
            </Box>

            <Box>
              <FormLabel htmlFor="notes">Notes</FormLabel>
              <Textarea
                id="notes"
                resize="none"
                placeholder="Add any additional notes..."
                value={scheduleDetails?.notes || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setScheduleDetails({
                    ...scheduleDetails,
                    notes: e.target.value,
                  } as ScheduleDetails)
                }
                rows={3}
              />
            </Box>
          </Box>

          <DialogFooter>
            <Flex className="justify-end gap-3">
              <Button
                disabled={!scheduleDetails?.scheduledDate}
                variant="outline"
                onClick={() => setScheduleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleScheduleSubmit}>Schedule</Button>
            </Flex>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
