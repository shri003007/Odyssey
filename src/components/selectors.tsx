"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import type { blogFormSchema } from "@/app/lib/schema";
import type { z } from "zod";

interface ContentType {
  id: number;
  type_name: string;
  description: string | null;
  icon: string | null;
  value: string;
  is_default: boolean;
  profile_id: string | null;
  source: "default" | "custom";
}

type BlogFormValues = z.infer<typeof blogFormSchema> & {
  contentTypeId?: number;
};

interface SelectorsProps {
  selectedProfile: string | null;
}

export const Selectors: React.FC<SelectorsProps> = ({ selectedProfile }) => {
  const { setValue, watch } = useFormContext<BlogFormValues>();
  const currentMedium = watch("medium");
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileContentTypes = async (profileId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONTENT_TYPE_API}/content-types/profile/${profileId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile content types");
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching profile content types:", error);
      throw error;
    }
  };

  const fetchDefaultContentTypes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONTENT_TYPE_API}/content-types/default`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch default content types");
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching default content types:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadContentTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let types;
        if (selectedProfile) {
          types = await fetchProfileContentTypes(selectedProfile);
        } else {
          types = await fetchDefaultContentTypes();
        }
        setContentTypes(types);
      } catch (err) {
        setError("Failed to load content types");
        console.error("Error loading content types:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContentTypes();
  }, [selectedProfile]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex gap-4">
          <div className="h-10 w-[200px] animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-10 w-[200px] animate-pulse rounded-md bg-gray-200"></div>
        </div>
        <div className="h-4 w-[100%] animate-pulse rounded-md bg-gray-200"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <Select
          value={currentMedium || ""}
          onValueChange={(selectedValue) => {
            const selectedType = contentTypes.find(
              (type) => type.value === selectedValue
            );
            if (selectedType) {
              setValue("medium", selectedType.value);
              setValue("contentTypeId", selectedType.id, {
                shouldValidate: true,
              });
            }
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Medium" />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map((type) => (
              <SelectItem key={type.id} value={type.value}>
                {type.type_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="en-us">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-us">English (American)</SelectItem>
            <SelectItem value="en-gb">English (British)</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!currentMedium && (
        <p className="text-sm text-muted-foreground">
          Please select a medium to get started
        </p>
      )}
    </div>
  );
};
