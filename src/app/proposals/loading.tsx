import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ProposalsLoading() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            <Skeleton className="h-[60vh] w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 