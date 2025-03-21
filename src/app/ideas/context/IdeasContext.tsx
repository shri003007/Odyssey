import { createContext, useContext, useState, ReactNode } from 'react';
import { BlogPostContent, ContentIdeaConfig, ContentPiecesMap, Results } from '../types';
import { toast, Toastr } from '@sparrowengg/twigs-react';
import { parseDate, CalendarDate   } from "@internationalized/date";
import { useAuth } from '@/context/auth-provider';

interface ProfileType {
  name: string;
  value: string;
  description: string;
}

interface ProjectType {
  label: string;
  value: string;
  __isNew__?: boolean;
}

export interface DateRange {
  start: CalendarDate;
  end: CalendarDate;
}

interface IdeasContextType {
  contentIdeaConfig: ContentIdeaConfig;
  setContentIdeaConfig: (value: ContentIdeaConfig) => void;
  activeStep: number;
  generateContentIdeas: () => void;
  prevStep: () => void;
  generating: boolean;
  setActiveStep: (value: number) => void;
  nextStep: () => void;
  selectedProfile: ProfileType | null;
  selectedProject: ProjectType | null;
  setSelectedProfile: (profile: ProfileType) => void;
  setSelectedProject: (project: ProjectType) => void;
  updatedContentPieces: BlogPostContent[];
  handleContentUpdate: (updatedContent: BlogPostContent) => void;
  contentPiecesObj: ContentPiecesMap;
  setGenerating: (value: boolean) => void;
  error: boolean;
  setError: (value: boolean) => void;
  setFinalContents: (value: Results[]) => void;
  finalContents: Results[];
  publishDate: DateRange | null;
  setPublishDate: (value: DateRange | null) => void;
}

const initialContentIdeaConfig: ContentIdeaConfig = {
  contentIdea: '',
  contentTypes: [],
  targetAudience: '',
  numOfContentPieces: 1
};

export const IdeasContext = createContext<IdeasContextType>({
  contentIdeaConfig: initialContentIdeaConfig,
  setContentIdeaConfig: () => {},
  activeStep: 0,
  generateContentIdeas: () => {},
  prevStep: () => {},
  generating: false,
  setActiveStep: () => {},
  nextStep: () => {},
  selectedProfile: null,
  selectedProject: null,
  setSelectedProfile: () => {},
  setSelectedProject: () => {},
  updatedContentPieces: [],
  handleContentUpdate: () => {},
  contentPiecesObj: {},
  setGenerating: () => {},
  error: false, 
  setError: () => {},
  setFinalContents: () => {},
  finalContents: [],
  publishDate: null,
  setPublishDate: () => {}
});

export const useIdeasContext = () => useContext(IdeasContext);

interface IdeasProviderProps {
  children: ReactNode;
}

export const IdeasProvider = ({ children }: IdeasProviderProps) => {
  const [contentIdeaConfig, setContentIdeaConfig] = useState<ContentIdeaConfig>(initialContentIdeaConfig);
  const [generating, setGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [finalContents, setFinalContents] = useState<Results[]>([]);

  const { userId } = useAuth();

  const nextStep = () => setActiveStep(prev => prev + 1);
  const prevStep = () => setActiveStep(prev => Math.max(0, prev - 1));

  const [publishDate, setPublishDate] = useState<DateRange | null>({
    start: parseDate(new Date().toISOString().split('T')[0]),
    end: parseDate(new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0]),
  });

  // State to track all content pieces
  const [updatedContentPieces, setUpdatedContentPieces] = useState<BlogPostContent[]>([]);

  const contentPiecesObj = updatedContentPieces.reduce((acc: ContentPiecesMap, item) => {
    acc[item.content_id] = item;
    return acc;
  }, {} as ContentPiecesMap);

  // Handle content updates from the BlogPostEditor
  const handleContentUpdate = (updatedContent: BlogPostContent) => {
    setUpdatedContentPieces(prev => 
      prev.map(item => 
        item.content_id === updatedContent.content_id ? updatedContent : item
      )
    );
  };

  const generateContentIdeas = async () => {
    await generateContentIdea();
  }

  const generateContentIdea = async () => {
    setGenerating(true);
    const { contentIdea, contentTypes, targetAudience, numOfContentPieces } = contentIdeaConfig;

    if (contentTypes.length === 0 || contentIdea.trim().length === 0) {
      toast({
        title: 'Please select content types and provide a content idea',
        variant: 'error'
      })
      setError(true);
      setGenerating(false);
      return;
    }

    if (error) {
      setError(false);
    }

    const payload = {
      idea: contentIdea,
      content_types: contentTypes.join(','),
      user_id: userId,
      ...(targetAudience.trim().length > 0 && { target_audience: targetAudience }),
      num_content_types: numOfContentPieces,
      from_date: publishDate?.start ? new Date(publishDate.start.toString()).toISOString() : undefined,
      to_date: publishDate?.end ? new Date(publishDate.end.toString()).toISOString() : undefined
    };

    console.log(payload, 'payload');

    try {
      const response = await fetch('https://mk3sf3dexja3kvw2gdwx6ihama0tdbrx.lambda-url.us-west-2.on.aws/content-strategy', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUpdatedContentPieces(data.content.content_strategy.content_pieces);
        setGenerating(false);
        nextStep();
        return;
      }
    } catch (err) {
      console.log(err, 'err');
      toast({
        title: 'Error generating content ideas',
        variant: 'error'
      })
    } finally {
      setGenerating(false);
    }
  };

  return (
    <IdeasContext.Provider 
      value={{ 
        contentIdeaConfig, 
        setContentIdeaConfig, 
        activeStep, 
        generateContentIdeas,
        generating,
        setGenerating,
        prevStep,
        setActiveStep,
        // step,
        nextStep,
        selectedProfile,
        selectedProject,
        setSelectedProfile,
        setSelectedProject,
        updatedContentPieces,
        handleContentUpdate,
        contentPiecesObj,
        error,
        setError,
        setFinalContents,
        finalContents,
        publishDate,
        setPublishDate
      }}
    >
      <Toastr duration={1000} />
      {children}
    </IdeasContext.Provider>
  );
};