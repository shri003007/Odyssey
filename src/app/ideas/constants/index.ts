import { BlogPostContent } from '../types';

export const contentTypes = [
  {
    "id": 1,
    "type_name": "Blog Post",
    "description": "Use to create blog post",
    "icon": null,
    "value": "blog post",
    "is_default": true,
    "profile_id": null,
    "is_postable": false,
    "post_medium": null,
    "source": "default"
  },
  {
    "id": 2,
    "type_name": "Podcast Script",
    "description": null,
    "icon": null,
    "value": "podcast script",
    "is_default": true,
    "profile_id": null,
    "is_postable": false,
    "post_medium": null,
    "source": "default"
  },
  {
    "id": 3,
    "type_name": "Facebook Post",
    "description": null,
    "icon": null,
    "value": "facebook post",
    "is_default": true,
    "profile_id": null,
    "is_postable": false,
    "post_medium": null,
    "source": "default"
  },
  {
    "id": 4,
    "type_name": "LinkedIn Post",
    "description": null,
    "icon": null,
    "value": "linkedin post",
    "is_default": true,
    "profile_id": null,
    "is_postable": false,
    "post_medium": null,
    "source": "default"
  },
  {
    "id": 6,
    "type_name": "Carousel ",
    "description": "Gives the description for creating a Carousel ",
    "icon": null,
    "value": "carousel pdf",
    "is_default": true,
    "profile_id": null,
    "is_postable": false,
    "post_medium": null,
    "source": "default"
  },
  {
    "id": 5,
    "type_name": "Tweet",
    "description": null,
    "icon": null,
    "value": "tweet",
    "is_default": true,
    "profile_id": null,
    "is_postable": true,
    "post_medium": "x",
    "source": "default"
  },
  {
    "id": 7,
    "type_name": "Short Video Script",
    "description": null,
    "icon": null,
    "value": "short video script",
    "is_default": true,
    "profile_id": null,
    "is_postable": null,
    "post_medium": null,
    "source": "default"
  },
  {
    "id": 33,
    "type_name": "infographics",
    "description": "to create a linkedin infographics",
    "icon": null,
    "value": "infographics",
    "is_default": false,
    "profile_id": 8,
    "is_postable": false,
    "post_medium": null,
    "source": "custom"
  }
];

export const projects = [
  {
    name: 'Project 1',
    value: '1'
  },
  {
    name: 'Project 2',
    value: '2'
  },
  {
    name: 'Project 3',
    value: '3'
  }
];

export const contentProfiles = [
  {
    name: 'Professional',
    description: 'Use formal language and technical terms to convey a sense of authority and expertise.',
  },
  {
    name: 'Casual',
    description: 'Use casual language and everyday terms to convey a sense of friendliness and approachability.',
  },
  {
    name: 'Creative',
    description: 'Use creative language and terms to convey a sense of imagination and creativity.',
  },
  {
    name: 'Academic',
    description: 'Use academic language and terms to convey a sense of knowledge and expertise.',
  }
];

export const contentPieces: BlogPostContent[] = [
  {
    "content_id": "1",
    "content_type": "Blog Post",
    "title": "The AI Revolution in Software Engineering: Current Impacts and Future Horizons",
    "summary": "This comprehensive guide explores how AI is reshaping the software engineering landscape today. From automating routine tasks to creating new job roles, we delve into the immediate effects of AI on developers' daily work and career trajectories.",
    "keywords": {
      "primary": [
        "AI impact on software engineers",
        "Will AI replace software engineers"
      ],
      "secondary": [
        "AI in software development",
        "AI automation in coding",
        "Future of software engineering with AI"
      ]
    },
    "outline": [
      {
        "h1": "The AI Revolution in Software Engineering: Current Impacts and Future Horizons",
        "sections": [
          {
            "h2": "Introduction: The AI Paradigm Shift in Software Development",
            "h3": [
              "The rise of AI-assisted development",
              "Key concerns and opportunities for software engineers"
            ]
          },
          {
            "h2": "How AI is Transforming Software Engineering Today",
            "h3": [
              "AI-powered code generation and completion",
              "Automated testing and debugging: A new era of quality assurance",
              "DevOps automation: Streamlining infrastructure management"
            ]
          },
          {
            "h2": "The Human-AI Collaboration: A New Paradigm",
            "h3": [
              "AI as the ultimate pair programmer",
              "Enhancing creativity through AI suggestions",
              "Case study: Teams leveraging AI for innovative solutions"
            ]
          },
          {
            "h2": "Navigating the Risks and Challenges",
            "h3": [
              "Job displacement concerns: Myth vs. reality",
              "The evolving skill set: From coding to system design",
              "Ethical considerations in AI-assisted development"
            ]
          },
          {
            "h2": "Emerging Opportunities in the AI Era",
            "h3": [
              "New roles: AI/ML engineering and beyond",
              "Cross-industry applications: AI in healthcare and finance",
              "The rise of the AI-savvy software engineer"
            ]
          },
          {
            "h2": "Preparing for the Future: Key Takeaways for Software Engineers",
            "h3": [
              "Essential skills for thriving in an AI-driven industry",
              "Continuous learning: Staying ahead of the AI curve",
              "Embracing AI as a tool for career advancement"
            ]
          }
        ]
      }
    ]
  },
  {
    "content_id": "2",
    "content_type": "Blog Post",
    "title": "The Future of Software Engineering: Navigating the AI-Native Landscape",
    "summary": "This forward-looking piece examines the long-term trends shaping software engineering in the age of AI. We explore the transition from AI-assisted to AI-native development, and outline the skills and mindsets engineers need to thrive in this evolving landscape.",
    "keywords": {
      "primary": [
        "Future of software engineering with AI",
        "AI-native software engineering"
      ],
      "secondary": [
        "Upskilling for AI in tech",
        "AI engineering skills",
        "Generative AI in software development"
      ]
    },
    "outline": [
      {
        "h1": "The Future of Software Engineering: Navigating the AI-Native Landscape",
        "sections": [
          {
            "h2": "Introduction: The Dawn of AI-Native Software Engineering",
            "h3": [
              "Defining AI-native development",
              "The shift from traditional to AI-centric workflows"
            ]
          },
          {
            "h2": "The Evolution of Software Engineering: A Timeline",
            "h3": [
              "Short-term changes (2023-2025): AI as a productivity booster",
              "Mid-term shifts (2025-2027): The rise of AI-native practices",
              "Long-term future (Beyond 2027): AI engineers as the new norm"
            ]
          },
          {
            "h2": "AI-Native Development: Core Concepts and Practices",
            "h3": [
              "Retrieval-Augmented Generation (RAG) in software design",
              "Prompt engineering: The new programming paradigm",
              "AI-driven architecture and system design"
            ]
          },
          {
            "h2": "The Changing Role of Software Engineers",
            "h3": [
              "From code writers to AI orchestrators",
              "The importance of domain expertise in AI-native engineering",
              "Balancing technical skills with strategic thinking"
            ]
          },
          {
            "h2": "Industry-Specific AI Applications",
            "h3": [
              "Healthcare: AI-powered diagnostic tools and personalized medicine",
              "Finance: Algorithmic trading and fraud detection",
              "Manufacturing: AI in predictive maintenance and supply chain optimization"
            ]
          },
          {
            "h2": "Ethical Challenges in AI-Driven Development",
            "h3": [
              "Addressing bias in AI-generated code and systems",
              "Transparency and explainability in AI-native applications",
              "The role of software engineers in ethical AI governance"
            ]
          },
          {
            "h2": "Preparing for the AI-Native Future: A Roadmap for Engineers",
            "h3": [
              "Essential skills for the AI-native era",
              "Resources for continuous learning and adaptation",
              "Building a career in AI-native software engineering"
            ]
          }
        ]
      }
    ]
  },
  {
    "content_id": "3",
    "content_type": "Blog Post",
    "title": "Mastering AI in Software Engineering: A Practical Guide to Adaptation and Growth",
    "summary": "This actionable guide provides software engineers with concrete strategies for integrating AI into their workflows and careers. From foundational skills to advanced techniques, we offer a step-by-step approach to becoming an AI-savvy developer.",
    "keywords": {
      "primary": [
        "AI skills for software engineers",
        "Upskilling in AI for developers"
      ],
      "secondary": [
        "Learning AI for software engineering",
        "AI tools for developers",
        "How to work with AI in coding"
      ]
    },
    "outline": [
      {
        "h1": "Mastering AI in Software Engineering: A Practical Guide to Adaptation and Growth",
        "sections": [
          {
            "h2": "Introduction: Why Every Software Engineer Needs AI Skills",
            "h3": [
              "The AI imperative in modern software development",
              "Setting realistic expectations: What AI can and can't do"
            ]
          },
          {
            "h2": "Foundational Skills for AI Integration",
            "h3": [
              "Understanding AI and Machine Learning basics",
              "Key concepts: Neural networks, NLP, and computer vision",
              "Essential programming languages for AI (Python, R, Julia)"
            ]
          },
          {
            "h2": "Getting Started with AI Tools in Development",
            "h3": [
              "AI-powered code completion: Mastering GitHub Copilot",
              "Leveraging ChatGPT for problem-solving and ideation",
              "AI-assisted code review tools: Improving code quality"
            ]
          },
          {
            "h2": "Intermediate Strategies for AI Integration",
            "h3": [
              "Prompt engineering for effective code generation",
              "Implementing AI-driven testing and debugging workflows",
              "Integrating AI tools into Agile and DevOps practices"
            ]
          },
          {
            "h2": "Advanced AI Techniques for Software Engineers",
            "h3": [
              "Building and fine-tuning custom AI models for specific tasks",
              "Implementing AI in CI/CD pipelines for enhanced automation",
              "Developing AI-powered features in applications"
            ]
          },
          {
            "h2": "Real-World Case Studies: AI Success Stories in Development Teams",
            "h3": [
              "How Company X reduced development time by 40% with AI",
              "Startup Y's journey to building an AI-first product",
              "Lessons learned: Pitfalls to avoid when adopting AI"
            ]
          },
          {
            "h2": "Creating Your AI Upskilling Roadmap",
            "h3": [
              "Assessing your current skills and identifying gaps",
              "Recommended courses, certifications, and learning paths",
              "Building a portfolio of AI-enhanced projects"
            ]
          },
          {
            "h2": "The Future-Proof Software Engineer: Combining Human Expertise with AI",
            "h3": [
              "Developing a growth mindset for continuous AI learning",
              "Balancing technical skills with soft skills in the AI era",
              "Positioning yourself as an AI-savvy developer in the job market"
            ]
          }
        ]
      }
    ]
  }
]; 