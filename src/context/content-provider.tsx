"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Content = {
  id: string;
  content_id: string;
  updated_at: Date;
  publish_at: Date;
  scheduler_id: number;
  content: {
    id: string;
    name: string;
    content: string;
    created_at: Date;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
    content_types: ContentType;
  };
  profiles: {
    user_id: string;
    profile_id: string;
    profile_name: string;
    
  };
};

type ContentType = {
  value: string;
  type_name: string;
  profile_id: number;
  is_postable: boolean;
};

type ContentContextType = {
  contents: Content[];
  addContent: (content: Omit<Content, "id">) => void;
  updateContent: (content: Content) => void;
  deleteContent: (contentId: string) => void;
  toggleContentCompletion: (contentId: string) => void;
  setContents: React.Dispatch<React.SetStateAction<Content[]>>;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContentContext = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return context;
};

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Content[]>([]);

  const addContent = (content: Omit<Content, "id">) => {
    const newContent: Content = {
      ...content,
      id: String(Date.now()), // Generate a unique ID
    };
    setContents((prevContents) => [...prevContents, newContent]);
  };

  const updateContent = (updatedContent: Content) => {
    setContents((prevContents) =>
      prevContents.map((content) =>
        content.id === updatedContent.id ? updatedContent : content
      )
    );
  };

  const deleteContent = (contentId: string) => {
    setContents((prevContents) =>
      prevContents.filter((content) => content.id !== contentId)
    );
  };

  const toggleContentCompletion = (contentId: string) => {
    setContents((prevContents) =>
      prevContents.map((content) =>
        content.id === contentId
          ? {
              ...content,
              content: {
                ...content.content,
                completed: !content.content.completed
              }
            }
          : content
      )
    );
  };

  return (
    <ContentContext.Provider
      value={{
        contents,
        addContent,
        updateContent,
        deleteContent,
        toggleContentCompletion,
        setContents,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}
