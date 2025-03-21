"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { BlogFormValues } from "../lib/schema";
import { useState } from "react";
import { Textarea } from "@sparrowengg/twigs-react";

export function TopicSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BlogFormValues>();
  const [isOpen, setIsOpen] = useState(true);

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
        Topic
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">What would you like to write about?</Label>
          <Textarea
            requiredIndicator
            resize="none"
            id="topic"
            placeholder="Enter your topic here"
            {...register("topic")}
            className="min-h-[100px]"
          />
          {errors.topic && (
            <p className="text-sm text-red-500">{errors.topic.message}</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
