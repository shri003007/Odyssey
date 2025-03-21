"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateProject } from "@/app/lib/projects";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Button as TwigsButton,
  Textarea,
  Input,
} from "@sparrowengg/twigs-react";

interface Project {
  id: number;
  name: string;
  description?: string;
}

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  userId: string;
  onSuccess: () => void;
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  userId,
  onSuccess,
}: EditProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !name.trim()) return;

    try {
      setIsLoading(true);
      await updateProject(project.id.toString(), userId, {
        name,
        description,
      });
      toast.success("Project updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                resize="none"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <TwigsButton
              size="md"
              type="submit"
              loading={isLoading}
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? <>Updating...</> : "Update Project"}
            </TwigsButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
