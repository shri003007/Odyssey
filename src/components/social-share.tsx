"use client";

import { useState } from "react";
import { Share2, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import { useSocialIntegration } from "@/context/social-integration-provider";
import { useRouter } from "next/navigation";
import { Button as TwigsButton, Textarea } from "@sparrowengg/twigs-react";

interface SocialShareProps {
  content: string;
  title?: string;
}

export function SocialShare({ content, title }: SocialShareProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(content.substring(0, 280));
  const { toast } = useToast();
  const router = useRouter();
  const { linkedinConnected, twitterConnected } = useSocialIntegration();

  const handleShare = (platform: "linkedin" | "twitter") => {
    if (platform === "linkedin" && !linkedinConnected) {
      toast({
        title: "LinkedIn Not Connected",
        description:
          "Please connect your LinkedIn account in the Integrations page first.",
        variant: "destructive",
      });

      setOpen(false);
      router.push("/integrations");
      return;
    }

    if (platform === "twitter" && !twitterConnected) {
      toast({
        title: "Twitter Not Connected",
        description:
          "Please connect your Twitter account in the Integrations page first.",
        variant: "destructive",
      });

      setOpen(false);
      router.push("/integrations");
      return;
    }

    // In a real implementation, this would use the respective APIs to post content
    toast({
      title: "Shared Successfully",
      description: `Your content has been shared to ${
        platform === "linkedin" ? "LinkedIn" : "Twitter"
      }.`,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TwigsButton
          variant="outline"
          size="md"
          className="gap-1.5"
          rightIcon={<Share2 className="h-4 w-4" />}
        >
          Share
        </TwigsButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Social Media</DialogTitle>
          <DialogDescription>
            Share your content directly to your connected social media accounts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            resize="none"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            placeholder="Write a message to accompany your shared content..."
            className="min-h-[100px]"
            maxLength={280}
          />
          <p className="text-xs text-muted-foreground text-right">
            {message.length}/280 characters
          </p>

          {title && (
            <Card className="p-3 bg-muted/50">
              <p className="font-medium text-sm">{title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {content}
              </p>
            </Card>
          )}

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleShare("linkedin")}
              disabled={!linkedinConnected}
            >
              <Linkedin className="h-4 w-4" />
              {linkedinConnected
                ? "Share to LinkedIn"
                : "LinkedIn (Not Connected)"}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleShare("twitter")}
              disabled={!twitterConnected}
            >
              <Twitter className="h-4 w-4" />
              {twitterConnected
                ? "Share to Twitter"
                : "Twitter (Not Connected)"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
