'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Box, Button, Flex, Text } from '@sparrowengg/twigs-react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle,
  Users, 
  Code, 
  Rocket,
  BarChart
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/auth-provider'

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

export default function AboutPage() {
  const { user } = useAuth()

  // Core values
  const values = [
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Innovation",
      description: "We constantly push the boundaries of what AI can do for content creation."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Collaboration",
      description: "We believe in AI assisting humans, not replacing them."
    },
    {
      icon: <BarChart className="h-6 w-6 text-primary" />,
      title: "Quality",
      description: "We're committed to delivering tools that produce excellent content."
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Accessibility",
      description: "We make advanced AI technology accessible to businesses of all sizes."
    }
  ]

  // Testimonials
  const testimonials = [
    {
      quote: "Sparrow Writer has transformed how our marketing team operates. We've cut content creation time in half while improving quality.",
      author: "Sarah Johnson",
      position: "Marketing Director, TechCorp"
    },
    {
      quote: "As a solopreneur, Sparrow Writer has been a game-changer. It's like having a content team at my fingertips.",
      author: "Mark Rivera",
      position: "Founder, Digital Nomad Gear"
    },
    {
      quote: "The templates are brilliant, and the AI suggestions always feel on-brand. I can't imagine going back to writing everything manually.",
      author: "Aisha Patel",
      position: "Content Strategist, Bloom Agency"
    }
  ]

  // FAQ items
  const faqItems = [
    {
      question: "How does Sparrow Writer's AI work?",
      answer: "Sparrow Writer uses advanced language models trained on high-quality marketing content. When you provide a topic or brief, our AI analyzes the context and generates relevant, engaging content tailored to your needs."
    },
    {
      question: "Is the content unique and original?",
      answer: "Yes, all content generated by Sparrow Writer is unique. Our AI creates fresh content for each request, and you can further customize it to match your brand voice and style."
    },
    {
      question: "Do I need technical skills to use Sparrow Writer?",
      answer: "Not at all. We've designed Sparrow Writer to be intuitive and user-friendly. If you can use a word processor, you can use Sparrow Writer."
    },
    {
      question: "What types of content can I create?",
      answer: "Sparrow Writer supports a wide range of content types including blog posts, social media updates, email newsletters, ad copy, product descriptions, and more. Our template library continues to expand based on user needs."
    }
  ]

  return (
    <main className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <Box className="relative overflow-hidden pt-20 md:pt-28 lg:pt-32 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-center" />
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 30%, hsl(var(--primary)) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            filter: 'blur(50px)'
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut"
          }}
        />
        
        <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center mb-10 md:mb-16"
          >
            <motion.div custom={0} variants={fadeIn}>
              <Box className="flex items-center justify-center gap-2 mb-6">
                <Box className="rounded-full bg-primary/10 px-4 py-1.5 border border-primary/20 text-primary/90 text-sm font-medium">
                  Our Story
                </Box>
              </Box>
              
              <Text 
                as="h1" 
                className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 leading-tight"
              >
                About Sparrow Writer
              </Text>
            </motion.div>
            
            <motion.div custom={1} variants={fadeIn}>
              <Text className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Revolutionizing marketing content creation with AI-powered tools.
              </Text>
            </motion.div>
          </motion.div>
        </Box>
      </Box>

      {/* Mission and Features Section */}
      <Box className="py-16 md:py-24 bg-muted/10">
        <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-6 md:p-8 border border-primary/20">
                <Image 
                  src="/images/logo.svg" 
                  alt="Sparrow Writer Logo"
                  width={120}
                  height={120}
                  className="mx-auto mb-6"
                />
                <Text as="h2" className="text-2xl md:text-3xl font-bold text-center mb-4">
                  Our Mission
                </Text>
                <Text as="p" className="text-muted-foreground">
                  At Sparrow Writer, we&apos;re on a mission to empower marketers, content creators, and businesses to produce high-quality content efficiently. By harnessing the power of AI, we&apos;ve built a platform that streamlines your workflow and enhances your creative process.
                </Text>
              </Box>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Text as="h2" className="text-2xl md:text-3xl font-bold mb-6">
                What We <span className="text-primary">Offer</span>
              </Text>
              <Box className="space-y-5">
                <Box className="flex gap-3">
                  <Box className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-semibold">1</span>
                  </Box>
                  <Box>
                    <Text as="h3" className="font-semibold text-lg">AI-Powered Content Creation</Text>
                    <Text as="p" className="text-muted-foreground">
                      Generate marketing copy, social media posts, and product descriptions in seconds.
                    </Text>
                  </Box>
                </Box>
                
                <Box className="flex gap-3">
                  <Box className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-semibold">2</span>
                  </Box>
                  <Box>
                    <Text as="h3" className="font-semibold text-lg">Customizable Templates</Text>
                    <Text as="p" className="text-muted-foreground">
                      Access a library of templates designed for various marketing needs and platforms.
                    </Text>
                  </Box>
                </Box>
                
                <Box className="flex gap-3">
                  <Box className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-semibold">3</span>
                  </Box>
                  <Box>
                    <Text as="h3" className="font-semibold text-lg">Analytics & Insights</Text>
                    <Text as="p" className="text-muted-foreground">
                      Track performance and get recommendations to improve your content strategy.
                    </Text>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </div>
        </Box>
      </Box>
      
      {/* Our Story Section */}
      <Box className="py-16 md:py-24 bg-background">
        <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <Box className="text-center max-w-3xl mx-auto mb-12">
            <Box className="mb-4 w-fit mx-auto px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
              Our Journey
            </Box>
            <Text as="h2" className="text-3xl sm:text-4xl font-bold mb-6">
              The <span className="text-primary">Sparrow Writer</span> Story
            </Text>
          </Box>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box className="bg-background p-8 rounded-xl border border-border max-w-3xl mx-auto shadow-lg backdrop-blur-sm">
              <Box className="space-y-4">
                <Text as="p">
                  Sparrow Writer began with a simple observation: marketers were spending too much time creating content and not enough time connecting with their audience.
                </Text>
                <Text as="p">
                  Founded in 2023, our team of AI specialists and marketing experts came together to build a solution that would transform how content is created. We developed a platform that combines powerful AI models with intuitive design to help marketers overcome their content creation challenges.
                </Text>
                <Text as="p">
                  Today, Sparrow Writer serves thousands of businesses worldwide, from solopreneurs to enterprise teams, all benefiting from our AI-powered content creation tools.
                </Text>
              </Box>
              
              <Flex className="mt-8 justify-center gap-10 flex-wrap">
                <Box className="text-center">
                  <Text className="text-3xl font-bold text-primary">2023</Text>
                  <Text className="text-sm text-muted-foreground">Founded</Text>
                </Box>
                <Box className="text-center">
                  <Text className="text-3xl font-bold text-primary">10k+</Text>
                  <Text className="text-sm text-muted-foreground">Users</Text>
                </Box>
                <Box className="text-center">
                  <Text className="text-3xl font-bold text-primary">24/7</Text>
                  <Text className="text-sm text-muted-foreground">Support</Text>
                </Box>
              </Flex>
            </Box>
          </motion.div>
        </Box>
      </Box>
      
      {/* Why Choose Us Section */}
      <Box className="py-16 md:py-24 bg-muted/10">
        <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <Box className="text-center max-w-3xl mx-auto mb-12">
            <Box className="mb-4 w-fit mx-auto px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
              Benefits
            </Box>
            <Text as="h2" className="text-3xl sm:text-4xl font-bold mb-6">
              Why Choose <span className="text-primary">Sparrow Writer</span>
            </Text>
          </Box>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
            >
              <Card className="p-6 h-full flex flex-col border-border backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <Box className="w-12 h-12 mb-4 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                  <Rocket className="h-6 w-6" />
                </Box>
                <Text as="h3" className="font-semibold text-lg mb-2">Efficiency</Text>
                <Text as="p" className="text-muted-foreground flex-grow">
                  Reduce content creation time by up to 75% with our AI-powered tools.
                </Text>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="p-6 h-full flex flex-col border-border backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <Box className="w-12 h-12 mb-4 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                  <CheckCircle className="h-6 w-6" />
                </Box>
                <Text as="h3" className="font-semibold text-lg mb-2">Quality</Text>
                <Text as="p" className="text-muted-foreground flex-grow">
                  Our AI has been trained on high-performing marketing content to ensure quality output.
                </Text>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="p-6 h-full flex flex-col border-border backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <Box className="w-12 h-12 mb-4 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                  <ArrowRight className="h-6 w-6" />
                </Box>
                <Text as="h3" className="font-semibold text-lg mb-2">Customization</Text>
                <Text as="p" className="text-muted-foreground flex-grow">
                  Adapt content to your brand voice and style with powerful customization options.
                </Text>
              </Card>
            </motion.div>
          </div>
        </Box>
      </Box>
      
      {/* Core Values */}
      <Box className="py-16 md:py-24 bg-background">
        <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <Box className="text-center max-w-3xl mx-auto mb-12">
            <Box className="mb-4 w-fit mx-auto px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
              Our Principles
            </Box>
            <Text as="h2" className="text-3xl sm:text-4xl font-bold mb-6">
              Our Core <span className="text-primary">Values</span>
            </Text>
          </Box>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 border-border/60 h-full flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <Box className="w-12 h-12 mb-4 bg-primary/20 rounded-md flex items-center justify-center text-primary mx-auto">
                    {value.icon}
                  </Box>
                  <Text as="h3" className="font-semibold text-lg mb-2 text-center">{value.title}</Text>
                  <Text as="p" className="text-muted-foreground text-center">
                    {value.description}
                  </Text>
                </Card>
              </motion.div>
            ))}
          </div>
        </Box>
      </Box>
      
      {/* Testimonials */}
      <Box className="py-16 md:py-24 bg-muted/20">
        <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <Box className="text-center max-w-3xl mx-auto mb-12">
            <Box className="mb-4 w-fit mx-auto px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
              Testimonials
            </Box>
            <Text as="h2" className="text-3xl sm:text-4xl font-bold mb-6">
              What Our <span className="text-primary">Users Say</span>
            </Text>
          </Box>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 border-border/60 h-full flex flex-col bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <Box className="mb-4">
                    <svg width="96" height="24" viewBox="0 0 96 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-400">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                      <path d="M36 2L39.09 8.26L46 9.27L41 14.14L42.18 21.02L36 17.77L29.82 21.02L31 14.14L26 9.27L32.91 8.26L36 2Z" fill="currentColor" />
                      <path d="M60 2L63.09 8.26L70 9.27L65 14.14L66.18 21.02L60 17.77L53.82 21.02L55 14.14L50 9.27L56.91 8.26L60 2Z" fill="currentColor" />
                      <path d="M84 2L87.09 8.26L94 9.27L89 14.14L90.18 21.02L84 17.77L77.82 21.02L79 14.14L74 9.27L80.91 8.26L84 2Z" fill="currentColor" />
                    </svg>
                  </Box>
                  <Text className="italic text-muted-foreground mb-4 flex-grow">
                    &quot;{testimonial.quote}&quot;
                  </Text>
                  <Box>
                    <Text as="h4" className="font-semibold">{testimonial.author}</Text>
                    <Text as="p" className="text-sm text-muted-foreground">{testimonial.position}</Text>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </div>
        </Box>
      </Box>
      
      {/* FAQ Section */}
      <Box className="py-16 md:py-24 bg-background">
        <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <Box className="text-center max-w-3xl mx-auto mb-12">
            <Box className="mb-4 w-fit mx-auto px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
              FAQ
            </Box>
            <Text as="h2" className="text-3xl sm:text-4xl font-bold mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </Text>
          </Box>
          
          <Box className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 border-border bg-background/70 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                  <Text as="h3" className="font-semibold text-lg mb-2">{item.question}</Text>
                  <Text as="p" className="text-muted-foreground">
                    {item.answer}
                  </Text>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
      
      {/* CTA Section */}
      <Box className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 mt-auto">
        <Box className="max-w-5xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-8 md:p-12 lg:p-16 border border-primary/20 shadow-xl text-center"
          >
            <Box className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            <Box className="relative z-10">
              <Text as="h2" className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to transform your content creation?
              </Text>
              <Text className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of marketers who are already saving time and producing better content with Sparrow Writer.
              </Text>
              
              <Flex className="justify-center">
                {user ? (
                  <Link href="/create">
                    <Button 
                      size="lg"
                      className="rounded-full h-14 px-8 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                      Start Creating
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button 
                      size="lg"
                      className="rounded-full h-14 px-8 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </Flex>
            </Box>
            
            {/* Decorative elements */}
            <Box className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <Box className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          </motion.div>
        </Box>
      </Box>
    </main>
  )
} 