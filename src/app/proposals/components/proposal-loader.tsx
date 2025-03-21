'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, CheckCircle, Sparkles, Lightbulb, PenTool, FileDown } from 'lucide-react'

interface ProposalLoaderProps {
  isGenerating: boolean
}

export function ProposalLoader({ isGenerating }: ProposalLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  
  const steps = [
    { icon: <CheckCircle className="text-green-500" size={18} />, text: "Analyzing template structure" },
    { icon: <PenTool className="text-[#56b0bb]" size={18} />, text: "Generating personalized content" },
    { icon: <Lightbulb className="text-amber-500" size={18} />, text: "Adding creative recommendations" },
    { icon: <FileDown className="text-[#2d6e75]" size={18} />, text: "Preparing your download" }
  ]
  
  const insightMessages = [
    "Tailoring proposal to your company's specific needs...",
    "Researching industry-specific insights...",
    "Customizing marketing strategies...",
    "Perfecting the proposal for maximum impact...",
    "Adding value propositions unique to your business...",
    "Generating compelling executive summary...",
    "Crafting persuasive call-to-action...",
    "Fine-tuning pricing and timeline details..."
  ]
  
  useEffect(() => {
    if (!isGenerating) return
    
    // Advance to next step every 2.5 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1) ? prev + 1 : prev)
    }, 2500)
    
    // Change message every 3 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % insightMessages.length)
    }, 3000)
    
    return () => {
      clearInterval(stepInterval)
      clearInterval(messageInterval)
    }
  }, [isGenerating, steps.length, insightMessages.length])
  
  // Reset progress when component is hidden and shown again
  useEffect(() => {
    if (isGenerating) {
      setCurrentStep(0)
      setCurrentMessage(0)
    }
  }, [isGenerating])

  if (!isGenerating) return null

  return (
    <div className="fixed inset-0 bg-[#2d6e75]/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-[#56b0bb]/20 rounded-xl shadow-2xl p-8 max-w-md w-full mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center justify-center gap-6 w-full"
        >
          <div className="relative flex items-center justify-center w-20 h-20 mx-auto">
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
              className="w-20 h-20 rounded-full border-4 border-[#e7f5f7] border-t-[#56b0bb] border-r-[#56b0bb]/70"
            />
            <motion.div 
              animate={{ scale: [0.8, 1, 0.8], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FileText className="text-[#56b0bb]" size={24} />
              <Sparkles className="absolute -top-2 -right-3 text-amber-400" size={14} />
            </motion.div>
          </div>
          
          <div className="space-y-2 text-center w-full">
            <h3 className="text-xl font-semibold text-[#2d6e75] text-center">Generating Your Proposal</h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-[#56b0bb]/70 text-sm h-10 flex items-center justify-center w-full"
              >
                {insightMessages[currentMessage]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col gap-3 w-full bg-[#f8fcfd] p-4 rounded-lg border border-[#56b0bb]/10">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                {index < currentStep ? (
                  <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                ) : index === currentStep ? (
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex-shrink-0"
                  >
                    {step.icon}
                  </motion.div>
                ) : (
                  <div className="w-[18px] h-[18px] ml-0.5 opacity-30 flex-shrink-0">
                    {step.icon}
                  </div>
                )}
                <span className={`text-sm ${index <= currentStep ? "text-[#2d6e75]" : "text-[#56b0bb]/40"}`}>
                  {step.text}
                </span>
                {index === currentStep && (
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-auto flex-shrink-0"
                  >
                    <span className="text-xs text-[#56b0bb]/70">In progress</span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center bg-[#e7f5f7] rounded-full px-4 py-1.5 mt-2 w-full max-w-xs mx-auto">
            <motion.div
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [0.98, 1, 0.98]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center gap-1.5 w-full"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-[#56b0bb] animate-pulse" />
              <span className="text-xs font-medium text-[#2d6e75]">Your proposal will be ready shortly</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 