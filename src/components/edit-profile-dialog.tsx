"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  getProfile,
  updateProfile,
  updateProfileContentType,
  addProfileContentType,
  getContentTypeTemplate,
} from "@/app/lib/profiles"
import { getProfileContentTypes } from "@/app/lib/content"
import { useAuth } from "@/context/auth-provider"
import { ProfileInfoStep } from "./profile-info-step"
import { ContentTypesStep } from "./content-types-step"
import { StepIndicator } from "./step-indicator"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileId: string
  onSuccess: () => void
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

export function EditProfileDialog({
  open,
  onOpenChange,
  profileId: stringProfileId,
  onSuccess,
}: EditProfileDialogProps) {
  const profileIdInt = Number.parseInt(stringProfileId)
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({
    name: "",
    context: "",
    isDefault: false,
  })
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { userId } = useAuth()

  const loadProfileData = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const [profile, profileContentTypes] = await Promise.all([
        getProfile(profileIdInt, userId),
        getProfileContentTypes(stringProfileId),
      ])

      if (profile) {
        setProfileData({
          name: profile.profile_name,
          context: profile.profile_context,
          isDefault: profile.is_default,
        })
      }

      const contentTypesWithTemplates = await Promise.all(
        profileContentTypes.map(async (type) => {
          try {
            const template = await getContentTypeTemplate(profileIdInt, type.id)
            return {
              ...type,
              prompt_template: template.is_default ? "" : template.prompt_template,
              is_default: template.is_default,
              hasTemplate: !template.is_default,
            }
          } catch (error) {
            console.error(`Error fetching template for content type ${type.id}:`, error)
            return { ...type, prompt_template: "", is_default: true, hasTemplate: false }
          }
        }),
      )

      setSelectedTypes(contentTypesWithTemplates)
    } catch (error) {
      console.error("Error loading profile data:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [profileIdInt, stringProfileId, userId, toast])

  useEffect(() => {
    if (open && stringProfileId) {
      setCurrentStep(1)
      loadProfileData()
    }
  }, [open, stringProfileId, loadProfileData])

  const handleSaveProfile = async (data: typeof profileData) => {
    if (!userId) return
    setIsLoading(true)

    try {
      await updateProfile(
        profileIdInt,
        {
          profile_name: data.name,
          profile_context: data.context,
          is_default: data.isDefault,
        },
        userId,
      )

      setProfileData(data)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setCurrentStep(2)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshContentTypes = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const profileContentTypes = await getProfileContentTypes(stringProfileId)
      const contentTypesWithTemplates = await Promise.all(
        profileContentTypes.map(async (type) => {
          try {
            const template = await getContentTypeTemplate(profileIdInt, type.id)
            return {
              ...type,
              prompt_template: template.is_default ? "" : template.prompt_template,
              is_default: template.is_default,
              hasTemplate: !template.is_default,
            }
          } catch (error) {
            console.error(`Error fetching template for content type ${type.id}:`, error)
            return { ...type, prompt_template: "", is_default: true, hasTemplate: false }
          }
        }),
      )
      setSelectedTypes(contentTypesWithTemplates)
    } catch (error) {
      console.error("Error refreshing content types:", error)
      toast({
        title: "Error",
        description: "Failed to refresh content types",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [profileIdInt, stringProfileId, userId, toast])

  const handleSaveContentType = async (contentType: ContentType) => {
    setIsLoading(true)

    try {
      if (contentType.hasTemplate && contentType.prompt_template !== undefined) {
        // Update existing prompt
        await updateProfileContentType(profileIdInt, contentType.id, contentType.prompt_template)
        toast({
          title: "Success",
          description: `Custom template for "${contentType.type_name}" updated successfully`,
        })
      } else {
        // Add new prompt
        await addProfileContentType(profileIdInt, contentType.id, contentType.prompt_template || "")
        toast({
          title: "Success",
          description: `Content type "${contentType.type_name}" added successfully`,
        })
      }

      await refreshContentTypes()
    } catch (error) {
      console.error("Error saving content type:", error)
      toast({
        title: "Error",
        description: `Failed to ${contentType.hasTemplate ? "update" : "add"} custom template for "${contentType.type_name}"`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onSuccess()
    onOpenChange(false)
    toast({
      title: "Success",
      description: "Profile updated successfully",
    })
  }

  const handleNext = () => {
    setCurrentStep(2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-2xl font-semibold text-foreground">Edit Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">Update your writing profile</DialogDescription>
        </DialogHeader>
        <StepIndicator currentStep={currentStep} />
        <div className={currentStep === 1 ? "block" : "hidden"}>
          <ProfileInfoStep
            profileData={profileData}
            onSave={handleSaveProfile}
            isLoading={isLoading}
            onCancel={() => onOpenChange(false)}
            onNext={handleNext}
            isEditing={true}
          />
        </div>
        <div className={currentStep === 2 ? "block" : "hidden"}>
          <ContentTypesStep
            selectedTypes={selectedTypes}
            onSaveContentType={handleSaveContentType}
            onBack={() => setCurrentStep(1)}
            onComplete={handleClose}
            isLoading={isLoading}
            isCreating={false}
            profileId={stringProfileId}
            onRefreshContentTypes={refreshContentTypes}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

