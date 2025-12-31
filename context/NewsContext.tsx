import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { NewsItem } from '../types';

interface NewsContextType {
  news: NewsItem[];
  setNews: (news: NewsItem[]) => void;
  addNews: (news: NewsItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  lastUpdated: Date | null;
  favorites: NewsItem[];
  toggleFavorite: (item: NewsItem) => void;
  isFavorite: (id: string) => boolean;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fix: Use lazy initialization to read from LocalStorage BEFORE the first render.
  // This prevents the 'save' effect from overwriting existing data with an empty array on mount.
  const [favorites, setFavorites] = useState<NewsItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storedFavs = localStorage.getItem('fundnews_favorites');
      if (storedFavs) {
        const parsedFavs: NewsItem[] = JSON.parse(storedFavs);
        
        // Run cleanup logic immediately during initialization
        const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        const validFavs = parsedFavs.filter(item => {
          if (!item.savedAt) return true; // Keep legacy items
          const savedTime = new Date(item.savedAt).getTime();
          return (now - savedTime) < threeDaysInMillis;
        });

        return validFavs;
      }
    } catch (e) {
      console.error("Failed to parse favorites from local storage", e);
    }
    return [];
  });

  // Use a ref to track if it's the first render to avoid double-saving in Strict Mode if needed,
  // though lazy init largely solves the main issue.
  const isFirstRender = useRef(true);

  // Sync favorites to LocalStorage whenever they change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('fundnews_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addNews = (newItems: NewsItem[]) => {
    setNews(prev => [...newItems, ...prev]);
    setLastUpdated(new Date());
  };

  const handleSetNews = (newItems: NewsItem[]) => {
    setNews(newItems);
    setLastUpdated(new Date());
  };

  const toggleFavorite = (item: NewsItem) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === item.id);
      if (exists) {
        return prev.filter(fav => fav.id !== item.id);
      } else {
        // Add timestamp when saving
        return [...prev, { ...item, savedAt: new Date().toISOString() }];
      }
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  return (
    <NewsContext.Provider value={{ 
      news, 
      setNews: handleSetNews, 
      addNews, 
      isLoading, 
      setIsLoading,
      lastUpdated,
      favorites,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}