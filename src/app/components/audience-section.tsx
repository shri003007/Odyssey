"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import type { BlogFormValues } from "../lib/schema";
import { Input, Button } from "@sparrowengg/twigs-react";

export function AudienceSection() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BlogFormValues>();
  const [tagInput, setTagInput] = useState("");
  const audience = watch("audience") || [];
  const [isOpen, setIsOpen] = useState(true);

  const addTag = () => {
    if (tagInput && audience.length < 10) {
      setValue("audience", [...audience, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setValue(
      "audience",
      audience.filter((_, i) => i !== index)
    );
  };

  return (
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
        Target Audience
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="audience">Who is this content for?</Label>
          <div className="flex gap-2">
            <Input
              size="lg"
              id="audience"
              placeholder="Add audience tags"
              value={tagInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="max-w-xl"
            />
            <Button size="lg" type="button" onClick={addTag} variant="primary">
              Add
            </Button>
          </div>
          {errors.audience && (
            <p className="text-sm text-red-500">{errors.audience.message}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {audience.map((tag, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
