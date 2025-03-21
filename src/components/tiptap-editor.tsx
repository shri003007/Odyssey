"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Markdown } from "tiptap-markdown";
import { generateImage, saveContentImage } from "@/app/lib/images";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { SparrowMenu } from "./sparrow-menu";
import { ImageGenerationManager } from "./image-generation-manager";
import { Editor } from "@tiptap/core";
import React from "react";

interface TiptapEditorProps {
  content: string;
  onUpdate: ({ editor }: { editor: Editor }) => void;
  editorRef: React.MutableRefObject<Editor | null>; // Correct ref type
  contentId?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onUpdate,
  editorRef,
  contentId,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{
    url: string;
    description: string;
    storagePath: string;
  } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const lastSelectionRef = React.useRef<string>("");
  const [isSelecting, setIsSelecting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: "Content will appear here...",
      }),
      Highlight,
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Markdown,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content,
    onUpdate,
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[300px] p-4",
      },
    },
    enableCoreExtensions: true,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editorRef) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (editor && editor.view.dom.contains(e.target as Node)) {
        setIsSelecting(true);

        setIsMenuOpen(false);
      }
    };

    const handleMouseUp = () => {
      // When mouse is released, selection is complete
      if (isSelecting) {
        setIsSelecting(false);

        // Get the current selection after mouse up
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim();

        // Only open menu if there's actual text selected within the editor
        if (
          selectedText &&
          editor &&
          selection?.anchorNode &&
          editor.view.dom.contains(selection.anchorNode)
        ) {
          console.log("[TiptapEditor] Selection completed:", selectedText);

          lastSelectionRef.current = selectedText;

          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Position calculation
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const menuHeight = 250;
            const menuWidth = 300;
            const margin = 10;

            let xPos = rect.left + rect.width / 2 - menuWidth / 2;
            xPos = Math.max(
              margin,
              Math.min(xPos, viewportWidth - menuWidth - margin)
            );

            let yPos = rect.bottom + margin;
            if (yPos + menuHeight > viewportHeight) {
              yPos = rect.top - menuHeight - margin;
            }
            if (yPos < 0) {
              yPos = margin;
            }

            setMenuPosition({ x: xPos, y: yPos });
            setSelectedText(selectedText);
            setIsMenuOpen(true);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [editor, isSelecting]);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menuElement = document.querySelector(".sparrow-menu");
      const editorElement = editor?.view.dom;

      // Close menu if clicking outside menu and editor
      if (
        menuElement &&
        !menuElement.contains(e.target as Node) &&
        editorElement &&
        !editorElement.contains(e.target as Node) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
        setSelectedText("");
        lastSelectionRef.current = "";
      }
    };

    // Use mousedown to detect clicks before they're processed
    document.addEventListener("mousedown", handleClickOutside);

    // Also handle escape key to close menu
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        setSelectedText("");
        lastSelectionRef.current = "";
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, editor]);

  const handleGenerateImage = async () => {
    if (!editor || !editor.getText().trim()) {
      toast.error("Please add some content before generating an image");
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generateImage(editor.getText());
      setGeneratedImage({
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

  const handleImageConfirm = async () => {
    if (!generatedImage || !editor) return;

    try {
      if (contentId) {
        await saveContentImage(contentId, {
          storage_path: generatedImage.storagePath,
          description: generatedImage.description,
          image_url: generatedImage.url,
        });
      }

      editor
        .chain()
        .focus()
        .setImage({
          src: generatedImage.url,
          alt: generatedImage.description,
        })
        .run();

      toast.success("Image inserted successfully");
      setShowImageManager(false);
      setGeneratedImage(null);
    } catch (error) {
      console.error("Error handling image:", error);
      toast.error("Failed to handle image");
    }
  };

  const handleImageCancel = () => {
    setShowImageManager(false);
    setGeneratedImage(null);
  };

  const handleImageRetry = () => {
    handleGenerateImage();
  };

  const handleUpdateContent = useCallback(
    (newContent: string) => {
      if (editor) {
        editor.commands.insertContent(newContent);
      }
    },
    [editor]
  );

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className="tiptap-editor prose max-w-none min-h-[300px] p-4 
          [&>*]:mb-4 
          [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:border-b [&>h1]:pb-2
          [&>h2]:text-3xl [&>h2]:font-semibold
          [&>h3]:text-2xl [&>h3]:font-medium
          [&>h4]:text-xl [&>h4]:font-medium
          [&>h5]:text-lg [&>h5]:font-medium
          [&>h6]:text-base [&>h6]:font-medium
          [&>ul]:list-disc [&>ul]:pl-5
          [&>ol]:list-decimal [&>ol]:pl-5
          [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic
          [&>pre]:bg-gray-100 [&>pre]:p-2 [&>pre]:rounded
          [&>p]:text-base
          [&>*]:leading-relaxed
          [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-4
        "
      />

      {showImageManager && generatedImage && (
        <ImageGenerationManager
          image={generatedImage}
          onConfirm={handleImageConfirm}
          onCancel={handleImageCancel}
          onRetry={handleImageRetry}
          isGenerating={isGenerating}
        />
      )}
      <SparrowMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        selectedText={selectedText}
        onUpdateContent={handleUpdateContent}
        fullContent={editor?.getHTML() || ""}
        position={menuPosition}
      />
    </div>
  );
};
