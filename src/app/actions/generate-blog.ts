'use server'

interface MarketingContentRequest {
  topic: string
  medium?: string
  audience?: string[]
  outline?: string
  language?: string
  additionalInfo?: Record<string, string>
  profile?: string
  profile_content_prompt?: string
  research_data?: string
}

interface MarketingContentResponse {
  status: 'success' | 'error'
  content?: string
  metadata?: {
    topic: string
    medium: string
    audience: string[]
    language: string
    additionalInfo: Record<string, string>
    has_profile: boolean
    has_content_prompt: boolean
    has_research: boolean
  }
  error?: string
}

interface ResearchResponse {
  status: 'success' | 'error'
  data?: {
    topic: string
    research: string
  }
  error?: string
}

interface OutlineResponse {
  status: 'success' | 'error'
  data?: {
    topic: string
    medium: string
    outline: string
    has_research: boolean
  }
  error?: string
}

const API_URL = process.env.API_URL || 'https://65idhhxah8.execute-api.us-west-2.amazonaws.com/api';

export async function generateMarketingContent(data: MarketingContentRequest): Promise<MarketingContentResponse> {
  try {
    debugger;
    const response = await fetch(`${API_URL}/marketing-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to generate content')
    }

    const result: MarketingContentResponse = await response.json()
    return result
  } catch (error) {
    console.error('Error generating content:', error)
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function researchTopic(topic: string, medium: string): Promise<ResearchResponse> {
  try {
    const response = await fetch(`${API_URL}/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, medium }),
    })

    if (!response.ok) {
      throw new Error('Failed to research topic')
    }

    const result: ResearchResponse = await response.json()
    return result
  } catch (error) {
    console.error('Error researching topic:', error)
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function suggestOutline(topic: string, medium: string, research_data?: string): Promise<OutlineResponse> {
  try {
    const response = await fetch(`${API_URL}/suggest_outline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, medium, research_data }),
    })

    if (!response.ok) {
      throw new Error('Failed to suggest outline')
    }

    const result: OutlineResponse = await response.json()

    // Convert outline to markdown if it's not already
    if (result.status === 'success' && result.data && typeof result.data.outline === 'string') {
      // Assuming your API returns a plain text outline, convert it to Markdown here
      // You can use a library like 'turndown' for HTML to Markdown conversion if needed
      // For now, let's just wrap each line in a <p> tag for basic Markdown rendering
      result.data.outline = result.data.outline.split('\n').map(line => `<p>${line}</p>`).join('\n')
    }

    return result
  } catch (error) {
    console.error('Error suggesting outline:', error)
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

