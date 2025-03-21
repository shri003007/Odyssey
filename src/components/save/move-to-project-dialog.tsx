import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserProjects, createProject } from "@/app/lib/projects";
import { updateContent } from "@/app/lib/content";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";

interface Project {
  id: number;
  name: string;
}

interface MoveToProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  userId: string;
  onSuccess: () => void;
}

export function MoveToProjectDialog({
  open,
  onOpenChange,
  contentId,
  userId,
  onSuccess,
}: MoveToProjectDialogProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      if (!userId) return;
      try {
        const projectsData = await getUserProjects(userId);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Failed to load projects");
      }
    };

    if (open) {
      loadProjects();
    }
  }, [userId, open]);

  const handleMoveContent = async () => {
    if (!selectedProject) return;

    try {
      setIsLoading(true);
      await updateContent(contentId, userId, {
        project_id: parseInt(selectedProject),
      });
      toast.success("Content moved successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error moving content:", error);
      toast.error("Failed to move content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAndMove = async () => {
    if (!newProjectName.trim()) return;

    try {
      setIsLoading(true);
      const newProject = await createProject({
        name: newProjectName,
        user_id: userId,
      });
      await updateContent(contentId, userId, { project_id: newProject.id });
      toast.success("Project created and content moved successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating project and moving content:", error);
      toast.error("Failed to create project and move content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move Content to Project</DialogTitle>
        </DialogHeader>
        {isCreatingProject ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newProjectName">New Project Name</Label>
              <Input
                id="newProjectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter new project name"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project">Select Project</Label>
              <Select
                value={selectedProject || undefined}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <DialogFooter>
          {isCreatingProject ? (
            <>
              <TwigsButton
                size="md"
                variant="outline"
                onClick={() => setIsCreatingProject(false)}
              >
                Cancel
              </TwigsButton>
              <TwigsButton
                size="md"
                onClick={handleCreateAndMove}
                loading={isLoading}
                disabled={isLoading || !newProjectName.trim()}
              >
                Create and Move
              </TwigsButton>
            </>
          ) : (
            <>
              <TwigsButton
                size="md"
                variant="outline"
                onClick={() => setIsCreatingProject(true)}
              >
                Create New Project
              </TwigsButton>
              <TwigsButton
                size="md"
                onClick={handleMoveContent}
                loading={isLoading}
                disabled={isLoading || !selectedProject}
              >
                Move Content
              </TwigsButton>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
