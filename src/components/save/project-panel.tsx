"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Clock, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreateProjectDialog } from "./create-project-dialog";
import { EditProjectDialog } from "./edit-project-dialog";
import { deleteProject } from "@/app/lib/projects";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";
import { IconButton } from "@sparrowengg/twigs-react";

interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  content_count?: number;
}

interface ProjectPanelProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  userId: string;
  onProjectsChange?: () => void; // Update 1: onProjectsChange is now optional
}

export function ProjectPanel({
  projects,
  selectedProjectId,
  onSelectProject,
  userId,
  onProjectsChange,
}: ProjectPanelProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await deleteProject(projectId.toString(), userId);
      toast.success("Project deleted successfully");
      if (onProjectsChange) {
        // Update 2: Check if onProjectsChange is defined before calling
        onProjectsChange();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="w-72 border-r flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Projects</h2>
        <TwigsButton
          rightIcon={<Plus className="h-4 w-4" />}
          variant="ghost"
          size="md"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          New Project
        </TwigsButton>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {projects.map((project) => (
            <div
              style={{
                background:
                  selectedProjectId === project.id.toString()
                    ? "#E6F5F6"
                    : "transparent",
              }}
              key={project.id}
              className={`w-full text-left p-3 rounded-lg transition-colors `}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelectProject(project.id.toString())}
                  className="font-medium hover:underline"
                >
                  {project.name}
                </button>
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
                      onClick={() => handleEditProject(project)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>
                  Updated{" "}
                  {formatDistanceToNow(new Date(project.updated_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {project.content_count !== undefined && (
                <div className="text-xs text-muted-foreground mt-1">
                  {project.content_count} items
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        userId={userId}
        onSuccess={onProjectsChange}
      />
      <EditProjectDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        project={editingProject}
        userId={userId}
        onSuccess={onProjectsChange || (() => {})}
      />
    </div>
  );
}
