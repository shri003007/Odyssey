"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, RefreshCw, Download, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteImage } from "@/app/lib/images";

interface ImageGenerationManagerProps {
  image: {
    id?: number; // Optional for new images
    url: string;
    description: string;
    storagePath: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  onRetry: () => void;
  onDelete?: () => void;
  isGenerating: boolean;
  isExisting?: boolean;
}

export function ImageGenerationManager({
  image,
  onConfirm,
  onCancel,
  onRetry,
  onDelete,
  isGenerating,
  isExisting = false,
}: ImageGenerationManagerProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-image.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const handleDelete = async () => {
    if (!image.id || !onDelete) return;
    try {
      await deleteImage(image.id);
      onDelete();
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleConfirm = () => {
    console.log("Confirming image:", image);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-6 space-y-4">
        {isGenerating ? (
          <>
            <div className="relative w-full aspect-video bg-muted animate-pulse rounded-lg flex items-center justify-center">
              <RefreshCw className="h-10 w-10 text-muted-foreground animate-spin" />
            </div>
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
          </>
        ) : (
          <>
            <div className="relative">
              <Image
                src={image.url}
                alt={image.description || "Generated image"}
                width={800}
                height={600}
                className="w-full rounded-lg"
                priority
                quality={100}
                unoptimized={image.url.startsWith("data:")}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {!isExisting && (
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleConfirm}
                    disabled={isGenerating}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={onRetry}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleDownload}
                  disabled={isGenerating}
                >
                  <Download className="h-4 w-4" />
                </Button>
                {isExisting && onDelete ? (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isGenerating}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isGenerating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{image.description}</p>
          </>
        )}
      </Card>
    </div>
  );
}
