"use client"

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { createProfile, addProfileContentType, getContentTypeTemplate, updateProfileContentType } from '@/app/lib/profiles'
import { useAuth } from '@/context/auth-provider'
import { ProfileInfoStep } from './profile-info-step'
import { ContentTypesStep } from './content-types-step'
import { StepIndicator } from './step-indicator'

interface CreateProfileDialogProps {
 open: boolean
 onOpenChange: (open: boolean) => void
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
 value?: string
 profile_id?: number | null
 source?: string
}

export function CreateProfileDialog({ open, onOpenChange, onSuccess }: CreateProfileDialogProps) {
 const [currentStep, setCurrentStep] = useState(1)
 const [profileData, setProfileData] = useState({
   name: '',
   context: '',
   isDefault: false
 })
 const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([])
 const [isLoading, setIsLoading] = useState(false)
 const { toast } = useToast()
 const { profileId, setProfileId,userId } = useAuth()

 useEffect(() => {
   if (open) {
     setCurrentStep(1)
     setProfileData({
       name: '',
       context: '',
       isDefault: false
     })
     setSelectedTypes([])
   }
 }, [open])

 const loadContentTypes = useCallback(async (newProfileId: number) => {
   if (!newProfileId) return;
   try {
     setIsLoading(true)
     const response = await fetch(`${process.env.NEXT_PUBLIC_CONTENT_TYPE_API}/content-types/profile/${newProfileId}`);
     if (!response.ok) {
       throw new Error('Failed to fetch content types');
     }
     const result = await response.json();
     const contentTypes: ContentType[] = result.data;

     const contentTypesWithTemplates = await Promise.all(contentTypes.map(async (type) => {
       try {
         const template = await getContentTypeTemplate(newProfileId, type.id);
         return {
           ...type,
           prompt_template: template.is_default ? '' : template.prompt_template,
           is_default: template.is_default,
           hasTemplate: !template.is_default
         };
       } catch (error) {
         console.error(`Error fetching template for content type ${type.id}:`, error);
         return {
           ...type,
           prompt_template: '',
           is_default: true,
           hasTemplate: false
         };
       }
     }));
     setSelectedTypes(contentTypesWithTemplates);
   } catch (error) {
     console.error('Error loading content types:', error);
     toast({
       title: "Error",
       description: "Failed to load content types",
       variant: "destructive",
     });
   } finally {
     setIsLoading(false);
   }
 }, [toast]);

 const handleSaveProfile = async (data: typeof profileData) => {
   if (!userId) return
   setIsLoading(true)

   try {
     const response = await createProfile({
       profile_name: data.name,
       profile_context: data.context,
       is_default: data.isDefault,
     }, userId)

     console.log('Profile created:', response)

     if (Array.isArray(response) && response.length > 0) {
       const profile = response[0]
       setProfileId(profile.id)
       setProfileData(data)
       await loadContentTypes(profile.id)
       toast({
         title: "Success",
         description: "Profile created successfully",
       })
       setCurrentStep(2) // Automatically move to the next step
     } else {
       throw new Error('Invalid response format')
     }
   } catch (error) {
     console.error('Error creating profile:', error)
     toast({
       title: "Error",
       description: "Failed to create profile",
       variant: "destructive",
     })
   } finally {
     setIsLoading(false)
   }
 }

 const handleSaveContentType = async (contentType: ContentType) => {
   if (!profileId) return
   setIsLoading(true)

   try {
     if (contentType.hasTemplate) {
       // If the content type already has a template, update it
       await updateProfileContentType(profileId, contentType.id, contentType.prompt_template || "");
       toast({
         title: "Success",
         description: `Content type "${contentType.type_name}" updated successfully`,
       });
     } else {
       // If it's a new template, add it
       await addProfileContentType(profileId, contentType.id, contentType.prompt_template || "");
       toast({
         title: "Success",
         description: `Content type "${contentType.type_name}" added successfully`,
       });
     }
     await loadContentTypes(profileId);
   } catch (error) {
     console.error('Error saving content type:', error)
     toast({
       title: "Error",
       description: `Failed to ${contentType.hasTemplate ? 'update' : 'add'} content type "${contentType.type_name}"`,
       variant: "destructive",
     })
   } finally {
     setIsLoading(false)
   }
 }

 const handleCompleteSetup = () => {
   onSuccess()
   onOpenChange(false)
   toast({
     title: "Success",
     description: "Profile setup completed successfully",
   })
 }

 const handleNext = () => {
   setCurrentStep(2)
 }

 return (
   <Dialog open={open} onOpenChange={onOpenChange}>
     <DialogContent className="max-w-4xl p-0">
       <DialogHeader className="border-b p-6">
         <DialogTitle className="text-2xl font-semibold text-foreground">Create Profile</DialogTitle>
         <DialogDescription className="text-muted-foreground">
           Set up your new writing profile
         </DialogDescription>
       </DialogHeader>
       <StepIndicator currentStep={currentStep} />
       {currentStep === 1 ? (
         <ProfileInfoStep
           profileData={profileData}
           onSave={handleSaveProfile}
           isLoading={isLoading}
           onCancel={() => onOpenChange(false)}
           onNext={handleNext}
         />
       ) : (
         <ContentTypesStep
           profileId={profileId?.toString() || ''}
           onSaveContentType={handleSaveContentType}
           onBack={() => setCurrentStep(1)}
           onComplete={handleCompleteSetup}
           isLoading={isLoading}
           isCreating={true}
           selectedTypes={selectedTypes}
           onRefreshContentTypes={() => profileId ? loadContentTypes(profileId) : Promise.resolve()}
         />
       )}
     </DialogContent>
   </Dialog>
 )
}

