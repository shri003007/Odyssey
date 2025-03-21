"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";

import {
  ChevronRight,
  Loader2,
  Bold,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  ListTree,
  Info,
  ChevronDown,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { BlogFormValues } from "../lib/schema";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";

interface OutlineSectionProps {
  onGenerateOutline: () => void;
  isGeneratingOutline: boolean;
  generatedOutline: string | null;
  canProceed: boolean;
  getActionMessage: () => string;
}

export function OutlineSection({
  onGenerateOutline,
  isGeneratingOutline,
  generatedOutline,
  canProceed,
  getActionMessage,
}: OutlineSectionProps) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<BlogFormValues>();
  const [outlineContent, setOutlineContent] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList.configure(),
      OrderedList.configure(),
      ListItem.configure(),
    ],
    content: outlineContent,
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      setOutlineContent(updatedContent);
      setValue("outline", updatedContent, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (generatedOutline && editor) {
      // Convert the HTML string to proper heading structure
      const cleanedContent = generatedOutline
        .replace(/<p># /g, "<h1>") // Convert # to h1
        .replace(/<p>## /g, "<h2>") // Convert ## to h2
        .replace(/<p>### /g, "<h3>") // Convert ### to h3
        .replace(/<\/p>/g, "</h1>") // Close heading tags
        .replace(/<p><\/p>/g, "") // Remove empty paragraphs
        .replace(/\n/g, ""); // Remove newlines

      editor.commands.setContent(cleanedContent);
      setValue("outline", generatedOutline);
    }
  }, [generatedOutline, editor, setValue]);

  return (
    <div className="flex flex-col h-full">
      <Collapsible
        defaultOpen
        className="space-y-2"
        onOpenChange={(open) => setIsOpen(open)}
      >
        <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold w-full">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform" />
          )}
          Outline
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="outline">Content outline</Label>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {canProceed
                        ? "Generate an outline based on your topic and selected medium"
                        : getActionMessage()}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TwigsButton
                  size="lg"
                  rightIcon={
                    isGeneratingOutline ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ListTree className="h-4 w-4 mr-2" />
                    )
                  }
                  onClick={onGenerateOutline}
                  disabled={!canProceed || isGeneratingOutline}
                  variant={canProceed ? "default" : "secondary"}
                >
                  Generate Outline
                </TwigsButton>
              </div>
            </div>
            <div className="flex items-center gap-1 p-2 border-b">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleBold().run();
                }}
                className={editor?.isActive("bold") ? "bg-muted" : ""}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleHeading({ level: 1 }).run();
                }}
                className={
                  editor?.isActive("heading", { level: 1 }) ? "bg-muted" : ""
                }
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleHeading({ level: 2 }).run();
                }}
                className={
                  editor?.isActive("heading", { level: 2 }) ? "bg-muted" : ""
                }
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleHeading({ level: 3 }).run();
                }}
                className={
                  editor?.isActive("heading", { level: 3 }) ? "bg-muted" : ""
                }
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleHeading({ level: 4 }).run();
                }}
                className={
                  editor?.isActive("heading", { level: 4 }) ? "bg-muted" : ""
                }
              >
                <Heading4 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleHeading({ level: 5 }).run();
                }}
                className={
                  editor?.isActive("heading", { level: 5 }) ? "bg-muted" : ""
                }
              >
                <Heading5 className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleBulletList().run();
                }}
                className={editor?.isActive("bulletList") ? "bg-muted" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  editor?.chain().focus().toggleOrderedList().run();
                }}
                className={editor?.isActive("orderedList") ? "bg-muted" : ""}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[300px] border rounded-md bg-background">
              <div className="flex-1 overflow-y-auto p-4">
                <EditorContent
                  editor={editor}
                  className="outline-editor-content"
                />
              </div>
            </ScrollArea>
            {errors.outline && (
              <p className="text-sm text-red-500">{errors.outline.message}</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default OutlineSection;
