"use client";

import * as React from "react";
import TurndownService from "turndown";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Image,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Copy,
  Highlighter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";

interface HeadingOptions {
  level?: number;
}

interface EditorToolbarProps {
  onFormatText: (format: string) => void;
  editor: Editor | null;
}

export function EditorToolbar({ onFormatText, editor }: EditorToolbarProps) {
  const handleCopy = async () => {
    if (!editor) {
      console.error("No editor instance");
      return;
    }

    try {
      const htmlContent = editor.getHTML();
      const turndownService = new TurndownService();
      const markdownContent = turndownService.turndown(htmlContent);
      await navigator.clipboard.writeText(markdownContent);
    } catch (err) {
      console.error("Failed to copy markdown: ", err);
    }
  };

  const isEditorActive = (format: string, options?: HeadingOptions) => {
    if (!editor?.isActive) return false;
    try {
      if (format === "heading") {
        return editor.isActive("heading", options || {});
      }
      if (format.startsWith("align")) {
        return editor.isActive({
          textAlign: format.replace("align", "").toLowerCase(),
        });
      }
      return editor.isActive(format);
    } catch (error) {
      console.error(`Error checking if ${format} is active:`, error);
      return false;
    }
  };

  const ToolbarButton = ({
    icon: Icon,
    format,
    isActive,
    tooltip,
  }: {
    icon: React.ElementType;
    format: string;
    isActive?: boolean;
    tooltip?: string;
  }) => (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      onClick={() => onFormatText(format)}
      className={`h-9 w-9 p-0 rounded-md transition-all duration-200 ${
        isActive
          ? "bg-[#00828D] text-white shadow-sm hover:bg-[#00828D]/80"
          : "text-gray-700 dark:text-gray-300 hover:bg-[#E6F5F6] dark:hover:bg-indigo-900/30"
      }`}
      disabled={!editor}
      title={tooltip || format}
      aria-label={tooltip || format}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex items-center justify-between gap-2 py-2 px-3 border-b bg-gradient-to-b from-white to-indigo-50/50 dark:from-gray-900 dark:to-indigo-950/20 sticky top-0 z-10 shadow-sm overflow-x-auto">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 border-r border-indigo-200 dark:border-indigo-800/30 pr-2 mr-2">
          <ToolbarButton
            icon={Bold}
            format="bold"
            isActive={isEditorActive("bold")}
            tooltip="Bold"
          />
          <ToolbarButton
            icon={Italic}
            format="italic"
            isActive={isEditorActive("italic")}
            tooltip="Italic"
          />
          <ToolbarButton
            icon={Underline}
            format="underline"
            isActive={isEditorActive("underline")}
            tooltip="Underline"
          />
          <ToolbarButton
            icon={Strikethrough}
            format="strike"
            isActive={isEditorActive("strike")}
            tooltip="Strikethrough"
          />
        </div>

        <div className="flex items-center gap-1 border-r border-indigo-00 dark:border-indigo-800/30 pr-2 mr-2">
          <ToolbarButton
            icon={Code}
            format="code"
            isActive={isEditorActive("code")}
            tooltip="Code"
          />
          <ToolbarButton
            icon={Highlighter}
            format="highlight"
            isActive={isEditorActive("highlight")}
            tooltip="Highlight"
          />
          <ToolbarButton
            icon={Link}
            format="link"
            isActive={isEditorActive("link")}
            tooltip="Link"
          />
          <ToolbarButton icon={Image} format="image" tooltip="Image" />
        </div>

        <div className="flex items-center gap-1 border-r border-indigo-200 dark:border-indigo-800/30 pr-2 mr-2">
          <ToolbarButton
            icon={List}
            format="bulletList"
            isActive={isEditorActive("bulletList")}
            tooltip="Bullet List"
          />
          <ToolbarButton
            icon={ListOrdered}
            format="orderedList"
            isActive={isEditorActive("orderedList")}
            tooltip="Ordered List"
          />
          <ToolbarButton
            icon={Quote}
            format="blockquote"
            isActive={isEditorActive("blockquote")}
            tooltip="Quote"
          />
        </div>

        <div className="flex items-center gap-1 border-r border-indigo-200 dark:border-indigo-800/30 pr-2 mr-2">
          <ToolbarButton
            icon={Heading1}
            format="h1"
            isActive={isEditorActive("heading", { level: 1 })}
            tooltip="Heading 1"
          />
          <ToolbarButton
            icon={Heading2}
            format="h2"
            isActive={isEditorActive("heading", { level: 2 })}
            tooltip="Heading 2"
          />
          <ToolbarButton
            icon={Heading3}
            format="h3"
            isActive={isEditorActive("heading", { level: 3 })}
            tooltip="Heading 3"
          />
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={AlignLeft}
            format="alignLeft"
            isActive={isEditorActive("alignLeft")}
            tooltip="Align Left"
          />
          <ToolbarButton
            icon={AlignCenter}
            format="alignCenter"
            isActive={isEditorActive("alignCenter")}
            tooltip="Align Center"
          />
          <ToolbarButton
            icon={AlignRight}
            format="alignRight"
            isActive={isEditorActive("alignRight")}
            tooltip="Align Right"
          />
          <ToolbarButton
            icon={AlignJustify}
            format="alignJustify"
            isActive={isEditorActive("alignJustify")}
            tooltip="Justify"
          />
        </div>
      </div>
      <TwigsButton
        rightIcon={<Copy className="h-4 w-4 ml-1" />}
        variant="ghost"
        size="md"
        css={{
          whiteSpace: "nowrap",
        }}
        onClick={handleCopy}
        disabled={!editor}
      >
        Copy as Markdown
      </TwigsButton>
    </div>
  );
}
