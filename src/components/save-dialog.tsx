"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { saveContent } from "@/app/lib/content";
import { toast } from "sonner";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  contentName?: string;
  contentTypeId?: number;
  userId?: string;
  onSave?: (contentName: string, contentType: string) => Promise<void>;
}

export function SaveDialog({
  open,
  onOpenChange,
  content,
  contentName: initialContentName = "",
  contentTypeId,
  userId,
  onSave,
}: SaveDialogProps) {
  const [contentName, setContentName] = useState(initialContentName);
  const [nameError, setNameError] = useState("");
  const [contentType, setContentType] = useState<string>("blog");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setContentName(initialContentName);
    }
  }, [open, initialContentName]);

  const validateContentName = (name: string) => {
    if (name.trim().length === 0) {
      setNameError("Content name is required");
      return false;
    }
    if (name.length > 100) {
      setNameError("Content name must be 100 characters or less");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateContentName(contentName)) {
      return;
    }

    try {
      setIsLoading(true);

      if (onSave) {
        await onSave(contentName, contentType);
      } else {
        // Legacy saving method - this will only be used if component is used in the old way
        // with contentTypeId and userId directly
        if (contentTypeId && userId) {
          await saveContent({
            name: contentName,
            content,
            user_id: userId,
            content_type_id: contentTypeId,
          });
          toast.success("Content saved successfully");
        }
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Content</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="contentName">Content Name *</Label>
            <Input
              id="contentName"
              value={contentName}
              onChange={(e) => {
                setContentName(e.target.value);
                validateContentName(e.target.value);
              }}
              placeholder="Enter a name for your content"
              disabled={isLoading}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger id="contentType">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="social">Social Media Post</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="ad">Advertisement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <TwigsButton
            size="md"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </TwigsButton>
          <TwigsButton
            size="md"
            onClick={handleSave}
            disabled={isLoading || !contentName.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </TwigsButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
