import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createContentType } from "@/app/lib/content"
import { addProfileContentType } from "@/app/lib/profiles"
import { Loader2 } from "lucide-react"

interface AddContentTypeFormProps {
  onSuccess: (contentType: ContentType) => void
  onCancel: () => void
  profileId: string
}

interface ContentType {
  id: number
  type_name: string
  description: string | null
  icon: string | null
  prompt_template?: string
  is_default?: boolean
  hasTemplate?: boolean
}

export function AddContentTypeForm({ onSuccess, onCancel, profileId }: AddContentTypeFormProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [contentTypeData, setContentTypeData] = useState<ContentType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    promptTemplate: "",
  })

  const handleCreateContentType = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error("Content type name is required")
      return
    }

    setIsLoading(true)
    try {
      const newContentType = await createContentType({
        type_name: formData.name,
        description: formData.description,
        value: formData.name,
        profile_id: profileId,
      })

      setContentTypeData(newContentType)
      setStep(2)
      toast.success("Content type created successfully")
    } catch (error) {
      console.error("Error creating content type:", error)
      toast.error("Failed to create content type")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePromptTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contentTypeData || !profileId) return

    setIsLoading(true)
    try {
      await addProfileContentType(Number.parseInt(profileId), contentTypeData.id, formData.promptTemplate)

      onSuccess({
        ...contentTypeData,
        prompt_template: formData.promptTemplate,
        hasTemplate: true,
        is_default: false,
      })

      toast.success("Prompt template saved successfully")
    } catch (error) {
      console.error("Error saving prompt template:", error)
      toast.error("Failed to save prompt template")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center justify-center h-full p-6">
          <Card className="w-full max-w-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Add Custom Content Type</CardTitle>
              <CardDescription>Create a new content type template for your writing profile</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateContentType}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Content Type Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Instagram Caption, Email Newsletter"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Add a brief description to help team members understand the purpose..."
                    className="min-h-[120px] resize-none"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !formData.name.trim()}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Content Type"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{formData.name}</CardTitle>
            <CardDescription>Configure the prompt template for this content type</CardDescription>
          </CardHeader>
          <form onSubmit={handleSavePromptTemplate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promptTemplate" className="text-sm font-medium">
                  Base Prompt Template <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="promptTemplate"
                  value={formData.promptTemplate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, promptTemplate: e.target.value }))}
                  placeholder="Write your base prompt template here..."
                  className="min-h-[200px] resize-none font-mono text-sm"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: [topic], [tone], [length], [hashtags]
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading || !formData.promptTemplate.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Template"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

