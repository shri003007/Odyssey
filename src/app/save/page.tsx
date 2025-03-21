"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth-provider";
import { ProjectPanel } from "@/components/save/project-panel";
import { ContentPanel } from "@/components/save/content-panel";
import { RecentContentPanel } from "@/components/save/recent-content-panel";
import { EditorPanel } from "@/components/save/editor-panel";
import { NavSidebar } from "@/components/nav-sidebar";
import { getUserProjects } from "@/app/lib/projects";
import { FolderOpenDot, ClockIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
// import { Project } from 'next/dist/build/swc/types'

interface Project {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

type ViewMode = "recent" | "projects";

function SavePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pl-0 flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b flex items-center px-6 justify-between">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-9 w-64 rounded-md" />
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-44" />
                        <Skeleton className="h-4 w-32" />
                        <div className="space-y-2 pt-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SavePage() {
  const { userId } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("projects");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load saved view preference from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("savePageViewMode") as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("savePageViewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const loadProjects = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const projectsData = await getUserProjects(userId);
        setProjects(projectsData);
        if (projectsData.length > 0 && viewMode === "projects") {
          setSelectedProjectId(projectsData[0].id.toString());
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [userId, viewMode]);

  if (isLoading) {
    return <SavePageSkeleton />;
  }

  console.log("settings");
  return (
    <div className="min-h-screen bg-background">
      <NavSidebar />
      <main className="pl-0 flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b flex items-center px-6 justify-between">
            <h1 className="text-xl font-semibold">Saved Content</h1>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
              className="w-64"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="recent"
                  className="flex items-center gap-1.5"
                >
                  <ClockIcon className="h-3.5 w-3.5" />
                  Recent
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="flex items-center gap-1.5"
                >
                  <FolderOpenDot className="h-3.5 w-3.5" />
                  Projects
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-1 overflow-hidden">
            {viewMode === "recent" ? (
              <Card className="h-full rounded-none border-0 shadow-none">
                <CardContent className="p-0 h-full">
                  <RecentContentPanel
                    userId={userId || ""}
                    selectedItems={selectedItems}
                    onSelectItems={setSelectedItems}
                    onSelectContent={setSelectedContentId}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="flex-1 flex h-full">
                <ProjectPanel
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={setSelectedProjectId}
                  userId={userId || ""}
                />
                <Separator orientation="vertical" />
                <ContentPanel
                  projectId={selectedProjectId}
                  selectedContentId={selectedContentId}
                  onSelectContent={setSelectedContentId}
                  userId={userId || ""}
                  onContentChange={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {selectedContentId && (
          <>
            <Separator orientation="vertical" />
            <EditorPanel
              contentId={selectedContentId}
              onClose={() => setSelectedContentId(null)}
              userId={userId || ""}
            />
          </>
        )}
      </main>
    </div>
  );
}
