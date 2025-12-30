import React from 'react';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  time: string;
  tags: string[];
  isTopStory?: boolean;
  url?: string;
  savedAt?: string; // ISO Date string for auto-cleanup
}

export interface MarketIndex {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  color: string;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}