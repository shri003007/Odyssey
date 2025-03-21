"use client";

import { useState, useEffect, useCallback } from "react";
import { NavSidebar } from "@/components/nav-sidebar";
import {
  LogOut,
  User,
  Cpu,
  ShieldCheck,
  Settings as SettingsIcon,
  Plus,
} from "lucide-react";
import { CreateProfileDialog } from "@/components/create-profile-dialog";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { DeleteProfileDialog } from "@/components/delete-profile-dialog";
import { useToast } from "@/hooks/use-toast";
import { getProfiles, deleteProfile } from "@/app/lib/profiles";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-provider";
import { Chip, Button as TwigsButton } from "@sparrowengg/twigs-react";

interface Profile {
  id: number;
  created_at: string;
  profile_name: string;
  profile_context: string;
  is_default: boolean;
}

const modelOptions = [
  {
    value: "gpt-4o",
    label: "GPT-4",
    description: "Most powerful model with broad capabilities",
  },
  {
    value: "gpt-4o-mini",
    label: "GPT-4 Mini",
    description: "Balanced performance at a lower cost",
  },
  {
    value: "anthropic.claude-3-haiku-20240307-v1:0",
    label: "Claude Haiku",
    description: "Fast, efficient AI assistant",
  },
  {
    value: "anthropic.claude-3-sonnet-20240229-v1:0",
    label: "Claude Sonnet",
    description: "High-quality outputs with reasoning",
  },
  {
    value: "mixtral-8x7b-32768",
    label: "Mixtral 8x7B",
    description: "Excellent multilingual capabilities",
  },
  {
    value: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B",
    description: "Open source model with robust performance",
  },
];

function SettingsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed left-0 top-0 h-screen w-16 border-r bg-muted/10">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex justify-center mt-4">
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          ))}
      </div>
      <main className="pl-16 h-screen overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-5 w-64" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-10 w-full max-w-md" />

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-72 mt-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="bg-muted p-4 rounded-md mt-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-64 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-36" />
              </CardContent>
            </Card>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1.5">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-9 w-32" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-24 mt-1" />
                          </div>
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-3">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full mt-1.5" />
                        <Skeleton className="h-3 w-4/5 mt-1.5" />
                      </CardContent>
                      <CardFooter className="border-t bg-muted/20 px-4 py-2 flex justify-end gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o-mini");
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const { user, userId, logout } = useAuth();

  const loadProfiles = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      console.log("Loading profiles...");
      const data = await getProfiles(userId);
      console.log("Profiles loaded:", data);
      setProfiles(data);
    } catch (err) {
      console.error("Error loading profiles:", err);
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user, loadProfiles]);

  useEffect(() => {
    // Load selected model from localStorage
    const savedModel = localStorage.getItem("selectedModel");
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  const handleDeleteProfile = async (profile: Profile) => {
    if (!userId) return;
    try {
      const success = await deleteProfile(profile.id, userId);
      if (success) {
        await loadProfiles();
        setIsDeleteDialogOpen(false);
        toast({
          title: "Success",
          description: "Profile deleted successfully",
        });
      } else {
        throw new Error("Failed to delete profile");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete profile";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    localStorage.setItem("selectedModel", value);
    toast({
      title: "Model Updated",
      description: "The AI model has been updated successfully.",
    });
  };

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  const renderProfilesContent = () => {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {profiles.map((profile) => (
          <Card key={profile.id} className="overflow-hidden bg-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-medium">
                    {profile.profile_name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Created on{" "}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                {profile.is_default && (
                  <Chip
                    className="ml-2"
                    css={{
                      backgroundColor: "$accent100",
                      color: "$accent500",
                    }}
                  >
                    Default
                  </Chip>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground pt-0 pb-3">
              <p className="line-clamp-2">
                {profile.profile_context.length > 150
                  ? `${profile.profile_context.substring(0, 150)}...`
                  : profile.profile_context}
              </p>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-4 py-2 flex justify-end gap-2">
              <TwigsButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProfile(profile);
                  setIsEditDialogOpen(true);
                }}
              >
                Edit
              </TwigsButton>
              <TwigsButton
                variant="outline"
                color="error"
                size="sm"
                onClick={() => {
                  setSelectedProfile(profile);
                  setIsDeleteDialogOpen(true);
                }}
                disabled={profiles.length === 1}
              >
                Delete
              </TwigsButton>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <NavSidebar />
      <main className="pl-16 h-screen overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your preferences and writing profiles
              </p>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger
                value="general"
                className="flex items-center gap-1.5"
              >
                <SettingsIcon className="h-3.5 w-3.5" />
                General Settings
              </TabsTrigger>
              <TabsTrigger
                value="profiles"
                className="flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5" />
                Writing Profiles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <CardTitle>AI Model Selection</CardTitle>
                  </div>
                  <CardDescription>
                    Choose the AI model that will generate your marketing
                    content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <Label
                      htmlFor="model-select"
                      className="text-base font-medium"
                    >
                      Select AI Model
                    </Label>
                    <Select
                      value={selectedModel}
                      onValueChange={handleModelChange}
                    >
                      <SelectTrigger id="model-select" className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div
                              className="flex"
                              style={{ alignItems: "center", gap: "10px" }}
                            >
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <CardTitle>Security & Privacy</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TwigsButton
                    variant="outline"
                    color="error"
                    onClick={logout}
                    size="md"
                    rightIcon={<LogOut className="h-4 w-4" />}
                  >
                    Log out
                  </TwigsButton>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profiles" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">Writing Profiles</h2>
                  <p className="text-muted-foreground mt-1">
                    Create and manage your customized writing profiles
                  </p>
                </div>
                <TwigsButton
                  onClick={() => setIsCreateDialogOpen(true)}
                  size="md"
                  rightIcon={<Plus className="h-4 w-4" />}
                >
                  Create Profile
                </TwigsButton>
              </div>

              {renderProfilesContent()}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <CreateProfileDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadProfiles}
      />

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        profileId={`${selectedProfile?.id || 0}`}
        onSuccess={loadProfiles}
      />

      <DeleteProfileDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        profile={selectedProfile}
        onConfirm={() =>
          selectedProfile && handleDeleteProfile(selectedProfile)
        }
      />
    </div>
  );
}
