import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [favorites, setFavorites] = useState<NewsItem[]>([]);

  // Initialize favorites from LocalStorage and run cleanup logic
  useEffect(() => {
    const storedFavs = localStorage.getItem('fundnews_favorites');
    if (storedFavs) {
      try {
        const parsedFavs: NewsItem[] = JSON.parse(storedFavs);
        
        // Auto-cleanup: Filter out items older than 3 days
        const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        const validFavs = parsedFavs.filter(item => {
          if (!item.savedAt) return true; // Keep legacy items without date
          const savedTime = new Date(item.savedAt).getTime();
          return (now - savedTime) < threeDaysInMillis;
        });

        if (validFavs.length !== parsedFavs.length) {
          console.log(`Auto-cleaned ${parsedFavs.length - validFavs.length} expired favorites.`);
        }

        setFavorites(validFavs);
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Sync favorites to LocalStorage whenever they change
  useEffect(() => {
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
};