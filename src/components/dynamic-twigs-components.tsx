'use client'

import { Box, Flex, Heading, Text, Input } from '@sparrowengg/twigs-react'
import { Button as TwigsButton } from '@sparrowengg/twigs-react'
import { Search, Plus, MoreHorizontal, Folder, Calendar, Users, Filter, GridIcon, ListIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Create a safe version of the Button component
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

// Define the props interface
interface DynamicTwigsComponentsProps {
  projects: {
    id: string | number
    name: string
    description?: string
    status?: string
    progress?: number
    teamSize?: number
    dueDate?: string
    category?: string
    created_at?: string
    updated_at?: string
    user_id?: string
  }[]
  activeTab: string
  setActiveTab: (tab: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  viewMode: string
  setViewMode: (mode: string) => void
  getStatusStyles: (status: string) => string
  handleProjectClick: (projectId: string | number) => void
  router: ReturnType<typeof useRouter>
}

export default function DynamicTwigsComponents({
  projects,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  getStatusStyles,
  handleProjectClick,
  router
}: DynamicTwigsComponentsProps) {
  return (
    <Box className="container py-6 px-4">
      <Flex className="flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Box>
          <Heading as="h1" className="text-3xl font-bold mb-1">Projects</Heading>
          <Text className="text-muted-foreground">
            Manage your marketing projects and campaigns
          </Text>
        </Box>
        
        <SafeButton 
          className="mt-4 md:mt-0"
          onClick={() => router.push('/projects/new')}
        >
          <Plus size={16} className="mr-2" />
          New Project
        </SafeButton>
      </Flex>

      {/* Search and filters */}
      <Flex className="flex-col md:flex-row gap-4 mb-6">
        <Box className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search projects..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Flex className="gap-2">
          <SafeButton 
            variant="outline" 
            size="sm"
          >
            <Filter size={16} className="mr-2" />
            Filter
          </SafeButton>
          <SafeButton 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <GridIcon size={16} />
          </SafeButton>
          <SafeButton 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <ListIcon size={16} />
          </SafeButton>
        </Flex>
      </Flex>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="campaign">Campaigns</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Projects Grid */}
      {viewMode === 'grid' ? (
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Create new project card */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
              <Box className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </Box>
              <Heading as="h3" className="text-lg font-semibold mb-2">Create New Project</Heading>
              <Text className="text-muted-foreground text-sm mb-4">
                Start a new marketing project or campaign
              </Text>
              <SafeButton 
                variant="outline" 
                className="mt-auto"
                onClick={() => router.push('/projects/new')}
              >
                Get Started
              </SafeButton>
            </CardContent>
          </Card>
          
          {/* Project cards */}
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border hover:border-primary/30"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardContent className="p-0">
                <Box className="p-6">
                  <Flex className="items-start justify-between mb-3">
                    <Box className="p-2 rounded-md bg-primary/10">
                      <Folder className="h-5 w-5 text-primary" />
                    </Box>
                    <Box 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(project.status || '')}`}
                    >
                      {project.status?.charAt(0).toUpperCase() + (project.status?.slice(1) || '')}
                    </Box>
                  </Flex>
                  
                  <Heading as="h3" className="text-lg font-semibold mb-1">
                    {project.name}
                  </Heading>
                  
                  <Text className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description || ''}
                  </Text>
                  
                  {/* Progress bar */}
                  <Box className="w-full h-1.5 bg-muted rounded-full mb-3">
                    <Box 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </Box>
                  
                  <Flex className="justify-between text-xs text-muted-foreground">
                    <Text>{project.progress || 0}% complete</Text>
                    <Text>Due {project.dueDate || ''}</Text>
                  </Flex>
                </Box>
                
                <Box className="border-t p-4 bg-muted/30">
                  <Flex className="justify-between items-center">
                    <Flex className="items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Text className="text-sm text-muted-foreground">{project.teamSize || 0} team members</Text>
                    </Flex>
                    <SafeButton variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </SafeButton>
                  </Flex>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box className="space-y-3">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border hover:border-primary/30"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardContent className="p-4">
                <Flex className="items-center gap-4">
                  <Box className="p-3 rounded-md bg-primary/10 flex-shrink-0">
                    <Folder className="h-5 w-5 text-primary" />
                  </Box>
                  
                  <Box className="flex-grow">
                    <Flex className="flex-col md:flex-row md:items-center md:justify-between mb-1">
                      <Heading as="h3" className="text-lg font-semibold">
                        {project.name}
                      </Heading>
                      <Box 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(project.status || '')} w-fit md:ml-2`}
                      >
                        {project.status?.charAt(0).toUpperCase() + (project.status?.slice(1) || '')}
                      </Box>
                    </Flex>
                    
                    <Text className="text-muted-foreground text-sm mb-2">
                      {project.description || ''}
                    </Text>
                    
                    <Flex className="flex-col md:flex-row gap-4 mt-3">
                      <Flex className="items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Text className="text-sm text-muted-foreground">Due {project.dueDate || ''}</Text>
                      </Flex>
                      <Flex className="items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Text className="text-sm text-muted-foreground">{project.teamSize || 0} team members</Text>
                      </Flex>
                      <Box className="flex items-center gap-2 ml-auto">
                        <Text className="text-sm font-medium">{project.progress || 0}%</Text>
                        <Box className="w-24 h-1.5 bg-muted rounded-full">
                          <Box 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                  
                  <SafeButton variant="ghost" size="sm" className="flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </SafeButton>
                </Flex>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      
      {projects.length === 0 && (
        <Box className="py-12 text-center">
          <Heading as="h3" className="text-xl font-semibold mb-2">No projects found</Heading>
          <Text className="text-muted-foreground mb-6">
            Try adjusting your search or filters to find what you&apos;re looking for
          </Text>
          <SafeButton 
            onClick={() => {
              setSearchQuery('')
              setActiveTab('all')
            }}
            size="md"
          >
            Clear Filters
          </SafeButton>
        </Box>
      )}
    </Box>
  )
} 