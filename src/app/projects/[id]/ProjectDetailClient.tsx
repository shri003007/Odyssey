"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import {
  getProjectDetails,
  updateProject,
  deleteProject,
} from "@/app/lib/projects";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Textarea,
} from "@sparrowengg/twigs-react";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";
import { ArrowLeft, Edit, Trash, Save, Calendar, Users, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    size: props?.size || "md",
  };

  return <TwigsButton {...buttonProps} />;
}

interface Project {
  id: number;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, userId, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);

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

  // Fetch project details
  useEffect(() => {
    async function fetchProjectDetails() {
      if (!userId || !id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getProjectDetails(id, userId);
        setProject(data);
        setName(data.name);
        setDescription(data.description || "");
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjectDetails();
  }, [userId, id]);

  const handleSave = async () => {
    if (!userId || !project) return;

    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsSaving(true);

    try {
      const updatedProject = await updateProject(
        project.id.toString(),
        userId,
        { name, description: description || undefined }
      );

      setProject(updatedProject);
      setIsEditing(false);
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !project) return;

    setIsDeleting(true);

    try {
      const success = await deleteProject(project.id.toString(), userId);

      if (success) {
        toast.success("Project deleted successfully");
        router.push("/projects");
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Return null until component is mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <Box className="container py-6 px-4">
        <Flex className="mb-6">
          <Skeleton className="h-10 w-32" />
        </Flex>

        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-full max-w-md mb-6" />

        <Skeleton className="h-10 w-full mb-6" />

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box className="container py-6 px-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Error Loading Project
        </h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <SafeButton onClick={() => window.location.reload()}>
          Try Again
        </SafeButton>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box className="container py-6 px-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Project Not Found
        </h2>
        <p className="text-muted-foreground mb-4">
          The project you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <SafeButton onClick={() => router.push("/projects")}>
          Back to Projects
        </SafeButton>
      </Box>
    );
  }

  return (
    <Box className="container py-6 px-4">
      <Flex className="mb-6">
        <SafeButton variant="ghost" onClick={() => router.push("/projects")}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </SafeButton>
      </Flex>

      <Flex className="flex-col md:flex-row justify-between items-start md:items-center mb-4">
        {isEditing ? (
          <Box className="w-full md:w-2/3 mb-4 md:mb-0">
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Project name"
              className="text-2xl font-bold mb-2"
            />
          </Box>
        ) : (
          <Heading as="h1" className="text-3xl font-bold mb-2">
            {project.name}
          </Heading>
        )}

        <Flex className="space-x-2">
          {isEditing ? (
            <>
              <SafeButton
                onClick={() => {
                  setIsEditing(false);
                  setName(project.name);
                  setDescription(project.description || "");
                }}
                variant="outline"
                isDisabled={isSaving}
              >
                <X size={16} className="mr-2" />
                Cancel
              </SafeButton>
              <SafeButton onClick={handleSave} isLoading={isSaving}>
                <Save size={16} className="mr-2" />
                Save Changes
              </SafeButton>
            </>
          ) : (
            <>
              <SafeButton
                rightIcon={<Edit size={16} />}
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Project
              </SafeButton>
              <SafeButton
                rightIcon={<Trash size={16} />}
                variant="outline"
                className="text-red-500 hover:bg-red-50"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </SafeButton>
            </>
          )}
        </Flex>
      </Flex>

      <Flex className="items-center text-muted-foreground mb-6">
        <Flex className="items-center mr-4">
          <Calendar size={16} className="mr-1" />
          <Text className="text-sm">
            Created: {formatDate(project.created_at)}
          </Text>
        </Flex>
        <Flex className="items-center">
          <Users size={16} className="mr-1" />
          <Text className="text-sm">Owner: You</Text>
        </Flex>
      </Flex>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "overview" && (
        <Card>
          <CardContent className="p-6">
            {isEditing ? (
              <Textarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                placeholder="Add a description for your project..."
                className="w-full min-h-[150px]"
              />
            ) : (
              <>
                <Heading as="h2" className="text-xl font-semibold mb-4">
                  Description
                </Heading>
                {project.description ? (
                  <Text>{project.description}</Text>
                ) : (
                  <Text className="text-muted-foreground italic">
                    No description provided.
                  </Text>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "content" && (
        <Card>
          <CardContent className="p-6 text-center">
            <Box className="py-8">
              <Heading as="h2" className="text-xl font-semibold mb-2">
                No Content Yet
              </Heading>
              <Text className="text-muted-foreground mb-4">
                Start creating content for this project
              </Text>
              <SafeButton>Create Content</SafeButton>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeTab === "settings" && (
        <Card>
          <CardContent className="p-6">
            <Heading as="h2" className="text-xl font-semibold mb-4">
              Project Settings
            </Heading>
            <Text className="text-muted-foreground mb-4">
              Additional settings will be available soon.
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
