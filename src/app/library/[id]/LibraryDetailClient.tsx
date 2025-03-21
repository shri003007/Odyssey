"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { getContentDetails, deleteContent } from "@/app/lib/content";
import { Box, Flex, Heading, IconButton, Text } from "@sparrowengg/twigs-react";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";
import {
  ArrowLeft,
  Trash,
  Calendar,
  File,
  Download,
  Share2,
} from "lucide-react";
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

export default function LibraryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, userId, isLoading: authLoading } = useAuth();
  const contentId = params.id;
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
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

  // Fetch content details
  useEffect(() => {
    async function fetchContentDetails() {
      if (!userId || !contentId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getContentDetails(contentId, userId);
        setContent(data);
      } catch (err) {
        console.error("Error fetching content details:", err);
        setError("Failed to load content details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContentDetails();
  }, [userId, contentId]);

  const handleDelete = async () => {
    if (!userId || !content) return;

    setIsDeleting(true);

    try {
      const success = await deleteContent(content.id.toString(), userId);

      if (success) {
        toast.success("Content deleted successfully");
        router.push("/library");
      } else {
        throw new Error("Failed to delete content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content. Please try again.");
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

  // Determine content type for display
  const getContentType = () => {
    if (!content || !content.content_types) return "Document";

    const typeName = content.content_types.type_name;
    return typeName.charAt(0).toUpperCase() + typeName.slice(1);
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
          Error Loading Content
        </h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <SafeButton onClick={() => window.location.reload()}>
          Try Again
        </SafeButton>
      </Box>
    );
  }

  if (!content) {
    return (
      <Box className="container py-6 px-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Content Not Found
        </h2>
        <p className="text-muted-foreground mb-4">
          The content you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <SafeButton onClick={() => router.push("/library")}>
          Back to Library
        </SafeButton>
      </Box>
    );
  }

  return (
    <Box className="container py-6 px-4">
      <Flex className="mb-6">
        <SafeButton
          variant="ghost"
          onClick={() => router.push("/library")}
          leftIcon={<ArrowLeft size={16} className="mr-2" />}
        >
          Back to Library
        </SafeButton>
      </Flex>

      <Flex
        className="flex-col md:flex-row  items-start md:items-center mb-4"
        gap="10px"
      >
        <Heading as="h1" className="text-3xl font-bold mb-2">
          {content.name}
        </Heading>

        <IconButton
          variant="outline"
          color="error"
          size="md"
          icon={<Trash size={16} className="mr-2" />}
          onClick={() => setDeleteDialogOpen(true)}
        />
      </Flex>

      <Flex className="items-center text-muted-foreground mb-6">
        <Flex className="items-center mr-4">
          <Calendar size={16} className="mr-1" />
          <Text className="text-sm">
            Created: {formatDate(content.created_at)}
          </Text>
        </Flex>
        <Flex className="items-center mr-4">
          <Calendar size={16} className="mr-1" />
          <Text className="text-sm">
            Updated: {formatDate(content.updated_at)}
          </Text>
        </Flex>
        <Flex className="items-center">
          <File size={16} className="mr-1" />
          <Text className="text-sm">Type: {getContentType()}</Text>
        </Flex>
      </Flex>

      {content.projects && (
        <Flex className="mb-4 items-center">
          <Text className="text-sm font-medium mr-2">Project:</Text>
          <Box
            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm cursor-pointer"
            onClick={() => router.push(`/projects/${content.project_id}`)}
          >
            {content.projects.name}
          </Box>
        </Flex>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="raw">Raw Content</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          {activeTab === "preview" ? (
            <Box className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </Box>
          ) : (
            <Box className="font-mono text-sm whitespace-pre-wrap bg-muted/30 p-4 rounded-md overflow-auto">
              {content.content}
            </Box>
          )}
        </CardContent>
      </Card>

      <Flex className="justify-end mt-6 gap-2">
        <SafeButton
          variant="outline"
          size="md"
          rightIcon={<Download size={16} className="mr-2" />}
        >
          Download
        </SafeButton>
        <SafeButton
          variant="outline"
          size="md"
          rightIcon={<Share2 size={16} className="mr-2" />}
        >
          Share
        </SafeButton>
      </Flex>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
