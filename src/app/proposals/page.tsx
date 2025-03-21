'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, FileText } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ProposalLoader } from './components/proposal-loader'

const PROPOSAL_TEMPLATE_URL = process.env.PROPOSAL_TEMPLATE_URL || 'https://docs.google.com/document/d/1qmeAOIIPbUuW06nuVlT0RjNomrfsOHydN66Ttj0mqKQ/preview?authuser=0'
const API_URL = process.env.PROPOSAL_S3_LINK || 'https://awqgku72nz53jnkkvqbuort2ra0iarkc.lambda-url.us-west-2.on.aws'
const PROPOSAL_TEMPLATE_NAME = process.env.PROPOSAL_TEMPLATE_NAME || 'templates/VoC_Proposal_document.docx'

export default function ProposalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [showAPIError, setShowAPIError] = useState(false)
  const [apiErrorDetails, setApiErrorDetails] = useState('')

  const handleGenerate = async () => {
    if (!companyName.trim()) {
      setError('Please enter a company name')
      return
    }
    
    setError('')
    setIsGenerating(true)
    setShowAPIError(false)
    
    // Close the modal immediately to show the loader
    setIsModalOpen(false)
    
    try {
      const response = await fetch(`${API_URL}/process-s3-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_s3_key: PROPOSAL_TEMPLATE_NAME,
          client_company_name: companyName.trim(),
          uid: `${companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate proposal')
      }
      
      // Trigger download of the generated file
      if (data.download_url) {
        const link = document.createElement('a')
        // Extract the key from the S3 URL
        const s3Url = data.download_url
        const keyMatch = s3Url.match(/proposals\/.*\.docx/)
        const proposalKey = keyMatch ? keyMatch[0] : null
        
        if (proposalKey) {
          // Construct the new download URL
          const downloadUrl = `${API_URL}/download-file?key=${proposalKey}`
          link.href = downloadUrl
          link.download = `${companyName.trim()}-proposal.docx`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Close the modal
          setIsModalOpen(false)
          setCompanyName('')
        } else {
          throw new Error('Could not extract proposal key from the download URL')
        }
      } else {
        throw new Error('No download URL provided in the response')
      }
    } catch (err) {
      console.error('Error generating proposal:', err)
      setError('Failed to generate proposal. Please try again.')
      
      // Show detailed API error message
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setApiErrorDetails(errorMessage)
      setShowAPIError(true)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e7f5f7] to-white py-12 px-4">
      <div className="container mx-auto flex flex-col gap-8">
        <div className="flex justify-between items-center">
          {/* Title removed as requested */}
        </div>
        
        {showAPIError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Error</AlertTitle>
            <AlertDescription>
              {apiErrorDetails}. Please contact your administrator or try again later.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="w-full overflow-hidden border-[#56b0bb]/20 shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center border-b bg-[#f8fcfd]">
            <div>
              <CardTitle className="text-[#2d6e75] text-2xl">Proposal Template</CardTitle>
              <CardDescription className="text-[#56b0bb]/80">
                Preview our standard proposal template
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#56b0bb] hover:bg-[#4a9da7] text-white shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Proposal
            </Button>
          </CardHeader>
          <CardContent className="p-0 h-[70vh]">
            <div className="w-full h-full">
              <iframe
                src={PROPOSAL_TEMPLATE_URL}
                className="w-full h-full border-0"
                title="Proposal Template"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </CardContent>
          <CardFooter className="bg-[#f8fcfd] p-4 border-t">
            <p className="text-sm text-[#56b0bb]/70">
              This template will be customized with your company&apos;s specific information when generating a proposal.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] border-[#56b0bb]/20 shadow-xl bg-[#f8fcfd]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-[#2d6e75] text-xl">Generate Custom Proposal</DialogTitle>
            <DialogDescription className="text-[#56b0bb]/80">
              Enter the company name to generate a customized proposal document.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <label htmlFor="companyName" className="block text-sm font-medium text-[#2d6e75] mb-2">
              Company Name
            </label>
            <Input
              id="companyName"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mb-2 border-[#56b0bb]/30 focus-visible:ring-[#56b0bb]"
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="border-[#56b0bb]/30 text-[#56b0bb] hover:bg-[#56b0bb]/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="bg-[#56b0bb] hover:bg-[#4a9da7] text-white shadow-md transition-all duration-300"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Loading overlay */}
      <ProposalLoader isGenerating={isGenerating} />
    </main>
  )
} 