import { useState } from "react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AddContentTypeForm } from "./add-content-type-form";
import { deleteContentType, updateContentType } from "@/app/lib/content";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button, Textarea } from "@sparrowengg/twigs-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react";

interface ContentType {
  id: number;
  type_name: string;
  description: string | null;
  icon: string | null;
  prompt_template?: string;
  is_default?: boolean;
  hasTemplate?: boolean;
  source?: string;
}

interface ContentTypesStepProps {
  selectedTypes: ContentType[];
  onSaveContentType: (contentType: ContentType) => void;
  onBack: () => void;
  onComplete: () => void;
  isLoading: boolean;
  isCreating: boolean;
  profileId: string;
  onRefreshContentTypes: () => Promise<void>;
}

export function ContentTypesStep({
  selectedTypes,
  onSaveContentType,
  onBack,
  onComplete,
  isLoading,
  isCreating,
  profileId,
  onRefreshContentTypes,
}: ContentTypesStepProps) {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [promptTemplate, setPromptTemplate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingType, setEditingType] = useState<ContentType | null>(null);
  const [showTemplatePanel, setShowTemplatePanel] = useState(true);
  const [missingVariables, setMissingVariables] = useState<string[]>([]);
  const [usedVariables, setUsedVariables] = useState<string[]>([]);

  // Variables with curly braces (used for validation and actual template)
  const mandatoryVariables = [
    "{topic}",
    "{medium}",
    "{outline}",
    "{audience}",
    "{research_data}",
    "{profile}",
  ];

  // UI friendly variable names without curly braces
  const uiVariableLabels = [
    "topic",
    "medium",
    "outline",
    "audience",
    "research_data",
    "profile",
  ];

  const refreshContentTypes = async () => {
    await onRefreshContentTypes();
  };

  const handleTypeSelect = (type: ContentType) => {
    setSelectedType(type);
    const template = type.is_default ? "" : type.prompt_template || "";
    setPromptTemplate(template);
    setShowTemplatePanel(true);
    setShowAddForm(false);
    setMissingVariables([]);
    
    // Check which variables are already used in the template
    const used = mandatoryVariables.filter(variable => 
      template.includes(variable)
    );
    setUsedVariables(used);
  };

  const validateTemplate = (template: string): string[] => {
    return mandatoryVariables.filter(variable => !template.includes(variable));
  };

  // Get UI friendly name of missing variable
  const getVariableLabel = (variable: string): string => {
    return variable.replace(/[{}]/g, "");
  };

  const handleSave = async () => {
    if (selectedType) {
      // For default templates without custom overrides, allow saving without validation
      if (selectedType.is_default && !promptTemplate.trim()) {
        try {
          await onSaveContentType({
            ...selectedType,
            prompt_template: promptTemplate,
          });
          await refreshContentTypes();
          toast.success(
            `Content type "${selectedType.type_name}" updated successfully`
          );
          setMissingVariables([]);
        } catch (error) {
          console.error("Error saving content type:", error);
          toast.error("Failed to save content type");
        }
        return;
      }

      // Validate the template for custom templates or overridden defaults
      const missing = validateTemplate(promptTemplate);
      if (missing.length > 0) {
        setMissingVariables(missing);
        toast.error("Template is missing required variables");
        return;
      }

      try {
        await onSaveContentType({
          ...selectedType,
          prompt_template: promptTemplate,
        });
        await refreshContentTypes();
        toast.success(
          `Content type "${selectedType.type_name}" updated successfully`
        );
        setMissingVariables([]);
      } catch (error) {
        console.error("Error saving content type:", error);
        toast.error("Failed to save content type");
      }
    }
  };

  // Update the promptTemplate and check for used variables
  const handleTemplateChange = (value: string) => {
    setPromptTemplate(value);
    setMissingVariables([]);
    
    // Update used variables based on current template
    const used = mandatoryVariables.filter(variable => 
      value.includes(variable)
    );
    setUsedVariables(used);
  };

  const handleCustomTypeCreated = (newType: ContentType) => {
    onSaveContentType({ ...newType, hasTemplate: false });
    setShowAddForm(false);
    setShowTemplatePanel(true);
  };

  const handleEditType = (type: ContentType) => {
    setEditingType(type);
    setShowEditDialog(true);
  };

  const handleDeleteType = async (type: ContentType) => {
    try {
      await deleteContentType(Number.parseInt(profileId), type.id);
      await refreshContentTypes();
      toast.success(`Content type "${type.type_name}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting content type:", error);
      toast.error("Failed to delete content type");
    }
  };

  const handleUpdateCustomType = async (updatedType: ContentType) => {
    try {
      await updateContentType(Number.parseInt(profileId), updatedType.id, {
        type_name: updatedType.type_name,
        description: updatedType.description || undefined, // Provide undefined instead of null
      });
      await refreshContentTypes();
      toast.success(
        `Custom content type "${updatedType.type_name}" updated successfully`
      );
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating custom content type:", error);
      toast.error("Failed to update custom content type");
    }
  };

  return (
    <div className="flex h-[600px] bg-background">
      <div className="w-1/3 border-r h-full overflow-hidden flex flex-col">
        <CardHeader className="border-b shrink-0">
          <CardTitle>
            {isCreating ? "Select Content Types" : "Edit Content Types"}
          </CardTitle>
        </CardHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="space-y-2 py-4 px-4">
              {selectedTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between"
                >
                  <Button
                    color="secondary"
                    size="md"
                    variant={
                      selectedType?.id === type.id ? "secondary" : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => handleTypeSelect(type)}
                  >
                    {type.type_name}
                  </Button>
                  {!type.is_default && type.source === "custom" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditType(type)}
                        className="ml-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteType(type)}
                        className="ml-2 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <Button
              rightIcon={<Plus className="h-4 w-4" />}
              variant="outline"
              size="md"
              onClick={() => {
                setShowAddForm(true);
                setShowTemplatePanel(false);
                setSelectedType(null);
              }}
            >
              Add Custom Type
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {showTemplatePanel && selectedType && (
          <Card className="flex-1 flex flex-col border-0 rounded-none">
            <CardHeader className="border-b">
              <CardTitle>{selectedType.type_name}</CardTitle>
              {selectedType.description && (
                <CardDescription>{selectedType.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2 flex-1">
                  <Label
                    htmlFor="promptTemplate"
                    className="text-sm font-medium"
                  >
                    Base Prompt Template{" "}
                    {!selectedType.is_default && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Textarea
                    resize="none"
                    id="promptTemplate"
                    value={promptTemplate}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      handleTemplateChange(e.target.value);
                    }}
                    placeholder={
                      selectedType.is_default
                        ? "This is using a default template. Enter a custom template to override."
                        : "Enter prompt template..."
                    }
                    className={`min-h-[200px] flex-1 font-mono text-sm ${
                      missingVariables.length > 0 ? "border-red-500" : ""
                    }`}
                  />
                  {missingVariables.length > 0 && (
                    <div className="flex items-center mt-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>
                        Missing required variables:{" "}
                        {missingVariables.map(getVariableLabel).join(", ")}
                      </span>
                    </div>
                  )}
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center space-x-1">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Required variables:
                      </h3>
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-5 w-5 p-0 rounded-full"
                            >
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="sr-only">Variables info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="start"
                            className="max-w-xs p-4"
                          >
                            <div className="space-y-2">
                              <p className="font-medium text-sm">
                                These variables will be replaced with actual
                                content before generating:
                              </p>
                              <ul className="text-xs space-y-1 list-disc pl-4">
                                <li>
                                  <span className="font-mono font-medium text-primary">
                                    topic
                                  </span>{" "}
                                  - The main subject of content
                                </li>
                                <li>
                                  <span className="font-mono font-medium text-primary">
                                    medium
                                  </span>{" "}
                                  - The content delivery format
                                </li>
                                <li>
                                  <span className="font-mono font-medium text-primary">
                                    outline
                                  </span>{" "}
                                  - Structure of the content
                                </li>
                                <li>
                                  <span className="font-mono font-medium text-primary">
                                    audience
                                  </span>{" "}
                                  - Target audience details
                                </li>
                                <li>
                                  <span className="font-mono font-medium text-primary">
                                    research_data
                                  </span>{" "}
                                  - Supporting information
                                </li>
                                <li>
                                  <span className="font-mono font-medium text-primary">
                                    profile
                                  </span>{" "}
                                  - Brand/entity profile information
                                </li>
                              </ul>
                              <p className="text-xs mt-2 text-muted-foreground">
                                Variables are added with curly braces in the template (e.g., {"{topic}"})
                              </p>
                              <p className="text-xs mt-2 text-muted-foreground">
                                Each variable can only be used once in the template
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uiVariableLabels.map((variable, index) => {
                        const templateVar = mandatoryVariables[index];
                        const isUsed = usedVariables.includes(templateVar);
                        const isMissing = missingVariables.includes(templateVar);
                        
                        return (
                          <TooltipProvider key={variable} delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-block">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={false}
                                    className={`px-2 py-1 h-auto text-xs font-mono ${
                                      isMissing
                                        ? "border-red-500 bg-red-50 text-red-700"
                                        : isUsed
                                        ? "bg-green-50 border-green-200 text-green-700 cursor-not-allowed opacity-90"
                                        : "bg-secondary/30 border-secondary/50"
                                    }`}
                                    onClick={() => {
                                      if (!isUsed) {
                                        const newTemplate = promptTemplate + " " + templateVar;
                                        handleTemplateChange(newTemplate);
                                      }
                                    }}
                                  >
                                    {variable}
                                    {isUsed && (
                                      <CheckCircle2 className="h-3 w-3 ml-1 text-green-700" />
                                    )}
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="p-2 text-xs">
                                {isUsed ? (
                                  <p>Variable already used in template</p>
                                ) : (
                                  <p>Click to add to template</p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <Button
                  size="md"
                  onClick={handleSave}
                  disabled={isLoading}
                  variant="outline"
                >
                  {selectedType.is_default
                    ? "Add Custom Template"
                    : "Update Template"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="absolute bottom-4 right-4 space-x-2 flex justify-end">
        <Button variant="outline" size="md" onClick={onBack}>
          Back
        </Button>
        <Button size="md" onClick={onComplete}>
          {isCreating ? "Complete Setup" : "Finish Editing"}
        </Button>
      </div>

      {showAddForm && (
        <AddContentTypeForm
          onSuccess={(newType) => {
            handleCustomTypeCreated(newType);
            setShowTemplatePanel(true);
          }}
          onCancel={() => {
            setShowAddForm(false);
            setShowTemplatePanel(true);
          }}
          profileId={profileId}
        />
      )}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Custom Content Type</DialogTitle>
          </DialogHeader>
          {editingType && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="typeName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type Name
                </Label>
                <Input
                  id="typeName"
                  value={editingType.type_name}
                  onChange={(e) =>
                    setEditingType({
                      ...editingType,
                      type_name: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="typeDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <Textarea
                  id="typeDescription"
                  value={editingType.description || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditingType({
                      ...editingType,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowEditDialog(false)}
            >
              Cancel
            </Button>
            <Button
              size="md"
              onClick={() => editingType && handleUpdateCustomType(editingType)}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
