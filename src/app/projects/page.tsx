"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { getUserProjects, searchProjects } from "@/app/lib/projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SavePage from "../save/page";

// Define Project interface
interface Project {
  id: number;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Additional fields to match the UI expectations
  status?: string;
  progress?: number;
  teamSize?: number;
  category?: string;
  dueDate?: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { user, userId, isLoading: authLoading } = useAuth();
  const [searchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure component only renders after mounting to prevent client/server mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch projects when the user ID is available
  useEffect(() => {
    async function fetchProjects() {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getUserProjects(userId);

        // Transform data to match the UI expectations
        const formattedData = data.map((project) => ({
          ...project,
          status: determineStatus(project),
          progress: determineProgress(project),
          teamSize: 1, // Default value
          category: determineCategory(project),
          dueDate: formatDate(project.updated_at),
        }));

        setProjects(formattedData);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [userId]);

  // Handle search query changes
  useEffect(() => {
    async function handleSearch() {
      if (!userId || !searchQuery.trim()) {
        // If no search query, revert to regular list
        const data = await getUserProjects(userId || "");
        const formattedData = data.map(formatProjectForUI);
        setProjects(formattedData);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchProjects(userId, searchQuery);
        const formattedData = data.map(formatProjectForUI);
        setProjects(formattedData);
      } catch (err) {
        console.error("Error searching projects:", err);
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

  // Helper functions for formatting data
  const determineStatus = (project: Project): string => {
    const createdDate = new Date(project.created_at);
    const updatedDate = new Date(project.updated_at);
    const now = new Date();

    // If updated within the last week, consider it active
    if (now.getTime() - updatedDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return "active";
    }

    // If created recently but not updated, consider it planning
    if (now.getTime() - createdDate.getTime() < 14 * 24 * 60 * 60 * 1000) {
      return "planning";
    }

    // Otherwise consider it completed
    return "completed";
  };

  const determineProgress = (project: Project): number => {
    const status = determineStatus(project);

    switch (status) {
      case "planning":
        return Math.floor(Math.random() * 30); // 0-30%
      case "active":
        return 30 + Math.floor(Math.random() * 50); // 30-80%
      case "completed":
        return 100;
      default:
        return 50;
    }
  };

  const determineCategory = (project: Project): string => {
    // Extract category from project name or description if possible
    const name = project.name.toLowerCase();
    const desc = (project.description || "").toLowerCase();

    if (name.includes("social") || desc.includes("social")) return "social";
    if (name.includes("campaign") || desc.includes("campaign"))
      return "campaign";
    if (name.includes("web") || desc.includes("website")) return "website";
    if (name.includes("launch") || desc.includes("launch")) return "launch";
    if (name.includes("brand") || desc.includes("brand")) return "brand";

    // Default to campaign if no match
    return "campaign";
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatProjectForUI = (project: Project) => ({
    ...project,
    status: determineStatus(project),
    progress: determineProgress(project),
    teamSize: 1, // Default value
    category: determineCategory(project),
    dueDate: formatDate(project.updated_at),
  });

  // Filter projects based on active tab
  // const filteredProjects = projects.filter((project) => {
  //   const matchesTab =
  //     activeTab === "all" ||
  //     (activeTab === "active" && project.status === "active") ||
  //     (activeTab === "completed" && project.status === "completed") ||
  //     (activeTab === "planning" && project.status === "planning") ||
  //     project.category === activeTab;

  //   return matchesTab;
  // });

  // const getStatusStyles = (status: string) => {
  //   switch (status) {
  //     case "active":
  //       return "bg-emerald-500/10 text-emerald-600";
  //     case "completed":
  //       return "bg-blue-500/10 text-blue-600";
  //     case "planning":
  //       return "bg-amber-500/10 text-amber-600";
  //     default:
  //       return "bg-gray-200 text-gray-600";
  //   }
  // };

  // const handleProjectClick = (projectId: string | number) => {
  //   router.push(`/projects/${projectId}`);
  // };

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Return null until component is mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <div className="container py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-8 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-60 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container py-6 px-4 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Error Loading Projects
        </h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state when no projects are found
  if (projects.length === 0) {
    return (
      <div className="container py-6 px-4 text-center">
        <h2 className="text-xl font-semibold mb-3">No Projects Found</h2>
        <p className="text-muted-foreground mb-6">
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </p>
        <Button onClick={() => router.push("/projects/new")}>
          <Plus size={16} className="mr-2" />
          Create New Project
        </Button>
      </div>
    );
  }

  // Remove the DynamicTwigsComponents since it's causing import errors
  // Replace with a direct implementation of the UI
  return <SavePage />;
}
