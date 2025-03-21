"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  FormInput,
  IconButton,
} from "@sparrowengg/twigs-react";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  Globe,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

// Define template type
interface Template {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  popular: boolean;
  image: string;
  content: string;
}

const SOCIAL_PLATFORMS = [
  {
    name: "All Platforms",
    icon: Grid3X3,
    color: "text-gray-500",
    selected: true,
  },
  { name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { name: "Twitter", icon: Twitter, color: "text-blue-400" },
  { name: "Facebook", icon: Facebook, color: "text-blue-600" },
  { name: "YouTube", icon: Youtube, color: "text-red-500" },
  { name: "Email", icon: Mail, color: "text-yellow-500" },
  { name: "Website", icon: Globe, color: "text-green-500" },
];

// Sample template data
const TEMPLATES: Template[] = [
  {
    id: "instagram-product-launch",
    title: "Product Launch Announcement",
    description: "Announce your new product with engaging caption and hashtags",
    platform: "Instagram",
    category: "Product",
    popular: true,
    image:
      "https://ui-avatars.com/api/?name=IG&background=ff5e82&color=fff&size=80",
    content: `✨ NEW LAUNCH ALERT ✨

Introducing our revolutionary [Product Name] that will transform your [benefit]!

🔥 Key Features:
• [Feature 1]
• [Feature 2] 
• [Feature 3]

Available now for just $[Price]! Early bird offer ends [Date].

Tag a friend who needs this in their life! 👇

#NewLaunch #[ProductCategory] #MustHave`,
  },
  {
    id: "twitter-industry-insight",
    title: "Industry Insight Thread",
    description: "Share valuable industry insights in a thread format",
    platform: "Twitter",
    category: "Educational",
    popular: false,
    image:
      "https://ui-avatars.com/api/?name=TW&background=1DA1F2&color=fff&size=80",
    content: `📊 THREAD: 5 Emerging Trends in [Industry] for 2023 that you need to know about 👇

1/5 [First Trend]: We're seeing [observation]. Companies like [example] are already [action] and seeing [result].

2/5 [Second Trend]: The rise of [trend] is reshaping how we think about [concept]. Data shows a [percentage]% increase in [metric].

3/5 [Third Trend]: [Trend description]. This represents a paradigm shift from [old way] to [new way].

4/5 [Fourth Trend]: Smart businesses are investing in [area]. Early adopters report [positive outcome].

5/5 [Fifth Trend]: Finally, [trend] will separate leaders from followers. Start planning your strategy now!

Like and retweet if this was helpful!`,
  },
  {
    id: "facebook-special-offer",
    title: "Limited Time Offer",
    description: "Promote a special discount or limited-time offer",
    platform: "Facebook",
    category: "Promotion",
    popular: true,
    image:
      "https://ui-avatars.com/api/?name=FB&background=1877F2&color=fff&size=80",
    content: `🚨 FLASH SALE ALERT! 🚨

For the next 48 HOURS ONLY, enjoy [discount]% OFF everything on our website!

Why we're doing this:
✅ Celebrating [milestone/occasion]
✅ Thanking our amazing community
✅ Making room for new inventory

Use code: [COUPONCODE] at checkout
Valid until: [Date and Time]

Don't miss out - these deals won't last! Tag friends who love a good bargain! 👇
Link in comments ⬇️`,
  },
  {
    id: "youtube-video-script",
    title: "Tutorial Video Script",
    description: "Script template for how-to and tutorial videos",
    platform: "YouTube",
    category: "Educational",
    popular: false,
    image:
      "https://ui-avatars.com/api/?name=YT&background=FF0000&color=fff&size=80",
    content: `# [TITLE: How to {Accomplish Task} in {Time Frame/Level of Difficulty}]

## INTRO [0:00-0:45]
Hey everyone, welcome back to [Channel Name]! I'm [Your Name].
Today I'm going to show you exactly how to [accomplish task] in just [time frame].
If you've ever struggled with [common problem], this video is going to be a game-changer.
Let's get started!

## HOOK [0:45-1:15]
Before we dive in, check out this [show example/result] - that's what you'll be able to do by the end of this video.
I'll break this down into [number] simple steps anyone can follow.

## STEP 1: [1:15-3:00]
First, you'll need to [first step].
The key here is to [important tip/technique].
Common mistake to avoid: [mistake]

## STEP 2: [3:00-5:30]
Next, [second step].
Pro tip: [insider advice]
This works because [brief explanation]

## STEP 3: [5:30-8:00]
Now for [third step].
Watch closely as I [demonstrate technique].
Notice how [point out detail].

## RESULTS & RECAP [8:00-9:30]
Let's review what we've covered:
• First, we [recap step 1]
• Then, we [recap step 2]
• Finally, we [recap step 3]
And now you can see the finished [result]!

## CALL-TO-ACTION [9:30-10:00]
If you found this helpful, please give this video a thumbs up and subscribe for more tutorials.
Have questions? Drop them in the comments below!
Next week I'll be covering [topic of next video], so hit the notification bell so you don't miss it.
Thanks for watching, and I'll see you in the next one!`,
  },
  {
    id: "email-newsletter",
    title: "Monthly Newsletter",
    description: "Structured template for regular email newsletters",
    platform: "Email",
    category: "Newsletter",
    popular: true,
    image:
      "https://ui-avatars.com/api/?name=EM&background=FFC82C&color=000&size=80",
    content: `Subject: [Month] Newsletter: [Key Highlight or Theme]

Hi [FIRSTNAME],

I hope this newsletter finds you well! Here's what we have for you this month:

🔥 FEATURED STORY
[Compelling headline about main story]
[2-3 sentences about the main feature, news, or update]
[Call to action button/link] → Read More

---

📰 WHAT'S NEW
• [News item 1]: [Brief description]
• [News item 2]: [Brief description]
• [News item 3]: [Brief description]

---

💡 TIPS & INSIGHTS
[Headline for tip/insight]
[Short paragraph with valuable information]
[Optional link to full article]

---

🗓️ UPCOMING EVENTS
[Event 1] - [Date] - [Brief description]
[Event 2] - [Date] - [Brief description]
[Calendar link] → View All Events

---

🎉 COMMUNITY SPOTLIGHT
This month we&apos;re celebrating [customer/community member] who [achievement].
[Brief story or quote]

---

We love hearing from you! Reply to this email with any feedback or questions.

Best regards,
[Your Name]
[Company Name]

[Unsubscribe link] | [Preference Center] | [Privacy Policy]`,
  },
  {
    id: "website-landing-page",
    title: "Product Landing Page",
    description: "Conversion-focused copy for a product landing page",
    platform: "Website",
    category: "Web Copy",
    popular: false,
    image:
      "https://ui-avatars.com/api/?name=WEB&background=3DDC84&color=fff&size=80",
    content: `# HERO SECTION
## Headline
[Compelling Value Proposition in 8-10 Words]

## Subheadline
[Expand on the value proposition, address pain points, 15-20 words]

## Primary CTA
[Action Word] [Benefit] [Timeframe/Condition]
Example: "Start Saving Time Today" or "Get Your Free Trial"

## Social Proof
Trusted by [number]+ companies including [Notable Company Names]

# FEATURES SECTION
## Main Heading
[How Product Delivers on Promise]

## Feature 1
### Title: [Feature Name]
### Description: [How it works and benefits, 1-2 sentences]

## Feature 2
### Title: [Feature Name]
### Description: [How it works and benefits, 1-2 sentences]

## Feature 3
### Title: [Feature Name]
### Description: [How it works and benefits, 1-2 sentences]

# TESTIMONIAL SECTION
## Heading
[What Others Are Saying/Results People Are Getting]

## Testimonial 1
"[Specific result or benefit the customer experienced]"
- [Name], [Position], [Company]

## Testimonial 2
"[Specific result or benefit the customer experienced]"
- [Name], [Position], [Company]

# PRICING SECTION
## Heading
[Simple, Transparent Pricing]

## Price Point
[Price] per [timeframe]

## What's Included
• [Key feature/benefit]
• [Key feature/benefit]
• [Key feature/benefit]
• [Key feature/benefit]

## CTA
[Get Started/Buy Now/Choose Plan]

# FAQ SECTION
## Question 1: [Common Question]
[Clear, concise answer]

## Question 2: [Common Question]
[Clear, concise answer]

## Question 3: [Common Question]
[Clear, concise answer]

# FINAL CTA SECTION
## Heading
[Urgency-Based Headline]

## Subheading
[Address final objection, emphasize key benefit]

## Final CTA
[Strong Action Verb] [Product/Service] [Timeframe]`,
  },
  {
    id: "instagram-carousel",
    title: "Educational Carousel",
    description: "Multi-slide carousel post template for educational content",
    platform: "Instagram",
    category: "Educational",
    popular: true,
    image:
      "https://ui-avatars.com/api/?name=IG&background=ff5e82&color=fff&size=80",
    content: `# INSTAGRAM CAROUSEL: [Topic] - [Number] Tips/Facts about [Subject]

## CAPTION
✨ SAVE THIS POST: [Number] [Tips/Facts/Strategies] for [Achieving Result] ✨

Swipe through to learn how to [benefit]! 👉

Which tip will you try first? Comment below!

Follow @[yourusername] for more [content type]!

#[hashtag1] #[hashtag2] #[hashtag3] #[hashtag4] #[hashtag5]

## SLIDE 1 (COVER)
### Title:
[Number] [TIPS/FACTS/STRATEGIES]
FOR [ACHIEVING RESULT]

### Subtitle:
Swipe to learn →

## SLIDE 2
### Title:
1. [First Point]

### Body:
[2-3 sentences explaining the first point, tip, or fact]

## SLIDE 3
### Title:
2. [Second Point]

### Body:
[2-3 sentences explaining the second point, tip, or fact]

## SLIDE 4
### Title:
3. [Third Point]

### Body:
[2-3 sentences explaining the third point, tip, or fact]

## SLIDE 5
### Title:
4. [Fourth Point]

### Body:
[2-3 sentences explaining the fourth point, tip, or fact]

## SLIDE 6
### Title:
5. [Fifth Point]

### Body:
[2-3 sentences explaining the fifth point, tip, or fact]

## SLIDE 7 (FINAL SLIDE)
### Title:
WHICH TIP WILL YOU
TRY FIRST?

### Body:
Follow @[yourusername] for more [content type]!
Save this post for later ⭐`,
  },
  {
    id: "twitter-poll",
    title: "Engagement Poll",
    description: "Create interactive polls to boost engagement",
    platform: "Twitter",
    category: "Engagement",
    popular: false,
    image:
      "https://ui-avatars.com/api/?name=TW&background=1DA1F2&color=fff&size=80",
    content: `📊 POLL: [Engaging question related to your industry/product]?

• [Option 1]
• [Option 2]
• [Option 3]
• [Option 4]

Vote now! Results in 24 hours.

Reply with your thoughts! 👇

#[Hashtag] #Poll`,
  },
];

// Define template categories with values and labels
const TEMPLATE_CATEGORIES = [
  { value: "all", label: "All Templates" },
  { value: "popular", label: "Popular" },
  { value: "Product", label: "Product" },
  { value: "Promotion", label: "Promotion" },
  { value: "Educational", label: "Educational" },
  { value: "Newsletter", label: "Newsletter" },
  { value: "Engagement", label: "Engagement" },
  { value: "Web Copy", label: "Web Copy" },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TEMPLATE_CATEGORIES[0].value);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePlatform, setActivePlatform] = useState("All Platforms");
  const [viewMode, setViewMode] = useState("grid");

  // Filter templates based on search query, active tab, and selected platform
  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "popular" && template.popular) ||
      template.category.toLowerCase() === activeTab.toLowerCase();

    const matchesPlatform =
      activePlatform === "All Platforms" ||
      template.platform === activePlatform;

    return matchesSearch && matchesTab && matchesPlatform;
  });

  const handleTemplateClick = (template: Template) => {
    // In a real app, you'd navigate to template details or open editor
    console.log("Selected template:", template);
    router.push(`/create?template=${template.id}`);
  };

  return (
    <Box className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <Heading as="h1" className="text-3xl font-bold mb-3">
        Templates
      </Heading>
      <Text className="text-muted-foreground mb-8">
        Choose from our pre-designed templates to quickly create effective
        marketing content
      </Text>

      {/* Search and filter */}
      <Flex className="flex-col md:flex-row gap-4 mb-8">
        <Box className="relative flex-grow">
          <FormInput
            leftIcon={<Search />}
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </Box>
        <Flex className="gap-3">
          <IconButton variant="outline" size="md" icon={<Filter size={16} />} />
          <IconButton
            variant={viewMode === "grid" ? "default" : "outline"}
            size="md"
            onClick={() => setViewMode("grid")}
            icon={<Grid3X3 size={18} />}
          />

          <IconButton
            variant={viewMode === "list" ? "default" : "outline"}
            size="md"
            onClick={() => setViewMode("list")}
            icon={<List size={18} />}
          />
        </Flex>
      </Flex>

      {/* Platform filter */}
      <Box className="mb-8  pb-2">
        <Flex css={{ gap: "15px" }}>
          {SOCIAL_PLATFORMS.map((platform) => (
            <motion.div
              key={platform.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                rightIcon={<platform.icon />}
                variant={
                  activePlatform === platform.name ? "default" : "outline"
                }
                size="sm"
                onClick={() => setActivePlatform(platform.name)}
              >
                {platform.name}
              </Button>
            </motion.div>
          ))}
        </Flex>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8 inline-block"
      >
        <TabsList className="bg-muted/30 p-1 rounded-md flex flex-wrap gap-1 md:flex-nowrap overflow-x-auto">
          {TEMPLATE_CATEGORIES.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Templates Grid */}
      {viewMode === "grid" ? (
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create new template card */}
          <Card className="border-dashed border-2 hover:border-primary/60 transition-all group hover:shadow-md duration-300 h-full flex flex-col">
            <CardContent className="p-8 flex-1 flex flex-col items-center justify-center text-center">
              <Box className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <Plus className="h-8 w-8 text-primary" />
              </Box>
              <Heading as="h3" className="text-xl font-semibold mb-3">
                Create Custom Template
              </Heading>
              <Text className="text-muted-foreground text-sm mb-6">
                Start from scratch or customize existing templates
              </Text>
              <Button
                variant="outline"
                className="mt-auto group-hover:bg-primary/10 transition-colors duration-300"
                onClick={() => router.push("/create")}
              >
                Create Template
              </Button>
            </CardContent>
          </Card>

          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border hover:border-primary/30 group h-full flex flex-col"
              onClick={() => handleTemplateClick(template)}
            >
              <CardContent className="p-0 flex flex-col h-full">
                <Box className="p-6 flex-1 flex flex-col">
                  <Flex className="mb-5 items-start justify-between">
                    <Box
                      className="w-12 h-12 rounded-lg overflow-hidden shadow-sm"
                      style={{ backgroundColor: "rgba(var(--muted))" }}
                    >
                      <Image
                        src={template.image}
                        alt={template.platform}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </Box>
                    {template.popular && (
                      <Box className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        Popular
                      </Box>
                    )}
                  </Flex>

                  <Heading as="h3" className="text-lg font-semibold mb-2">
                    {template.title}
                  </Heading>

                  <Text className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {template.description}
                  </Text>

                  <Flex className="items-center gap-2 flex-wrap mt-auto">
                    <Box className="px-3 py-1.5 bg-muted text-xs font-medium rounded-full">
                      {template.platform}
                    </Box>
                    <Box className="px-3 py-1.5 bg-muted text-xs font-medium rounded-full">
                      {template.category}
                    </Box>
                  </Flex>
                </Box>

                <Box className="border-t p-4 bg-muted/30 group-hover:bg-muted/50 transition-colors duration-300 mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Use this template
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box className="space-y-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border hover:border-primary/30 group"
              onClick={() => handleTemplateClick(template)}
            >
              <CardContent className="p-0">
                <Flex className="items-center p-5">
                  <Box
                    className="w-14 h-14 rounded-lg overflow-hidden mr-5 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: "rgba(var(--muted))" }}
                  >
                    <Image
                      src={template.image}
                      alt={template.platform}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </Box>

                  <Box className="flex-grow mr-4">
                    <Flex className="items-center gap-3 mb-2">
                      <Heading as="h3" className="text-lg font-semibold">
                        {template.title}
                      </Heading>
                      {template.popular && (
                        <Box className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          Popular
                        </Box>
                      )}
                    </Flex>

                    <Text className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {template.description}
                    </Text>

                    <Flex className="items-center gap-2 flex-wrap">
                      <Box className="px-3 py-1.5 bg-muted text-xs font-medium rounded-full">
                        {template.platform}
                      </Box>
                      <Box className="px-3 py-1.5 bg-muted text-xs font-medium rounded-full">
                        {template.category}
                      </Box>
                    </Flex>
                  </Box>

                  <Button rightIcon={<ArrowRight size={16} />} variant="ghost">
                    Use
                  </Button>
                </Flex>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {filteredTemplates.length === 0 && (
        <Box className="py-16 text-center bg-muted/10 rounded-lg">
          <Heading as="h3" className="text-xl font-semibold mb-3">
            No templates found
          </Heading>
          <Text className="text-muted-foreground mb-8 max-w-md mx-auto">
            Try adjusting your search or filters to find what you&apos;re
            looking for
          </Text>
          <Button
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
              setActivePlatform("All Platforms");
            }}
            className="px-6"
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Box>
  );
}
