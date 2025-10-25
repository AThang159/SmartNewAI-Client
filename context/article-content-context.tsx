"use client"

import { createContext, useContext, useState } from "react";

type ArticleContextType = {
  content: string[] | null;
  setContent: (c: string[] | null) => void;
};

const ArticleContext = createContext<ArticleContextType>({
  content: [],
  setContent: () => {},
});

export const useArticle = () => useContext(ArticleContext);

export const ArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<string[] | null>([]);

  return (
    <ArticleContext.Provider value={{ content, setContent }}>
      {children}
    </ArticleContext.Provider>
  );
};
