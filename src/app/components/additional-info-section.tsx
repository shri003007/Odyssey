"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { BlogFormValues } from "../lib/schema";
import { useState } from "react";
import { Button as TwigsButton } from "@sparrowengg/twigs-react";

interface InfoPair {
  key: string;
  value: string;
}

export function AdditionalInfoSection() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BlogFormValues>();
  const additionalInfo = watch("additionalInfo") || [];
  const [isOpen, setIsOpen] = useState(true);

  const addInfoPair = () => {
    setValue("additionalInfo", [...additionalInfo, { key: "", value: "" }]);
  };

  const removeInfoPair = (index: number) => {
    setValue(
      "additionalInfo",
      additionalInfo.filter((_, i) => i !== index)
    );
  };

  const updateInfoPair = (
    index: number,
    field: keyof InfoPair,
    value: string
  ) => {
    const newInfo = [...additionalInfo];
    newInfo[index] = { ...newInfo[index], [field]: value };
    setValue("additionalInfo", newInfo);
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
        Additional Information
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        <div className="space-y-4">
          <Label>Additional context for the blog post</Label>
          {additionalInfo.map((info, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Key (e.g., industryFocus)"
                value={info.key}
                onChange={(e) => updateInfoPair(index, "key", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g., B2B SaaS)"
                value={info.value}
                onChange={(e) => updateInfoPair(index, "value", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeInfoPair(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {errors.additionalInfo && (
            <p className="text-sm text-red-500">
              {errors.additionalInfo.message}
            </p>
          )}
          <TwigsButton
            type="button"
            variant="outline"
            onClick={addInfoPair}
            size="lg"
            css={{
              width: "100%",
            }}
          >
            Add Information
          </TwigsButton>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
