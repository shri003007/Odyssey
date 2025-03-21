'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface SocialIntegrationContextType {
  linkedinConnected: boolean
  twitterConnected: boolean
  connectLinkedin: () => void
  disconnectLinkedin: () => void
  connectTwitter: () => void
  disconnectTwitter: () => void
}

const SocialIntegrationContext = createContext<SocialIntegrationContextType | undefined>(undefined)

export function SocialIntegrationProvider({ children }: { children: React.ReactNode }) {
  const [linkedinConnected, setLinkedinConnected] = useState(false)
  const [twitterConnected, setTwitterConnected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load initial integration states from localStorage
    const linkedinStatus = localStorage.getItem("linkedinConnected")
    const twitterStatus = localStorage.getItem("twitterConnected")
    
    if (linkedinStatus) {
      setLinkedinConnected(linkedinStatus === "true")
    }
    
    if (twitterStatus) {
      setTwitterConnected(twitterStatus === "true")
    }
  }, [])

  const connectLinkedin = () => {
    // In a real implementation, this would initiate OAuth flow with LinkedIn
    setLinkedinConnected(true)
    localStorage.setItem("linkedinConnected", "true")
    toast({
      title: "LinkedIn Connected",
      description: "Your LinkedIn account has been connected successfully.",
    })
  }
  
  const disconnectLinkedin = () => {
    setLinkedinConnected(false)
    localStorage.setItem("linkedinConnected", "false")
    toast({
      title: "LinkedIn Disconnected",
      description: "Your LinkedIn account has been disconnected.",
    })
  }
  
  const connectTwitter = () => {
    // In a real implementation, this would initiate OAuth flow with Twitter
    setTwitterConnected(true)
    localStorage.setItem("twitterConnected", "true")
    toast({
      title: "Twitter Connected",
      description: "Your Twitter account has been connected successfully.",
    })
  }
  
  const disconnectTwitter = () => {
    setTwitterConnected(false)
    localStorage.setItem("twitterConnected", "false")
    toast({
      title: "Twitter Disconnected",
      description: "Your Twitter account has been disconnected.",
    })
  }

  return (
    <SocialIntegrationContext.Provider value={{ 
      linkedinConnected, 
      twitterConnected, 
      connectLinkedin, 
      disconnectLinkedin, 
      connectTwitter, 
      disconnectTwitter 
    }}>
      {children}
    </SocialIntegrationContext.Provider>
  )
}

export const useSocialIntegration = () => {
  const context = useContext(SocialIntegrationContext)
  if (context === undefined) {
    throw new Error('useSocialIntegration must be used within a SocialIntegrationProvider')
  }
  return context
} 