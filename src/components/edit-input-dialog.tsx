"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";

interface EditInputDialogProps {
  onSubmit: (input: string) => void;
  onClose: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export function EditInputDialog({
  onSubmit,
  onClose,
  parentRef,
}: EditInputDialogProps) {
  const [input, setInput] = React.useState("");
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const [dialogPosition, setDialogPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!dialogRef.current || !parentRef.current) return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const dialogRect = dialogRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Try positions in this order: right, left, bottom, top
    let x = 0;
    let y = 0;

    // Try right
    if (parentRect.right + dialogRect.width + 8 <= viewportWidth) {
      x = parentRect.width + 8;
      y = 0;
      console.log("[EditInputDialog] Positioning right");
    }
    // Try left
    else if (parentRect.left - dialogRect.width - 8 >= 0) {
      x = -dialogRect.width - 8;
      y = 0;
      console.log("[EditInputDialog] Positioning left");
    }
    // Try bottom
    else if (parentRect.bottom + dialogRect.height + 8 <= viewportHeight) {
      x = 0;
      y = parentRect.height + 8;
      console.log("[EditInputDialog] Positioning bottom");
    }
    // Default to top
    else {
      x = 0;
      y = -dialogRect.height - 8;
      console.log("[EditInputDialog] Positioning top");
    }

    console.log("[EditInputDialog] Final position:", { x, y });
    setDialogPosition({ x, y });
  }, [parentRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <motion.div
      ref={dialogRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={{
        position: "absolute",
        left: dialogPosition.x,
        top: dialogPosition.y,
        pointerEvents: "auto",
      }}
    >
      <Card className="w-[300px] p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter your edit instruction..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <TwigsButton
              type="button"
              variant="outline"
              color="error"
              onClick={onClose}
              size="md"
            >
              Cancel
            </TwigsButton>
            <TwigsButton
              color="primary"
              type="submit"
              variant="outline"
              disabled={!input.trim()}
              size="md"
            >
              Apply
            </TwigsButton>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
