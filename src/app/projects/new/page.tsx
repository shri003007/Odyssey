'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-provider'
import { createProject } from '@/app/lib/projects'
import { Box, Flex, Heading, Text, Input, Textarea } from '@sparrowengg/twigs-react'
import { Button as TwigsButton } from '@sparrowengg/twigs-react'
import { ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

// Create a safe version of the Button component to prevent hydration errors
function SafeButton(props: React.ComponentProps<typeof TwigsButton>) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  // Always provide a size prop if not provided
  const buttonProps = {
    ...props,
    size: props?.size || "md",
  }
  
  return <TwigsButton {...buttonProps} />
}

export default function NewProjectPage() {
  const router = useRouter()
  const { user, userId, isLoading: authLoading } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Ensure component only renders after mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Project name is required')
      return
    }
    
    if (!userId) {
      toast.error('You must be logged in to create a project')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await createProject({
        name,
        description: description || undefined,
        user_id: userId
      })
      
      toast.success('Project created successfully')
      router.push('/projects')
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Return null until component is mounted to prevent hydration issues
  if (!mounted) {
    return null
  }
  
  return (
    <Box className="container py-6 px-4">
      <Flex className="mb-6">
        <SafeButton 
          variant="ghost" 
          onClick={() => router.push('/projects')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </SafeButton>
      </Flex>
      
      <Card>
        <CardContent className="p-6">
          <Heading as="h1" className="text-2xl font-bold mb-6">Create New Project</Heading>
          
          <form onSubmit={handleSubmit}>
            <Box className="space-y-4">
              <Box className="space-y-2">
                <Text as="label" htmlFor="name" className="text-sm font-medium">
                  Project Name <span className="text-red-500">*</span>
                </Text>
                <Input
                  id="name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full"
                  required
                />
              </Box>
              
              <Box className="space-y-2">
                <Text as="label" htmlFor="description" className="text-sm font-medium">
                  Description
                </Text>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Describe your project (optional)"
                  className="w-full min-h-[120px]"
                />
              </Box>
              
              <Flex className="justify-end pt-4">
                <SafeButton
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => router.push('/projects')}
                >
                  Cancel
                </SafeButton>
                <SafeButton 
                  type="submit"
                  isLoading={isSubmitting}
                >
                  <Save size={16} className="mr-2" />
                  Create Project
                </SafeButton>
              </Flex>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
} 