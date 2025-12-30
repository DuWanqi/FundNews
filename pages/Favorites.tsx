import React from 'react';
import { Search, Share, Trash2, ChevronDown, ChevronLeft, ChevronRight, Image as ImageIcon, ArrowRight, Copy, BookmarkMinus, Bookmark, Heart } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const Favorites: React.FC = () => {
  const { favorites, toggleFavorite } = useNews();

  return (
    <div className="h-full flex flex-col bg-dark-bg text-white overflow-hidden">
      
      {/* Mobile Header */}
      <header className="flex h-16 items-center justify-between border-b border-dark-border px-4 lg:hidden bg-dark-card">
        <div className="flex items-center gap-2">
          <Bookmark className="text-primary" size={24} />
          <span className="font-bold">Fund News</span>
        </div>
        <button className="p-2 text-white">☰</button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black leading-tight tracking-tight">我的收藏</h1>
              <p className="text-base font-normal text-gray-400">
                已收藏 {favorites.length} 篇新闻 (3天后自动清理)
              </p>
            </div>
            {/* 
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <Share size={18} />
                导出列表
              </button>
              <button className="flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                <Trash2 size={18} />
                清空
              </button>
            </div>
            */}
          </div>

          {/* Filter Bar */}
          <div className="sticky top-0 z-20 -mx-4 bg-dark-bg/95 px-4 py-4 backdrop-blur md:mx-0 md:px-0 md:py-0 md:relative md:bg-transparent md:backdrop-blur-none">
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <Search size={20} />
                </div>
                <input 
                  type="text" 
                  className="block w-full rounded-full border-none bg-dark-card py-3.5 pl-12 pr-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-600 focus:bg-dark-surface focus:ring-2 focus:ring-primary transition-all sm:text-sm"
                  placeholder="搜索收藏..." 
                />
              </div>
            </div>
          </div>

          {/* List Items */}
          <div className="flex flex-col gap-4 pb-12">
            {favorites.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 opacity-50">
                 <Heart size={64} className="mb-4 text-gray-600" />
                 <p className="text-xl">暂无收藏</p>
                 <p className="text-sm">点击新闻卡片上的爱心图标进行收藏</p>
               </div>
            ) : (
              favorites.map((item) => (
                <article key={item.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-dark-card shadow-sm transition-all hover:border-primary/50 hover:shadow-lg md:flex-row">
                  {item.imageUrl ? (
                    <div className="h-48 w-full md:h-auto md:w-64 md:shrink-0 overflow-hidden relative">
                       <img 
                          src={item.imageUrl} 
                          alt="" 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                    </div>
                  ) : null}
                  
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <span className={`rounded-full px-2 py-0.5 border border-white/5 bg-white/5 text-gray-300`}>{item.source}</span>
                        <span className="text-gray-500">• {item.time}</span>
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors hover:underline">
                        {item.title}
                      </a>
                      <p className="line-clamp-2 text-sm text-gray-400">
                        {item.summary}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                        Read Article <ArrowRight size={16} />
                      </a>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleFavorite(item)}
                          className="rounded-full p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors" 
                          title="Remove from favorites"
                        >
                          <BookmarkMinus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Favorites;