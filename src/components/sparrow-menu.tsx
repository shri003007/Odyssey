"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Sparkles,
  Palette,
  ArrowLeftRight,
  Type,
  Edit2,
  ChevronRight,
} from "lucide-react";
import {
  improveWriting,
  changeTone,
  adjustLength,
  simplifyLanguage,
  editSelection,
} from "@/lib/api";
import { EditInputDialog } from "./edit-input-dialog";
import { toast } from "sonner";
import { calculateOptimalPosition } from "@/lib/menu-position";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";

const MENU_OPTIONS = {
  tone: {
    icon: Palette,
    label: "Change Tone",
    options: ["Professional", "Casual", "Friendly", "Formal", "Enthusiastic"],
  },
  length: {
    icon: ArrowLeftRight,
    label: "Adjust Length",
    options: ["Shorter", "Longer", "Concise"],
  },
};

interface SparrowMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onUpdateContent: (newContent: string) => void;
  fullContent: string;
  position: { x: number; y: number };
}

export function SparrowMenu({
  isOpen,
  onClose,
  selectedText,
  onUpdateContent,
  fullContent,
  position,
}: SparrowMenuProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [showEditInput, setShowEditInput] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState("");
  const [currentOperation, setCurrentOperation] = React.useState("");
  const menuRef = React.useRef<HTMLDivElement>(null);
  const submenuRef = React.useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = React.useState(position);
  const [submenuPosition, setSubmenuPosition] = React.useState({ x: 0, y: 0 });
  const [resultPosition, setResultPosition] = React.useState({ x: 0, y: 0 });
  const resultRef = React.useRef<HTMLDivElement>(null);

  // Handle cleanup when menu closes
  React.useEffect(() => {
    if (!isOpen) {
      console.log("[SparrowMenu] Menu closed, cleaning up state");
      setActiveMenu(null);
      setShowEditInput(false);
      setShowConfirmation(false);
      setGeneratedContent("");
      setCurrentOperation("");
    }
  }, [isOpen]);

  // Handle click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if clicking on the dialog or its children
      const dialogElement = document.querySelector('[role="dialog"]');
      if (dialogElement && dialogElement.contains(event.target as Node)) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log("[SparrowMenu] Click outside detected, closing menu");
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Update position when menu opens or window resizes
  React.useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const updatePosition = () => {
      const selection = window.getSelection();
      const editorElement = document.querySelector(".tiptap-editor");

      if (selection?.rangeCount && editorElement) {
        const range = selection.getRangeAt(0);
        const targetRect = range.getBoundingClientRect();
        const menuDimensions = {
          width: menuRef.current!.offsetWidth,
          height: menuRef.current!.offsetHeight,
        };

        // Ensure menu stays within viewport boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = targetRect.left;
        let y = targetRect.bottom + 10; // 10px gap below selection

        // Check if menu would go off right edge
        if (x + menuDimensions.width > viewportWidth) {
          x = Math.max(0, viewportWidth - menuDimensions.width - 10);
        }

        // Check if menu would go off bottom edge
        if (y + menuDimensions.height > viewportHeight) {
          // Try positioning above selection
          if (targetRect.top - menuDimensions.height - 10 >= 0) {
            y = targetRect.top - menuDimensions.height - 10;
          } else {
            // If not enough space above, position at bottom of viewport with some padding
            y = Math.max(0, viewportHeight - menuDimensions.height - 10);
          }
        }

        setMenuPosition({ x, y });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isOpen]);

  // Calculate and update submenu position when opened
  React.useEffect(() => {
    if (!activeMenu || !menuRef.current || !submenuRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const submenuRect = submenuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Try positions in this order: right, left, bottom, top
    let x = 0;
    let y = 0;

    // Try right
    if (menuRect.right + submenuRect.width + 8 <= viewportWidth) {
      x = menuRect.width + 8; // 8px gap
      y = 0;
    }
    // Try left
    else if (menuRect.left - submenuRect.width - 8 >= 0) {
      x = -submenuRect.width - 8;
      y = 0;
    }
    // Try bottom
    else if (menuRect.bottom + submenuRect.height + 8 <= viewportHeight) {
      x = 0;
      y = menuRect.height + 8;
    }
    // Default to top
    else {
      x = 0;
      y = -submenuRect.height - 8;
    }

    console.log("[SparrowMenu] Positioning submenu:", { x, y });
    setSubmenuPosition({ x, y });
  }, [activeMenu]);

  // Calculate position for the result panel when content is generated
  React.useEffect(() => {
    if (!showConfirmation || !menuRef.current || !resultRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const resultRect = resultRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Try positions in this order: right, left, bottom, top
    let x = 0;
    let y = 0;

    // Try right
    if (menuRect.right + resultRect.width + 16 <= viewportWidth) {
      x = menuRect.width + 16; // 16px gap
      y = 0;
    }
    // Try left
    else if (menuRect.left - resultRect.width - 16 >= 0) {
      x = -resultRect.width - 16;
      y = 0;
    }
    // Try bottom
    else if (menuRect.bottom + resultRect.height + 16 <= viewportHeight) {
      x = 0;
      y = menuRect.height + 16;
    }
    // Default to top
    else {
      x = 0;
      y = -resultRect.height - 16;
    }

    console.log("[SparrowMenu] Positioning result:", { x, y });
    setResultPosition({ x, y });
  }, [showConfirmation, generatedContent]);

  // Add this function to reset all menu states
  const resetMenuState = () => {
    setShowConfirmation(false);
    setGeneratedContent("");
  };

  const handleImproveWriting = async () => {
    resetMenuState(); // Reset menu state before starting new operation
    setIsLoading(true);
    setCurrentOperation("Improve Writing");
    try {
      const response = await improveWriting(fullContent, selectedText);
      if (response.status === "success" && response.content) {
        setGeneratedContent(response.content);
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to improve writing");
    }
    setIsLoading(false);
  };

  const handleSimplifyLanguage = async () => {
    resetMenuState(); // Reset menu state before starting new operation
    setIsLoading(true);
    setCurrentOperation("Simplify Language");
    try {
      const response = await simplifyLanguage(fullContent, selectedText);
      if (response.status === "success" && response.content) {
        setGeneratedContent(response.content);
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to simplify language");
    }
    setIsLoading(false);
  };

  const handleOptionSelect = async (option: string, type: string) => {
    resetMenuState(); // Reset menu state before starting new operation
    setIsLoading(true);
    setCurrentOperation(
      `${type === "tone" ? "Change Tone" : "Adjust Length"}: ${option}`
    );
    try {
      let response;
      switch (type) {
        case "tone":
          response = await changeTone(
            fullContent,
            selectedText,
            option.toLowerCase()
          );
          break;
        case "length":
          response = await adjustLength(
            fullContent,
            selectedText,
            option.toLowerCase()
          );
          break;
        default:
          return;
      }

      if (response?.status === "success" && response.content) {
        setGeneratedContent(response.content);
        setShowConfirmation(true);
        setActiveMenu(null);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Failed to ${type === "tone" ? "change tone" : "adjust length"}`
      );
    }
    setIsLoading(false);
  };

  const handleEditSelection = async (userInput: string) => {
    resetMenuState(); // Reset menu state before starting new operation
    setIsLoading(true);
    setCurrentOperation("Edit Selection");
    try {
      const response = await editSelection(
        fullContent,
        selectedText,
        userInput
      );
      if (response.status === "invalid_request") {
        toast.error(response.message);
      } else if (response.status === "success" && response.content) {
        setGeneratedContent(response.content);
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process edit request");
    }
    setIsLoading(false);
    setShowEditInput(false);
  };

  // Handle menu item selection
  const handleMenuItemSelect = (menuKey: string) => {
    resetMenuState(); // Reset menu state before opening submenu
    if (activeMenu === menuKey) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuKey);
    }
  };

  const handleConfirmUpdate = () => {
    onUpdateContent(generatedContent);
    setShowConfirmation(false);
    onClose();
  };

  const handleRejectUpdate = () => {
    setShowConfirmation(false);
    setGeneratedContent("");
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed left-0 top-0 z-50"
      style={{
        transform: `translate3d(${menuPosition.x}px, ${menuPosition.y}px, 0)`,
        visibility: menuRef.current ? "visible" : "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        style={{ pointerEvents: "auto" }}
      >
        <Card className="w-[220px] shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
          <Command>
            <CommandList className="p-2">
              <CommandGroup>
                <CommandItem
                  onSelect={handleImproveWriting}
                  disabled={isLoading}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 my-1"
                >
                  <Sparkles className="mr-2 h-4 w-4 flex-shrink-0 text-blue-500" />
                  <span className="whitespace-normal break-words">Improve Writing</span>
                </CommandItem>
                <CommandItem
                  onSelect={handleSimplifyLanguage}
                  disabled={isLoading}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 my-1"
                >
                  <Type className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="whitespace-normal break-words">Simplify Language</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    resetMenuState();
                    setShowEditInput(true);
                  }}
                  disabled={isLoading}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 my-1"
                >
                  <Edit2 className="mr-2 h-4 w-4 flex-shrink-0 text-purple-500" />
                  <span className="whitespace-normal break-words">Edit Selection</span>
                </CommandItem>
                {Object.entries(MENU_OPTIONS).map(
                  ([key, { icon: Icon, label }]) => (
                    <CommandItem
                      key={key}
                      onSelect={() => handleMenuItemSelect(key)}
                      className="justify-between hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 my-1"
                      disabled={isLoading}
                    >
                      <div className="flex items-center overflow-hidden">
                        <Icon className={`mr-2 h-4 w-4 flex-shrink-0 ${key === 'tone' ? 'text-amber-500' : 'text-cyan-500'}`} />
                        <span className="whitespace-normal break-words">{label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 ml-2" />
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </Card>
      </motion.div>

      <AnimatePresence>
        {activeMenu && (
          <motion.div
            ref={submenuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              left: submenuPosition.x,
              top: submenuPosition.y,
              pointerEvents: "auto",
            }}
          >
            <Card className="w-[220px] shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
              <Command>
                <CommandList className="p-2">
                  <CommandGroup>
                    {MENU_OPTIONS[
                      activeMenu as keyof typeof MENU_OPTIONS
                    ].options.map((option) => (
                      <CommandItem
                        key={option}
                        onSelect={() => handleOptionSelect(option, activeMenu)}
                        disabled={isLoading}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 my-1"
                      >
                        <span className="whitespace-normal break-words">{option}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditInput && (
          <EditInputDialog
            onSubmit={handleEditSelection}
            onClose={() => setShowEditInput(false)}
            parentRef={menuRef}
          />
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              left: resultPosition.x,
              top: resultPosition.y,
              pointerEvents: "auto",
            }}
            className="w-[350px] max-w-[80vw]"
          >
            <Card className="shadow-xl rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm">{currentOperation}</h3>
                </div>
                <div
                  className="max-h-[200px] overflow-y-auto border rounded-md p-3 mb-3 text-sm prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: generatedContent }}
                />
                <div className="flex justify-end gap-2">
                  <TwigsButton
                    variant="outline"
                    size="sm"
                    color="secondary"
                    onClick={handleRejectUpdate}
                  >
                    Cancel
                  </TwigsButton>
                  <TwigsButton
                    variant="outline"
                    size="sm"
                    onClick={handleConfirmUpdate}
                  >
                    Apply
                  </TwigsButton>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
