"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wand2,
  Copy,
  Download,
  Check,
  RefreshCw,
} from "lucide-react";
import {
  Box,
  Flex,
  Button,
  Heading,
  Text,
  Textarea,
} from "@sparrowengg/twigs-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const contentTypes = [
  { value: "social-post", label: "Social Media Post" },
  { value: "ad-copy", label: "Ad Copy" },
  { value: "email", label: "Marketing Email" },
  { value: "blog-intro", label: "Blog Introduction" },
  { value: "product-desc", label: "Product Description" },
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "conversational", label: "Conversational" },
  { value: "persuasive", label: "Persuasive" },
  { value: "enthusiastic", label: "Enthusiastic" },
];

const platforms = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
];

interface DemoResponses {
  "social-post": {
    [key: string]: string;
    linkedin: string;
    instagram: string;
    twitter: string;
    facebook: string;
    tiktok: string;
  };
  "ad-copy": {
    [key: string]: string;
    professional: string;
    friendly: string;
    conversational: string;
    persuasive: string;
    enthusiastic: string;
  };
  [key: string]: Record<string, string>;
}

export default function DemoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState("");
  const [contentType, setContentType] = useState("social-post");
  const [tone, setTone] = useState("professional");
  const [platform, setPlatform] = useState("linkedin");
  const [copied, setCopied] = useState(false);

  const placeholderText =
    "I'm creating a post about our new eco-friendly product line...";

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    // Simulate AI generation - in a real app, this would call an API
    setTimeout(() => {
      const demoResponses: DemoResponses = {
        "social-post": {
          linkedin:
            "🌿 Excited to announce our new eco-friendly product line! \n\nAt [Company], sustainability isn't just a buzzword—it's our commitment to the planet. Our latest collection is made from 100% recycled materials, reducing waste while delivering the quality you expect.\n\nWhy choose eco-friendly?\n• Reduces carbon footprint\n• Supports sustainable manufacturing\n• Same durability, lower environmental impact\n\nCheck out the full collection (link in comments). Together, we can make business better for our planet.\n\n#Sustainability #EcoFriendly #GreenBusiness",
          instagram:
            "🌱 NEW DROP: Our eco-friendly collection has arrived! 🌎\n\nMade with 100% recycled materials, these products look good AND do good. Swipe to see the full range →\n\nWe're committed to protecting our planet without compromising on quality. Each purchase plants a tree through our partnership with @EcoOrg.\n\nTag someone who loves sustainable products! 💚\n\n#EcoFriendly #SustainableLiving #GreenProducts #NewLaunch",
          twitter:
            "Thrilled to launch our eco-friendly product line today! Made from 100% recycled materials with zero compromise on quality. Because taking care of our planet shouldn't be optional. #Sustainability #GreenBusiness",
          facebook:
            "🌎 NEW: ECO-FRIENDLY COLLECTION 🌎\n\nWe're beyond excited to introduce our new sustainable product line! After months of development, we've created beautiful, functional items that don't cost the Earth.\n\n✅ 100% recycled materials\n✅ Plastic-free packaging\n✅ Carbon-neutral shipping\n\nEvery purchase supports our tree-planting initiative. Shop now through the link below and join us in making a difference!\n\n#SustainableLiving #EcoFriendly",
          tiktok:
            "Dropping our eco-friendly collection today! 🌱 #sustainability #ecofriendly #newdrop\n\nVoiceover: \"You asked for sustainable options, and we listened! Our new collection is made from recycled materials and comes in plastic-free packaging. Here's a quick look at what's new...\"",
        },
        "ad-copy": {
          professional:
            "Introducing Our Eco-Friendly Line\nSustainability meets quality. Explore our new collection made from 100% recycled materials. Same performance, better for the planet. Shop now and make a difference with every purchase.",
          friendly:
            "Hey there, Earth lover! 🌎\nOur new eco-friendly products have arrived, and they're as kind to the planet as they are to your wallet! Made from 100% recycled materials, they're the guilt-free purchase you've been waiting for. Come check them out!",
          conversational:
            "You know that feeling when you find something you love AND it's good for the planet? That's exactly what our new eco-friendly line delivers. Made from recycled materials, designed for real life, and priced for real budgets. Click to discover your new favorites.",
          persuasive:
            "Why compromise between quality and sustainability? Our new eco-friendly line delivers both. Made from premium recycled materials, these products reduce your carbon footprint without sacrificing performance. Limited quantities available. Order now before they're gone.",
          enthusiastic:
            "JUST LAUNCHED: OUR AMAZING ECO-FRIENDLY COLLECTION! 🌿\nWe're SO EXCITED to bring you these incredible products made from 100% recycled materials! They're gorgeous, they're practical, and they're saving the planet one purchase at a time! SHOP NOW and be part of the solution!",
        },
      };

      // Get response based on content type and tone/platform
      let response = "";
      if (contentType === "social-post") {
        response =
          demoResponses[contentType][platform] ||
          demoResponses[contentType]["linkedin"];
      } else {
        response =
          demoResponses[contentType]?.[tone] ||
          demoResponses["ad-copy"]["professional"];
      }

      setGenerated(response);
      setLoading(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box className="min-h-[calc(100vh-64px)] pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            className="mr-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Button>

          <Box className="ml-auto">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary/30 hover:bg-primary/5"
              >
                Login for Full Access
              </Button>
            </Link>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Box className="mb-4 w-fit mx-auto px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium">
            Demo Mode
          </Box>
          <Heading
            as="h1"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Try Sparrow Writer
          </Heading>
          <Text className="text-muted-foreground text-lg">
            Experience the power of AI-driven content creation without signing
            up. This is a limited demo with pre-set responses.
          </Text>
        </motion.div>

        <Box className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Box className="lg:col-span-2">
            <Card className="p-5 md:p-6 h-full border-border/70 shadow-md">
              <Box className="mb-6">
                <Heading as="h2" className="text-xl font-semibold mb-4">
                  Content Settings
                </Heading>

                <Box className="space-y-5">
                  <Box className="space-y-2">
                    <Text className="text-sm font-medium">Content Type</Text>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Box>

                  {contentType === "social-post" ? (
                    <Box className="space-y-2">
                      <Text className="text-sm font-medium">Platform</Text>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Box>
                  ) : (
                    <Box className="space-y-2">
                      <Text className="text-sm font-medium">Tone</Text>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box className="mb-4">
                <Text className="text-sm font-medium mb-2">
                  Tell us what you need
                </Text>
                <Textarea
                  className="min-h-[120px] resize-none border-border"
                  placeholder={placeholderText}
                  value={prompt}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setPrompt(e.target.value)
                  }
                />
              </Box>

              <Button
                className="w-full h-12 flex items-center justify-center"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} className="mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </Card>
          </Box>

          <Box className="lg:col-span-3">
            <Card className="p-5 md:p-6 h-full border-border/70 shadow-md flex flex-col">
              <Flex className="justify-between items-center mb-5">
                <Heading as="h2" className="text-xl font-semibold">
                  Generated Content
                </Heading>

                {generated && (
                  <Flex className="gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="text-sm flex items-center justify-center"
                      disabled={copied}
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm flex items-center justify-center"
                    >
                      <Download size={14} className="mr-1" />
                      Export
                    </Button>
                  </Flex>
                )}
              </Flex>

              <Box className="flex-grow border border-border/70 rounded-md p-4 bg-muted/20 overflow-auto">
                {loading ? (
                  <Flex className="items-center justify-center h-full">
                    <Box className="text-center">
                      <RefreshCw
                        size={24}
                        className="mx-auto mb-4 animate-spin text-primary"
                      />
                      <Text className="text-muted-foreground">
                        Generating your content...
                      </Text>
                    </Box>
                  </Flex>
                ) : generated ? (
                  <Box className="whitespace-pre-line">{generated}</Box>
                ) : (
                  <Flex className="items-center justify-center h-full">
                    <Box className="text-center max-w-sm">
                      <Wand2
                        size={24}
                        className="mx-auto mb-4 text-muted-foreground"
                      />
                      <Text className="text-muted-foreground mb-2">
                        Your generated content will appear here
                      </Text>
                      <Text className="text-sm text-muted-foreground/70">
                        Enter your content brief and click &quot;Generate
                        Content&quot; to get started
                      </Text>
                    </Box>
                  </Flex>
                )}
              </Box>

              {generated && (
                <Box className="mt-5 bg-primary/5 rounded-md p-4 border border-primary/20">
                  <Flex className="items-center justify-between">
                    <Text className="font-medium text-primary flex items-center">
                      <span className="mr-2">✨</span>
                      Want more options?
                    </Text>
                    <Link href="/login">
                      <Button size="sm">Login for Full Access</Button>
                    </Link>
                  </Flex>
                </Box>
              )}
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
