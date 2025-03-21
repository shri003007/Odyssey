'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, FolderOpen } from 'lucide-react'

interface ViewToggleProps {
  value: string
  onValueChange: (value: 'recent' | 'projects') => void
}

export function ViewToggle({ value, onValueChange }: ViewToggleProps) {
  return (
    <Tabs 
      value={value} 
      onValueChange={(value: string) => onValueChange(value as 'recent' | 'projects')} 
      className="w-[400px]"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="recent" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent
        </TabsTrigger>
        <TabsTrigger value="projects" className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Projects
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

