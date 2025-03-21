'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Linkedin, 
  Twitter, 
  Share2, 
  ArrowRight, 
  CheckCircle,
  Globe,
  Users,
  Info,
  ChevronRight,
  Link,
  ExternalLink,
  Zap
} from 'lucide-react'
import { Box, Flex, Heading, Text } from '@sparrowengg/twigs-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NavSidebar } from '@/components/nav-sidebar'
import { Header } from '@/components/header'
import { useAuth } from '@/context/auth-provider'
import { useSocialIntegration } from '@/context/social-integration-provider'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

// Fade in animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

export default function IntegrationsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { 
    linkedinConnected, 
    twitterConnected, 
    connectLinkedin, 
    disconnectLinkedin, 
    connectTwitter, 
    disconnectTwitter 
  } = useSocialIntegration()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavSidebar />
      <Header />
      <main className="pt-20 pl-16 px-4 md:px-8">
        <TooltipProvider>
          <Box className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-6"
            >
              <Heading as="h1" className="text-4xl font-bold mb-2">Integrations</Heading>
              <Text className="text-xl text-muted-foreground">Connect your accounts and enhance your marketing workflow</Text>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
            >
              <Tabs defaultValue="social" className="w-full mb-10">
                <TabsList className="w-full justify-start mb-6 border-b bg-transparent h-auto p-0 space-x-6">
                </TabsList>
                
                <TabsContent value="social" className="mt-0">
                  <Box className="bg-muted/30 p-6 rounded-lg border border-border mb-8">
                    <Flex className="items-center gap-3 mb-4">
                      <Share2 className="h-5 w-5 text-primary" />
                      <Text className="font-medium">Why Connect Your Social Accounts?</Text>
                    </Flex>
                    <Text className="text-muted-foreground mb-4">
                      Connecting your social media accounts enables seamless content distribution and engagement tracking across platforms, 
                      saving you time and maintaining consistent brand messaging.
                    </Text>
                    <Flex className="flex-wrap gap-4">
                      <Flex className="items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <Text className="text-sm">One-click multi-platform sharing</Text>
                      </Flex>
                      <Flex className="items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <Text className="text-sm">Unified analytics dashboard</Text>
                      </Flex>
                      <Flex className="items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <Text className="text-sm">Automated scheduling</Text>
                      </Flex>
                    </Flex>
                  </Box>
                  
                  <Box className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-12">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeIn}
                      custom={2}
                      className="h-full"
                    >
                      <Card className="h-full overflow-hidden border-solid hover:border-primary/40 transition-all duration-200">
                        <CardHeader className="bg-gradient-to-r from-[#0A66C2]/5 to-transparent">
                          <Flex className="justify-between items-start">
                            <Box>
                              <Flex className="items-center gap-2">
                                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                                <CardTitle>LinkedIn</CardTitle>
                              </Flex>
                              <CardDescription className="mt-1">
                                Professional network for business content
                              </CardDescription>
                            </Box>
                            <Flex className="items-center gap-2">
                              {linkedinConnected && (
                                <Box className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Connected</span>
                                </Box>
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Box as="span" className="cursor-help">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </Box>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Connect to share on your LinkedIn profile or company pages</p>
                                </TooltipContent>
                              </Tooltip>
                            </Flex>
                          </Flex>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <Flex className="justify-between items-center mb-4">
                            <Label htmlFor="linkedin-toggle" className="font-medium cursor-pointer flex items-center gap-2">
                              Enable LinkedIn
                              {linkedinConnected && <Zap className="h-3.5 w-3.5 text-primary" />}
                            </Label>
                            <Switch 
                              id="linkedin-toggle" 
                              checked={linkedinConnected}
                              onCheckedChange={(checked) => {
                                if (checked) connectLinkedin();
                                else disconnectLinkedin();
                              }}
                            />
                          </Flex>
                          
                          <Separator className="my-4" />
                          
                          <Text className="text-sm text-muted-foreground mb-4">
                            Share your marketing content directly to your LinkedIn profile or company page.
                            Perfect for professional articles, industry insights, and company announcements.
                          </Text>
                          <Flex className="mt-4 gap-3 flex-wrap">
                            <Flex className="items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                              <Users className="h-3 w-3" />
                              <span>Professional Network</span>
                            </Flex>
                            <Flex className="items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                              <Globe className="h-3 w-3" />
                              <span>Business Focused</span>
                            </Flex>
                            <Flex className="items-center gap-1.5 text-xs text-primary bg-primary/5 px-2 py-1 rounded-full">
                              <Link className="h-3 w-3" />
                              <span>API v2.0</span>
                            </Flex>
                          </Flex>
                        </CardContent>
                        <CardFooter className="pt-0 flex-col items-stretch gap-3">
                          {linkedinConnected ? (
                            <Flex className="items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                              <span>Connected as {user?.displayName || 'User'}</span>
                              <Button 
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/settings')}
                                className="h-auto p-0 hover:bg-transparent hover:text-primary"
                              >
                                Edit <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Flex>
                          ) : (
                            <Button 
                              onClick={connectLinkedin}
                              className="w-full"
                            >
                              Connect LinkedIn
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                          
                          {linkedinConnected && (
                            <Button 
                              variant="outline" 
                              onClick={disconnectLinkedin}
                              className="w-full"
                            >
                              Disconnect Account
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeIn}
                      custom={3}
                      className="h-full"
                    >
                      <Card className="h-full overflow-hidden border-solid hover:border-primary/40 transition-all duration-200">
                        <CardHeader className="bg-gradient-to-r from-[#1DA1F2]/5 to-transparent">
                          <Flex className="justify-between items-start">
                            <Box>
                              <Flex className="items-center gap-2">
                                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                                <CardTitle>Twitter (X)</CardTitle>
                              </Flex>
                              <CardDescription className="mt-1">
                                Real-time updates and conversations
                              </CardDescription>
                            </Box>
                            <Flex className="items-center gap-2">
                              {twitterConnected && (
                                <Box className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Connected</span>
                                </Box>
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Box as="span" className="cursor-help">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </Box>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Connect to share content as tweets and manage engagement</p>
                                </TooltipContent>
                              </Tooltip>
                            </Flex>
                          </Flex>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <Flex className="justify-between items-center mb-4">
                            <Label htmlFor="twitter-toggle" className="font-medium cursor-pointer flex items-center gap-2">
                              Enable Twitter
                              {twitterConnected && <Zap className="h-3.5 w-3.5 text-primary" />}
                            </Label>
                            <Switch 
                              id="twitter-toggle" 
                              checked={twitterConnected}
                              onCheckedChange={(checked) => {
                                if (checked) connectTwitter();
                                else disconnectTwitter();
                              }}
                            />
                          </Flex>
                          
                          <Separator className="my-4" />
                          
                          <Text className="text-sm text-muted-foreground mb-4">
                            Share your content as tweets to engage with your audience in real-time.
                            Ideal for announcements, quick updates, and starting conversations with your followers.
                          </Text>
                          <Flex className="mt-4 gap-3 flex-wrap">
                            <Flex className="items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                              <Users className="h-3 w-3" />
                              <span>Broad Audience</span>
                            </Flex>
                            <Flex className="items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                              <Globe className="h-3 w-3" />
                              <span>Real-time Engagement</span>
                            </Flex>
                            <Flex className="items-center gap-1.5 text-xs text-primary bg-primary/5 px-2 py-1 rounded-full">
                              <Link className="h-3 w-3" />
                              <span>API v2.0</span>
                            </Flex>
                          </Flex>
                        </CardContent>
                        <CardFooter className="pt-0 flex-col items-stretch gap-3">
                          {twitterConnected ? (
                            <Flex className="items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                              <span>Connected as @{user?.email?.split('@')[0] || 'username'}</span>
                              <Button 
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/settings')}
                                className="h-auto p-0 hover:bg-transparent hover:text-primary"
                              >
                                Edit <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </Flex>
                          ) : (
                            <Button 
                              onClick={connectTwitter}
                              className="w-full"
                            >
                              Connect Twitter
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                          
                          {twitterConnected && (
                            <Button 
                              variant="outline" 
                              onClick={disconnectTwitter}
                              className="w-full"
                            >
                              Disconnect Account
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </Box>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-0">
                  <Box className="bg-muted/30 p-6 rounded-lg border border-border mb-8">
                    <Flex className="items-center gap-3 mb-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <Text className="font-medium">Analytics Integrations</Text>
                    </Flex>
                    <Text className="text-muted-foreground mb-2">
                      Connect your analytics platforms to track performance across all your marketing campaigns.
                    </Text>
                    <Box className="py-6 text-center">
                      <Text className="text-muted-foreground mb-4">Analytics integrations coming soon!</Text>
                      <Button variant="outline" onClick={() => router.push('/settings')}>
                        Request Early Access
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Box>
                  </Box>
                </TabsContent>
                
                <TabsContent value="crm" className="mt-0">
                  <Box className="bg-muted/30 p-6 rounded-lg border border-border mb-8">
                    <Flex className="items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <Text className="font-medium">CRM Integrations</Text>
                    </Flex>
                    <Text className="text-muted-foreground mb-2">
                      Connect your CRM systems to better target your audience and track customer interactions.
                    </Text>
                    <Box className="py-6 text-center">
                      <Text className="text-muted-foreground mb-4">CRM integrations coming soon!</Text>
                      <Button variant="outline" onClick={() => router.push('/settings')}>
                        Request Early Access
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Box>
                  </Box>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={4}
              className="mb-10"
            >
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <Flex className="justify-between items-center flex-wrap gap-4">
                    <Box>
                      <Heading as="h2" className="text-xl font-semibold mb-1">Integration Settings</Heading>
                      <Text className="text-muted-foreground">
                        Configure advanced options and manage your connected accounts
                      </Text>
                    </Box>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/settings')}
                      className="gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Advanced Settings
                    </Button>
                  </Flex>
                </CardContent>
              </Card>
            </motion.div> */}
          </Box>
        </TooltipProvider>
      </main>
    </div>
  )
} 