"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  LayoutTemplate,
  LineChart,
  PenLine,
  Rocket,
  Zap,
  CreditCard,
} from "lucide-react";
import { Box, Flex, Button, Heading, Text } from "@sparrowengg/twigs-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/auth-provider";
import { useEffect } from "react";
import { getProfiles } from "./lib/profiles";

// Fade in animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function Home() {
  const router = useRouter();
  const { user, userId, setProfiles } = useAuth();
  const features = [
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Launch Campaigns",
      description:
        "Quickly create and launch marketing campaigns with AI-powered content generation.",
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      title: "AI-Powered Insights",
      description:
        "Gain valuable insights and recommendations for your marketing strategy.",
    },
    {
      icon: <LayoutTemplate className="h-6 w-6 text-primary" />,
      title: "Content Templates",
      description:
        "Access a library of templates for various marketing needs and platforms.",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Cost-Effective",
      description:
        "Save on marketing costs with efficient AI-generated content and campaigns.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Sparrow Writer has transformed how we create content. We've reduced our content creation time by 75% while increasing engagement.",
      author: "Sarah Johnson",
      position: "Marketing Director",
      company: "TechGrowth Inc.",
    },
    {
      quote:
        "The AI-powered insights are like having an expert consultant available 24/7. It's changed how we approach our marketing strategy.",
      author: "Michael Chen",
      position: "Content Strategist",
      company: "MediaPulse",
    },
    {
      quote:
        "The templates save us hours of work every week. They're well-designed and easy to customize for our brand voice.",
      author: "Priya Patel",
      position: "Social Media Manager",
      company: "Elevate Digital",
    },
  ];

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        console.log("Loading profiles...");
        if (userId) {
          const data = await getProfiles(userId);
          console.log("Profiles loaded:", data);
          setProfiles(data);
        }
      } catch (err) {
        console.error("Error loading profiles:", err);
      }
    };
    loadProfiles();
  }, [userId, setProfiles]);

  return (
    <main className="flex flex-col min-h-screen overflow-hidden">
      {user ? (
        // AUTHENTICATED USER EXPERIENCE - Dashboard view

        <Box className="relative overflow-hidden pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-center" />
          {/* <motion.div 
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
            /> */}

          <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Heading as="h1" className="text-3xl md:text-4xl font-bold mb-3">
                Welcome back,{" "}
                <span className="text-primary">
                  {user?.displayName?.split(" ")[0] || "User"}
                </span>
              </Heading>
              <Text className="text-lg text-muted-foreground">
                Ready to create some amazing content today?
              </Text>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-10"
            >
              <Heading as="h2" className="text-xl font-semibold mb-4">
                Quick Actions
              </Heading>
              <Flex className="gap-4 flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    leftIcon={<PenLine size={18} />}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-6 shadow-sm"
                    onClick={() => router.push("/ideas")}
                  >
                    New Content
                  </Button>
                </motion.div>
                {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      leftIcon={<LayoutTemplate size={18} />}
                      className="bg-background border-border hover:bg-muted/50 rounded-lg px-5 py-6"
                      onClick={() => router.push('/templates')}
                    >
                      Templates
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                      variant="outline" 
                      size="lg"
                      leftIcon={<LineChart size={18} />}
                      className="bg-background border-border hover:bg-muted/50 rounded-lg px-5 py-6"
                      onClick={() => router.push('/analytics')}
                    >
                      Analytics
                    </Button>
                  </motion.div> */}
              </Flex>
            </motion.div>

            {/* Dashboard Grid */}
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recent Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="md:col-span-2"
              >
                <Card className="p-6 h-full border-border/60 bg-background/50 backdrop-blur-sm">
                  <Flex className="justify-between items-center mb-5">
                    <Heading as="h2" className="text-xl font-semibold">
                      Recent Projects
                    </Heading>
                    <Link
                      href="/projects"
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      View All
                    </Link>
                  </Flex>

                  <Box className="space-y-4">
                    {/* Example projects - in a real app, these would come from an API */}
                    {[
                      {
                        id: 1,
                        title: "Q2 Marketing Campaign",
                        updatedAt: "2 hours ago",
                        progress: 80,
                      },
                      {
                        id: 2,
                        title: "Product Launch Email Sequence",
                        updatedAt: "Yesterday",
                        progress: 60,
                      },
                      {
                        id: 3,
                        title: "Social Media Content Calendar",
                        updatedAt: "3 days ago",
                        progress: 30,
                      },
                    ].map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.3 + index * 0.1,
                          duration: 0.4,
                        }}
                        whileHover={{
                          y: -2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Box
                          className="p-4 rounded-lg border border-border/60 bg-background hover:shadow-sm transition-all cursor-pointer"
                          onClick={() => router.push(`/projects/${project.id}`)}
                        >
                          <Flex className="justify-between items-start mb-3">
                            <Text className="font-medium">{project.title}</Text>
                            <Text className="text-xs text-muted-foreground">
                              {project.updatedAt}
                            </Text>
                          </Flex>
                          <Box className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <Box
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Card>
              </motion.div>

              {/* Activity Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="p-6 h-full border-border/60 bg-background/50 backdrop-blur-sm">
                  <Heading as="h2" className="text-xl font-semibold mb-5">
                    Activity Overview
                  </Heading>

                  <Box className="space-y-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{
                        delay: 0.5,
                        duration: 1,
                        ease: "easeOut",
                      }}
                    >
                      <Box>
                        <Flex className="justify-between items-center mb-2">
                          <Text className="text-sm text-muted-foreground">
                            Content Created
                          </Text>
                          <Text className="font-medium">12</Text>
                        </Flex>
                        <Box className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "60%" }}
                            transition={{
                              delay: 0.5,
                              duration: 1,
                              ease: "easeOut",
                            }}
                          />
                        </Box>
                      </Box>
                    </motion.div>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "40%" }}
                      transition={{
                        delay: 0.7,
                        duration: 1,
                        ease: "easeOut",
                      }}
                    >
                      <Box>
                        <Flex className="justify-between items-center mb-2">
                          <Text className="text-sm text-muted-foreground">
                            Templates Used
                          </Text>
                          <Text className="font-medium">8</Text>
                        </Flex>
                        <Box className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "40%" }}
                            transition={{
                              delay: 0.7,
                              duration: 1,
                              ease: "easeOut",
                            }}
                          />
                        </Box>
                      </Box>
                    </motion.div>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "68%" }}
                      transition={{
                        delay: 0.9,
                        duration: 1,
                        ease: "easeOut",
                      }}
                    >
                      <Box>
                        <Flex className="justify-between items-center mb-2">
                          <Text className="text-sm text-muted-foreground">
                            Engagement Rate
                          </Text>
                          <Text className="font-medium">68%</Text>
                        </Flex>
                        <Box className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "68%" }}
                            transition={{
                              delay: 0.9,
                              duration: 1,
                              ease: "easeOut",
                            }}
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  </Box>
                </Card>
              </motion.div>
            </Box>

            {/* Recommended Templates */}
            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8"
              >
                <Flex className="justify-between items-center mb-5">
                  <Heading as="h2" className="text-xl font-semibold">
                    Recommended Templates
                  </Heading>
                  <Link href="/templates" className="text-primary text-sm font-medium hover:underline">
                    View All Templates
                  </Link>
                </Flex>
                
                <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { id: 1, title: "Social Media Post", category: "Social", icon: <Rocket className="h-5 w-5 text-primary" /> },
                    { id: 2, title: "Email Newsletter", category: "Email", icon: <BrainCircuit className="h-5 w-5 text-primary" /> },
                    { id: 3, title: "Product Description", category: "E-commerce", icon: <LayoutTemplate className="h-5 w-5 text-primary" /> },
                  ].map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1), duration: 0.4 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="p-5 border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                        onClick={() => router.push(`/templates/${template.id}`)}
                      >
                        <Flex className="items-start gap-3">
                          <Box className="p-2 rounded-lg bg-primary/10">
                            {template.icon}
                          </Box>
                          <Box>
                            <Text className="font-medium">{template.title}</Text>
                            <Text className="text-xs text-muted-foreground">{template.category}</Text>
                          </Box>
                        </Flex>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </motion.div> */}
          </Box>
        </Box>
      ) : (
        // NON-AUTHENTICATED USER EXPERIENCE - Marketing landing page
        <>
          {/* Hero Section */}
          <Box className="relative overflow-hidden pt-20 md:pt-28 lg:pt-32 pb-16 md:pb-24">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-center" />
            <motion.div
              className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 30%, hsl(var(--primary)) 0%, transparent 50%)",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                filter: "blur(50px)",
              }}
              animate={{
                opacity: [0.05, 0.15, 0.05],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 15,
                ease: "easeInOut",
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
                      <motion.span
                        animate={{
                          opacity: [1, 0.8, 1],
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut",
                        }}
                      >
                        ✨ Powered by AI
                      </motion.span>
                    </Box>
                  </Box>

                  <Heading
                    as="h1"
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 leading-tight"
                  >
                    Transform Your Marketing with AI Power
                  </Heading>
                </motion.div>

                <motion.div custom={1} variants={fadeIn}>
                  <Text className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    Create compelling marketing content in seconds with our
                    AI-powered platform. Boost engagement, save time, and drive
                    better results.
                  </Text>
                </motion.div>

                <motion.div custom={2} variants={fadeIn}>
                  <Flex className="flex-col sm:flex-row gap-4 md:gap-5 mt-8 sm:mt-10 justify-center">
                    <Button
                      size="lg"
                      leftIcon={<ArrowRight size={20} />}
                      className="rounded-full h-14 px-6 sm:px-8 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
                      onClick={() => router.push("/login")}
                    >
                      Get Started Free
                    </Button>
                  </Flex>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Flex className="justify-center gap-6 sm:gap-10 md:gap-16 py-6 md:py-10 flex-wrap">
                  <Box className="text-center px-4 py-3">
                    <Text className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                      10x
                    </Text>
                    <Text className="text-sm md:text-base text-muted-foreground mt-1">
                      Faster Content Creation
                    </Text>
                  </Box>
                  <Box className="text-center px-4 py-3">
                    <Text className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                      90%
                    </Text>
                    <Text className="text-sm md:text-base text-muted-foreground mt-1">
                      Time Saved
                    </Text>
                  </Box>
                  <Box className="text-center px-4 py-3">
                    <Text className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                      24/7
                    </Text>
                    <Text className="text-sm md:text-base text-muted-foreground mt-1">
                      Creative Support
                    </Text>
                  </Box>
                </Flex>
              </motion.div>

              {/* Demo Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="mt-10 md:mt-16"
              >
                <Box className="relative rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-muted/30 backdrop-blur-sm mx-auto max-w-5xl">
                  <Box className="aspect-[16/9] w-full bg-gradient-to-br from-background to-muted overflow-hidden">
                    <Text
                      id="placeholder-text"
                      className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground px-4"
                    >
                      Interactive Demo Coming Soon
                    </Text>
                  </Box>

                  {/* Floating feature labels */}
                  <Box className="absolute top-8 right-8 rounded-lg bg-background/80 backdrop-blur-md px-4 py-2 border border-border/60 shadow-lg">
                    <Text className="text-primary font-semibold flex items-center">
                      <Zap size={16} className="mr-2" />
                      AI-Powered Content
                    </Text>
                  </Box>

                  <Box className="absolute bottom-8 left-8 rounded-lg bg-background/80 backdrop-blur-md px-4 py-2 border border-border/60 shadow-lg">
                    <Text className="text-primary font-semibold flex items-center">
                      <LineChart size={16} className="mr-2" />
                      Real-time Analytics
                    </Text>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Box>

          {/* Features Section */}
          <Box className="py-20 md:py-28 bg-muted/10">
            <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
              <Box className="text-center max-w-3xl mx-auto mb-16">
                <Box className="mb-4 w-fit mx-auto px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
                  Product Features
                </Box>
                <Heading
                  as="h2"
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                >
                  Features That{" "}
                  <span className="text-primary">Power Your Marketing</span>
                </Heading>
                <Text className="text-lg text-muted-foreground">
                  Our AI-powered platform provides all the tools you need to
                  create exceptional marketing content
                </Text>
              </Box>

              <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Card className="p-6 md:p-8 h-full flex flex-col border-border/60 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:translate-y-[-4px] bg-background/50 backdrop-blur-sm">
                      <Box className="mb-5 p-3 rounded-xl bg-primary/10 w-fit">
                        {feature.icon}
                      </Box>
                      <Heading as="h3" className="text-xl font-semibold mb-3">
                        {feature.title}
                      </Heading>
                      <Text className="text-muted-foreground text-base flex-grow">
                        {feature.description}
                      </Text>
                      <Box className="mt-5">
                        <Link
                          href="/about"
                          className="text-primary font-medium text-sm flex items-center gap-1.5 hover:underline hover:gap-2 transition-all"
                        >
                          Learn more <ArrowRight size={16} />
                        </Link>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Keep the Benefits, Testimonials and CTA sections here */}
          <Box className="py-20 md:py-28 bg-muted/20">
            <Box className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
              <Box className="text-center max-w-3xl mx-auto mb-16">
                <Box className="mb-4 w-fit mx-auto px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
                  Testimonials
                </Box>
                <Heading
                  as="h2"
                  className="text-3xl sm:text-4xl font-bold mb-6"
                >
                  What Our Users Are Saying
                </Heading>
                <Text className="text-lg text-muted-foreground">
                  Join thousands of marketers who have transformed their content
                  creation process
                </Text>
              </Box>

              <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Card className="p-6 md:p-8 border-border/60 h-full flex flex-col bg-background/80 backdrop-blur-sm">
                      <Box className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="inline-block w-5 h-5 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </Box>
                      <Text className="italic text-muted-foreground mb-6 flex-grow">
                        &ldquo;{testimonial.quote}&rdquo;
                      </Text>
                      <Box>
                        <Text className="font-semibold">
                          {testimonial.author}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {testimonial.position}, {testimonial.company}
                        </Text>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </main>
  );
}
