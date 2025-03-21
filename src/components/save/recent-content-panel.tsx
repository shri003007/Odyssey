"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@sparrowengg/twigs-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MoreVertical,
  FileText,
  Calendar,
  Mail,
  Loader2,
  Filter,
  Edit,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  getUserContent,
  searchContent,
  deleteContent,
  ContentType,
  getContentTypes,
} from "@/app/lib/content";
import { toast } from "sonner";
import { MoveToProjectDialog } from "./move-to-project-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";

interface Content {
  id: number;
  name: string;
  content: string;
  content_type_id: number;
  project_id?: number;
  project_name?: string;
  created_at: string;
  updated_at: string;
  word_count?: number;
}

interface RecentContentPanelProps {
  userId: string;

  selectedItems: string[];

  onSelectItems: React.Dispatch<React.SetStateAction<string[]>>;

  onSelectContent: React.Dispatch<React.SetStateAction<string | null>>;
}

export function RecentContentPanel({
  userId,
  onSelectContent,
}: RecentContentPanelProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [contentType, setContentType] = useState<string>("all");
  const [isMoveToProjectDialogOpen, setIsMoveToProjectDialogOpen] =
    useState(false);
  const [selectedContentForMove, setSelectedContentForMove] = useState<
    string | null
  >(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchContentTypes = async () => {
      try {
        const types = await getContentTypes();
        setContentTypes(types);
      } catch (error) {
        console.error("Error fetching content types:", error);
        toast.error("Failed to load content types");
      }
    };

    fetchContentTypes();
  }, []);

  const loadContents = useCallback(
    async (pageNum: number) => {
      if (!userId) return;
      try {
        setIsLoading(true);
        let result;
        if (searchQuery || contentType !== "all") {
          result = await searchContent(
            userId,
            searchQuery,
            contentType !== "all" ? contentType : undefined
          );
        } else {
          result = await getUserContent(userId, undefined, pageNum, 20);
        }
        if (pageNum === 1) {
          setContents(result);
        } else {
          setContents((prev) => [...prev, ...result]);
        }
        setHasMore(result.length === 20);
      } catch (error) {
        console.error("Error loading contents:", error);
        toast.error("Failed to load contents");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, searchQuery, contentType]
  );

  const lastContentElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    setPage(1);
    loadContents(1);
  }, [userId, contentType, searchQuery, loadContents]);

  useEffect(() => {
    if (page > 1) {
      loadContents(page);
    }
  }, [page, loadContents]);

  const getContentTypeIcon = (typeId: number) => {
    switch (typeId) {
      case 1:
        return <FileText className="h-4 w-4" />;
      case 2:
        return <Calendar className="h-4 w-4" />;
      case 3:
        return <Mail className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeName = (typeId: number) => {
    const contentType = contentTypes.find((type) => type.id === typeId);
    return contentType ? contentType.type_name : "Unknown";
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await deleteContent(contentId, userId);
      setContents(
        contents.filter((content) => content.id.toString() !== contentId)
      );
      toast.success("Content deleted successfully");
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };

  const confirmDelete = (contentId: string) => {
    setContentToDelete(contentId);
    setIsDeleteDialogOpen(true);
  };

  const handleMoveToProject = (contentId: string) => {
    setSelectedContentForMove(contentId);
    setIsMoveToProjectDialogOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Input
              size="md"
              css={{
                width: "fill-available",
              }}
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {contentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.type_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="rounded-lg border">
            <div className="border-b px-4 py-3 flex items-center gap-4">
              <span className="font-medium">Name</span>
            </div>
            {contents.map((content, index) => (
              <div
                key={content.id}
                ref={
                  index === contents.length - 1 ? lastContentElementRef : null
                }
                className="px-4 py-3 flex items-center gap-4 border-b last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[200px]">
                    {getContentTypeIcon(content.content_type_id)}
                    <button
                      onClick={() => onSelectContent(content.id.toString())}
                      className="font-medium hover:underline text-left"
                    >
                      {content.name}
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getContentTypeName(content.content_type_id)}
                  </span>
                  {content.project_name && (
                    <span className="text-sm text-muted-foreground">
                      {content.project_name}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Updated{" "}
                    {formatDistanceToNow(new Date(content.updated_at), {
                      addSuffix: true,
                    })}
                  </span>
                  {content.word_count && (
                    <span className="text-sm text-muted-foreground">
                      {content.word_count} words
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSelectContent(content.id.toString())}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onSelectContent(content.id.toString())}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleMoveToProject(content.id.toString())}
                    >
                      Move to Project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => confirmDelete(content.id.toString())}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
          {isLoading && (
            <div ref={loadingRef} className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {!isLoading && !hasMore && contents.length > 0 && (
            <div className="text-center py-4 text-muted-foreground">
              End of list
            </div>
          )}
          {!isLoading && contents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No content found</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <MoveToProjectDialog
        open={isMoveToProjectDialogOpen}
        onOpenChange={setIsMoveToProjectDialogOpen}
        contentId={selectedContentForMove || ""}
        userId={userId}
        onSuccess={() => {
          loadContents(1);
          setIsMoveToProjectDialogOpen(false);
          setSelectedContentForMove(null);
        }}
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <TwigsButton
              size="md"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </TwigsButton>
            <TwigsButton
              variant="solid"
              color="error"
              size="md"
              onClick={() => {
                if (contentToDelete) {
                  handleDeleteContent(contentToDelete);
                  setContentToDelete(null);
                }
              }}
            >
              Delete
            </TwigsButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
