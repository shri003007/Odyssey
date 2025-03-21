export interface BlogPostContent {
  content_id: string;
  content_type: string;
  title: string;
  summary: string;
  outline: Array<{
    h1: string;
    sections: Array<{
      h2: string;
      h3: string[];
    }>;
  }>;
  publish_at: string;
  keywords?: {
    primary: string[];
    secondary: string[];
  };
}
export interface Results {
  id: string;
  topic: string;
  medium: string;
  content: string;
  error: string;
  status: string;
  scheduled: boolean;
  content_id: number;
  project_id: string;
}

export interface ContentPiecesMap {
  [key: string]: BlogPostContent;
}

export interface ContentIdeaConfig {
  contentIdea: string;
  contentTypes: string[];
  targetAudience: string;
  numOfContentPieces: number;
} 