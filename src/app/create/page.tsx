"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Editor } from "@tiptap/core";
import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TopicSection } from "../components/topic-section";
import { AudienceSection } from "../components/audience-section";
import { OutlineSection } from "../components/outline-section";
import { AdditionalInfoSection } from "../components/additional-info-section";
import { blogFormSchema } from "../lib/schema";
import {
  generateMarketingContent,
  researchTopic,
  suggestOutline,
} from "../actions/generate-blog";
import { NavSidebar } from "../../components/nav-sidebar";
import { Header } from "../../components/header";
import { Selectors } from "../../components/selectors";
import { EditorToolbar } from "../../components/editor-toolbar";
import { SparrowMenu } from "../../components/sparrow-menu";
import { TiptapEditor } from "../../components/tiptap-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import {
  getProfiles,
  getDefaultProfile,
  getContentTypeTemplate,
} from "@/app/lib/profiles";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { Loader2, Search, Info, Save, FileDown } from "lucide-react";
import Link from "next/link";
import type { z } from "zod";
import { ResearchDialog } from "../components/research-dialog";
import { stripHtmlTags } from "@/utils/stringUtils";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SocialShare } from "@/components/social-share";
import { SaveDialog } from "@/components/save-dialog";
import { saveContent } from "../lib/content";
import { Button as TwigsButton, Switch } from "@sparrowengg/twigs-react";

interface MarketingContentRequest {
  topic: string;
  medium: string;
  audience?: string[];
  outline?: string;
  language: string;
  additionalInfo?: Record<string, string>;
  profile?: string;
  profile_content_prompt?: string;
  contentTypeId?: number;
  research_data?: string;
  model?: string;
}

interface Profile {
  id: number;
  created_at: string;
  profile_name: string;
  profile_context: string;
  is_default: boolean;
}

type BlogFormValues = z.infer<typeof blogFormSchema> & {
  contentTypeId?: number;
  outline: string;
};

export default function CreatePage() {
  const { user, userId, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedText] = useState("");
  const [menuPosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [webResearchEnabled, setWebResearchEnabled] = useState(false);
  const [isResearchDialogOpen, setIsResearchDialogOpen] = useState(false);
  const [researchResult, setResearchResult] = useState<{
    topic: string;
    research: string;
  } | null>(null);
  const [isResearchAvailable, setIsResearchAvailable] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o-mini");
  const contentRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const methods = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      topic: "",
      medium: "",
      audience: [],
      outline: "",
      language: "English (American)",
      additionalInfo: [],
      contentTypeId: undefined,
    },
  });

  const { watch } = methods;
  const selectedMedium = watch("medium");
  const selectedTopic = watch("topic");

  const canProceed = Boolean(selectedMedium && selectedTopic?.trim());

  const getActionMessage = () => {
    if (!selectedMedium) return "Please select a medium first";
    if (!selectedTopic?.trim()) return "Please enter a topic";
    return "";
  };

  useEffect(() => {
    const loadProfilesAndCachedData = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const data = await getProfiles(userId);
        setProfiles(
          data.map((profile) => ({
            ...profile,
            profile_context: profile.profile_context || "",
          }))
        );

        if (data.length > 0) {
          try {
            const defaultProfile = await getDefaultProfile(userId);
            if (defaultProfile) {
              setSelectedProfile(defaultProfile.id);
            } else {
              setSelectedProfile(null);
            }
          } catch (error) {
            console.error("Error fetching default profile:", error);
            setSelectedProfile(null);
          }
        }
      } catch (error) {
        console.error("Failed to load profiles or cached data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfilesAndCachedData();
  }, [userId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const savedModel = localStorage.getItem("selectedModel");
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  const onSubmit = async (data: BlogFormValues) => {
    console.log(
      "Submitting form with medium:",
      data.medium,
      "Content Type ID:",
      data.contentTypeId
    );

    setIsGeneratingContent(true);
    toast.loading("Generating content...");
    try {
      const formattedData: MarketingContentRequest = {
        topic: data.topic,
        medium: data.medium || "blog",
        language: data.language || "English (American)",
        outline: data.outline ? stripHtmlTags(data.outline) : undefined,
        audience: data.audience,
        research_data: webResearchEnabled
          ? researchResult?.research
            ? stripHtmlTags(researchResult.research)
            : ""
          : "",
        model: selectedModel,
      };

      if (data.additionalInfo && data.additionalInfo.length > 0) {
        formattedData.additionalInfo = data.additionalInfo.reduce(
          (acc, { key, value }) => {
            if (key && value) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>
        );
      }

      if (selectedProfile !== null && selectedProfile !== -1) {
        const selectedProfileData = profiles.find(
          (p) => p.id === selectedProfile
        );
        if (selectedProfileData) {
          formattedData.profile = selectedProfileData.profile_context;
        }

        if (data.contentTypeId) {
          try {
            const template = await getContentTypeTemplate(
              selectedProfile,
              data.contentTypeId
            );
            if (!template.is_default) {
              formattedData.profile_content_prompt = template.prompt_template;
            }
          } catch (error) {
            console.error("Error fetching content type template:", error);
            toast.error(
              "Failed to fetch content type template. Proceeding without it."
            );
          }
        }
      }

      if (data.contentTypeId) {
        formattedData.contentTypeId = data.contentTypeId;
      }

      const result = await generateMarketingContent(formattedData);
      if (result.status === "success" && result.content) {
        setGeneratedContent(result.content);
        const editor = editorRef.current;
        if (editor) {
          editor.commands.setContent(result.content);
        }
        toast.success("Content generated successfully.");
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleUpdateContent = useCallback((newContent: string) => {
    const editor = editorRef.current;
    if (editor) {
      editor.commands.insertContent(newContent);
      const updatedContent = editor.getHTML();
      setGeneratedContent(updatedContent);
    }
  }, []);

  const handleFormatText = (format: string) => {
    const editor = editorRef.current;
    if (editor) {
      editor.commands.focus();
      switch (format) {
        case "bold":
          editor.commands.toggleBold();
          break;
        case "italic":
          editor.commands.toggleItalic();
          break;
        case "underline":
          editor.commands.toggleUnderline();
          break;
        case "strike":
          editor.commands.toggleStrike();
          break;
        case "code":
          editor.commands.toggleCode();
          break;
        case "highlight":
          editor.commands.toggleHighlight();
          break;
        case "link":
          const url = window.prompt("Enter the URL");
          if (url) {
            editor.commands.setLink({ href: url });
          }
          break;
        case "image":
          const src = window.prompt("Enter the image URL");
          if (src) {
            editor.commands.setImage({ src });
          }
          break;
        case "bulletList":
          editor.commands.toggleBulletList();
          break;
        case "orderedList":
          editor.commands.toggleOrderedList();
          break;
        case "blockquote":
          editor.commands.toggleBlockquote();
          break;
        case "h1":
          editor.commands.toggleHeading({ level: 1 });
          break;
        case "h2":
          editor.commands.toggleHeading({ level: 2 });
          break;
        case "h3":
          editor.commands.toggleHeading({ level: 3 });
          break;
        case "alignLeft":
          editor.commands.setTextAlign("left");
          break;
        case "alignCenter":
          editor.commands.setTextAlign("center");
          break;
        case "alignRight":
          editor.commands.setTextAlign("right");
          break;
        case "alignJustify":
          editor.commands.setTextAlign("justify");
          break;
        default:
          break;
      }
    }
  };

  const handleResearch = async () => {
    const topic = methods.getValues("topic");
    const medium = methods.getValues("medium");

    if (!topic || !medium) {
      toast.error(
        "Please provide a topic and select a medium before researching."
      );
      return;
    }

    setIsResearching(true);
    toast.loading("Researching topic...");
    try {
      const result = await researchTopic(topic, medium);
      if (result.status === "success" && result.data) {
        setResearchResult(result.data);
        setIsResearchAvailable(true);
        toast.success("Research completed successfully.");
      } else {
        throw new Error(result.error || "Failed to fetch research data");
      }
    } catch (error) {
      console.error("Error researching topic:", error);
      toast.error("Failed to research the topic. Please try again.");
    } finally {
      setIsResearching(false);
    }
  };

  const handleViewResearch = () => {
    if (researchResult) {
      setIsResearchDialogOpen(true);
    }
  };

  const handleGenerateOutline = async () => {
    const topic = methods.getValues("topic");
    const medium = methods.getValues("medium");
    const researchData = webResearchEnabled
      ? researchResult?.research
        ? stripHtmlTags(researchResult.research)
        : ""
      : "";

    if (!topic || !medium) {
      toast.error(
        "Please provide a topic and select a medium before generating an outline."
      );
      return;
    }

    setIsGeneratingOutline(true);
    toast.loading("Generating outline...");
    try {
      const result = await suggestOutline(topic, medium, researchData);
      if (result.status === "success" && result.data) {
        const outline = result.data.outline;
        setGeneratedOutline(outline);
        methods.setValue("outline", outline);
        toast.success("Outline generated successfully.");
      } else {
        throw new Error(result.error || "Failed to generate outline");
      }
    } catch (error) {
      console.error("Error generating outline:", error);
      toast.error("Failed to generate outline. Please try again.");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleUpdateResearch = useCallback((updatedResearch: string) => {
    setResearchResult((prev) =>
      prev ? { ...prev, research: updatedResearch } : null
    );
  }, []);

  const handleSaveContent = () => {
    setIsSaveDialogOpen(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <NavSidebar />
      <Header />
      <main className="pt-16 pl-16 h-screen w-full overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={33} minSize={30}>
            <div className="h-full overflow-y-auto p-6">
              <FormProvider {...methods}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Writing Profile
                  </label>
                  <Select
                    value={selectedProfile?.toString() ?? "-1"}
                    onValueChange={(value) => {
                      const newSelectedProfile =
                        value === "-1" ? null : Number(value);
                      setSelectedProfile(newSelectedProfile);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1">Default</SelectItem>
                      {profiles.map((profile) => (
                        <SelectItem
                          key={profile.id}
                          value={profile.id.toString()}
                        >
                          {profile.profile_name}{" "}
                          {profile.is_default && "(Default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {profiles.length === 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No custom profiles available. You can create one in the{" "}
                      <Link
                        href="/settings"
                        className="font-medium underline underline-offset-4"
                      >
                        settings page
                      </Link>
                      .
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <Switch
                    id="web-research"
                    checked={webResearchEnabled}
                    onCheckedChange={setWebResearchEnabled}
                  />
                  <label htmlFor="web-research" className="text-sm font-medium">
                    Enable Web Research
                  </label>
                </div>

                <div className="mb-8">
                  <Selectors
                    selectedProfile={selectedProfile?.toString() || null}
                  />
                </div>

                <form
                  ref={formRef}
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <TopicSection />
                  {webResearchEnabled && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left" align="center">
                              {canProceed
                                ? "Search the internet for latest information about your topic"
                                : getActionMessage()}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          type="button"
                          onClick={handleResearch}
                          disabled={!canProceed || isResearching}
                          variant={canProceed ? "default" : "secondary"}
                        >
                          {isResearching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Search className="h-4 w-4 mr-2" />
                              Research Topic
                            </>
                          )}
                        </Button>
                      </div>
                      {isResearchAvailable && (
                        <Button type="button" onClick={handleViewResearch}>
                          View Research
                        </Button>
                      )}
                    </div>
                  )}
                  <OutlineSection
                    onGenerateOutline={handleGenerateOutline}
                    isGeneratingOutline={isGeneratingOutline}
                    generatedOutline={generatedOutline}
                    canProceed={canProceed}
                    getActionMessage={getActionMessage}
                  />
                  <AudienceSection />
                  <AdditionalInfoSection />
                  <TwigsButton
                    size="lg"
                    type="submit"
                    disabled={!methods.watch("medium") || isGeneratingContent}
                    css={{
                      width: "100%",
                    }}
                  >
                    {isGeneratingContent ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      "Generate Content"
                    )}
                  </TwigsButton>
                </form>
              </FormProvider>
            </div>
          </Panel>
          <PanelResizeHandle className="w-2 bg-border hover:bg-primary/20 transition-colors" />
          <Panel defaultSize={67} minSize={30}>
            <div className="h-full flex flex-col">
              <EditorToolbar
                onFormatText={handleFormatText}
                editor={editorRef.current}
              />
              <div className="flex items-center justify-between px-6 pt-4">
                <h2 className="text-xl font-semibold">
                  {isGeneratingContent ? (
                    <div className="flex items-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Content...
                    </div>
                  ) : generatedContent ? (
                    "Generated Content"
                  ) : (
                    "Content Preview"
                  )}
                </h2>
                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <SocialShare
                      content={generatedContent}
                      title={methods.getValues("topic")}
                    />

                    <TwigsButton
                      variant="outline"
                      size="md"
                      rightIcon={<Save className="h-4 w-4" />}
                      onClick={handleSaveContent}
                      disabled={!generatedContent}
                      className="flex items-center gap-1.5"
                    >
                      Save
                    </TwigsButton>

                    <TwigsButton
                      rightIcon={<FileDown className="h-4 w-4" />}
                      variant="outline"
                      size="md"
                      onClick={() => {
                        const htmlContent = generatedContent || "";
                        const element = document.createElement("a");
                        const file = new Blob([htmlContent], {
                          type: "text/html",
                        });
                        element.href = URL.createObjectURL(file);
                        element.download = `${
                          methods.getValues("topic") || "content"
                        }.html`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      disabled={!generatedContent}
                      className="flex items-center gap-1.5"
                    >
                      Download
                    </TwigsButton>
                  </div>
                )}
              </div>
              <div
                className="flex-1 p-6 overflow-y-auto relative"
                ref={contentRef}
              >
                <TiptapEditor
                  content={generatedContent || ""}
                  onUpdate={({ editor }) => {
                    const updatedContent = editor.getHTML();
                    setGeneratedContent(updatedContent);
                  }}
                  editorRef={editorRef}
                  contentId={undefined}
                />
                <SparrowMenu
                  isOpen={isMenuOpen}
                  onClose={() => setIsMenuOpen(false)}
                  selectedText={selectedText}
                  onUpdateContent={handleUpdateContent}
                  fullContent={generatedContent || ""}
                  position={menuPosition}
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </main>
      {researchResult && (
        <ResearchDialog
          isOpen={isResearchDialogOpen}
          onClose={() => setIsResearchDialogOpen(false)}
          result={researchResult}
          onUpdateResearch={handleUpdateResearch}
        />
      )}
      {generatedContent && (
        <SaveDialog
          open={isSaveDialogOpen}
          onOpenChange={setIsSaveDialogOpen}
          content={generatedContent}
          contentName={methods.getValues("topic") || "Untitled Content"}
          onSave={async (name, contentType) => {
            try {
              await saveContent({
                name,
                content: generatedContent,
                user_id: userId || "",
                content_type_id: parseInt(contentType) || 1,
              });
              toast.success("Content saved successfully!");
              setIsSaveDialogOpen(false);
            } catch (error) {
              console.error("Failed to save content:", error);
              toast.error("Failed to save content. Please try again.");
            }
          }}
        />
      )}
    </>
  );
}
