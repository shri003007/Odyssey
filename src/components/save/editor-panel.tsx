"use client";

import { useEffect, useState, useRef } from "react";

import { X, Save } from "lucide-react";
import { EditorToolbar } from "../editor-toolbar";
import { TiptapEditor } from "../tiptap-editor";
import { getContentDetails, updateContent } from "@/app/lib/content";
import { getCurrentImage, generateImage } from "@/app/lib/images";
import { toast } from "sonner";
import { ImageGenerationManager } from "../image-generation-manager";
import type { Editor } from "@tiptap/core";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Button as TwigsButton,
  IconButton,
  Input,
} from "@sparrowengg/twigs-react";

interface EditorPanelProps {
  contentId: string;
  onClose: () => void;
  userId: string;
}

export function EditorPanel({ contentId, onClose, userId }: EditorPanelProps) {
  const [content, setContent] = useState("");
  const [contentName, setContentName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentImage, setCurrentImage] = useState<{
    id?: number;
    url: string;
    description: string;
    storagePath: string;
  } | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const [contentDetails, imageDetails] = await Promise.all([
          getContentDetails(contentId, userId),
          getCurrentImage(contentId).catch(() => null),
        ]);

        setContent(contentDetails.content);
        setContentName(contentDetails.name);
        if (imageDetails?.data) {
          setCurrentImage({
            id: imageDetails.data.id,
            url: imageDetails.data.url,
            description: imageDetails.data.generated_description,
            storagePath: imageDetails.data.storage_path,
          });
        }
      } catch (error) {
        console.error("Error loading content:", error);
        toast.error("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [contentId, userId]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateContent(contentId, userId, {
        name: contentName,
        content: content,
      });
      toast.success("Content updated successfully");
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("Failed to update content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateNewImage = async () => {
    try {
      setIsGenerating(true);
      const result = await generateImage(content);
      setCurrentImage({
        url: result.data.image_url,
        description: result.data.description,
        storagePath: result.data.storage_path,
      });
      setShowImageManager(true);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageDelete = async () => {
    setCurrentImage(null);
    setShowImageManager(false);
    // Remove image from editor content if it exists
    if (editorRef.current) {
      const editor = editorRef.current;
      editor
        .chain()
        .focus()
        .setContent(editor.getHTML().replace(/<img[^>]+>/g, ""))
        .run();
    }
  };

  if (isLoading) {
    return (
      <div className="w-1/2 border-l flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Skeleton className="h-10 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/2 border-l flex flex-col">
      <div className="flex items-center justify-between p-4 border-b gap-3">
        <Input
          value={contentName}
          onChange={(e) => setContentName(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <TwigsButton
            onClick={handleSave}
            disabled={isSaving}
            variant="outline"
            size="md"
            rightIcon={<Save className="h-4 w-4" />}
          >
            {isSaving ? "Saving..." : "Save"}
          </TwigsButton>
          <IconButton
            size="md"
            variant="outline"
            color="secondary"
            onClick={onClose}
            icon={<X className="h-4 w-4" />}
          />
        </div>
      </div>
      <EditorToolbar
        onFormatText={(format) => {
          const editor = editorRef.current;
          if (editor) {
            switch (format) {
              case "bold":
                editor.chain().focus().toggleBold().run();
                break;
              case "italic":
                editor.chain().focus().toggleItalic().run();
                break;
              case "underline":
                editor.chain().focus().toggleUnderline().run();
                break;
              case "strike":
                editor.chain().focus().toggleStrike().run();
                break;
              case "code":
                editor.chain().focus().toggleCode().run();
                break;
              case "highlight":
                editor.chain().focus().toggleHighlight().run();
                break;
              case "link":
                const url = window.prompt("Enter the URL");
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
                break;
              case "image":
                handleGenerateNewImage();
                break;
              case "bulletList":
                editor.chain().focus().toggleBulletList().run();
                break;
              case "orderedList":
                editor.chain().focus().toggleOrderedList().run();
                break;
              case "blockquote":
                editor.chain().focus().toggleBlockquote().run();
                break;
              case "h1":
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                break;
              case "h2":
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                break;
              case "h3":
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                break;
              case "alignLeft":
                editor.chain().focus().setTextAlign("left").run();
                break;
              case "alignCenter":
                editor.chain().focus().setTextAlign("center").run();
                break;
              case "alignRight":
                editor.chain().focus().setTextAlign("right").run();
                break;
              case "alignJustify":
                editor.chain().focus().setTextAlign("justify").run();
                break;
              default:
                break;
            }
          }
        }}
        editor={editorRef.current}
      />
      <div className="flex-1 overflow-y-auto">
        <TiptapEditor
          content={content}
          onUpdate={({ editor }) => {
            setContent(editor.getHTML());
          }}
          editorRef={editorRef}
          contentId={contentId}
        />
      </div>
      {showImageManager && currentImage && (
        <ImageGenerationManager
          image={currentImage}
          onConfirm={() => {
            if (editorRef.current) {
              editorRef.current
                .chain()
                .focus()
                .setImage({
                  src: currentImage.url,
                  alt: currentImage.description,
                })
                .run();
            }
            setShowImageManager(false);
          }}
          onCancel={() => setShowImageManager(false)}
          onRetry={handleGenerateNewImage}
          onDelete={handleImageDelete}
          isGenerating={isGenerating}
          isExisting={!!currentImage.id}
        />
      )}
    </div>
  );
}
