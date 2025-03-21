import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea, Input, Button, Switch } from "@sparrowengg/twigs-react";

interface ProfileInfoStepProps {
  profileData: {
    name: string;
    context: string;
    isDefault: boolean;
  };
  onSave: (data: { name: string; context: string; isDefault: boolean }) => void;
  isLoading: boolean;
  onCancel: () => void;
  onNext: () => void;
  isEditing?: boolean;
}

export function ProfileInfoStep({
  profileData,
  onSave,
  isLoading,
  onCancel,
  onNext,
  isEditing = false,
}: ProfileInfoStepProps) {
  const [name, setName] = useState(profileData.name);
  const [context, setContext] = useState(profileData.context);
  const [isDefault, setIsDefault] = useState(profileData.isDefault);

  useEffect(() => {
    setName(profileData.name);
    setContext(profileData.context);
    setIsDefault(profileData.isDefault);
  }, [profileData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, context, isDefault });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-background">
      <div className="space-y-2">
        <Label htmlFor="name">Profile Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="E.g., Tech Marketing Professional"
          required
          maxLength={100}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="context">
          Tell me about yourself and your writing style
        </Label>
        <Textarea
          id="context"
          value={context}
          resize='none'
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContext(e.target.value)}
          placeholder="E.g., I'm a tech marketing professional who writes about AI and automation. I prefer a confident but approachable style..."
          required
          className="min-h-[120px]"
        />
      </div>
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <Label htmlFor="isDefault">Set as Default Profile</Label>
            <p className="text-sm text-muted-foreground">
              This profile will be automatically selected when creating new
              content
            </p>
          </div>
          <Switch
            id="isDefault"
            checked={isDefault}
            onCheckedChange={setIsDefault}
          />
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button color="secondary" variant="outline" onClick={onCancel} size="md">
          Cancel
        </Button>
        <div
          className="space-x-2"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          {isEditing && (
            <Button
              type="button"
              onClick={onNext}
              variant="outline"
              size="md"
            >
              Next
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            size="md"
            variant="outline"
          >
            {isLoading ? "Saving" : "Save Profile"}
          </Button>
        </div>
      </div>
    </form>
  );
}
