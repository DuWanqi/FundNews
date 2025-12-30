import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, TrendingUp, TrendingDown, Calendar, Layers, Heart, Globe } from 'lucide-react';
import { NewsItem, MarketIndex } from '../types';
import { useNews } from '../context/NewsContext';

const INDICES: MarketIndex[] = [
  { name: 'S&P 500', value: '4,783.45', change: '+1.20%', isPositive: true, color: 'bg-blue-500' },
  { name: 'NASDAQ', value: '15,310.97', change: '+0.85%', isPositive: true, color: 'bg-purple-500' },
  { name: 'VIX Index', value: '12.45', change: '-2.1%', isPositive: false, color: 'bg-red-500' },
];

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'default-1',
    title: '美联储暗示降息周期即将开启，科技股应声大涨',
    summary: '随着通胀数据持续降温，美联储主席鲍威尔在最新的新闻发布会上表示，政策转向可能比预期更早到来...',
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=800',
    source: 'Top Story',
    time: '2小时前',
    tags: ['Policy'],
    isTopStory: true,
    url: 'https://www.google.com/search?q=Fed+rate+cuts+tech+stocks'
  },
  {
    id: 'default-2',
    title: '贝莱德推出新的比特币现货ETF，首日交易量惊人',
    summary: '新的IBIT ETF在上市首日吸引了超过10亿美元的资金流入，显示出机构投资者对加密资产的浓厚兴趣...',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a42099463f9?auto=format&fit=crop&q=80&w=800',
    source: 'ETF',
    time: '4小时前',
    tags: ['Crypto'],
    url: 'https://www.google.com/search?q=Blackrock+Bitcoin+ETF'
  },
  {
    id: 'default-3',
    title: '英伟达 Q4 财报前瞻：AI 芯片需求依然强劲',
    summary: '分析师普遍预计，数据中心业务的收入将同比增长200%以上，继续推动股价创下历史新高。',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    source: 'Earnings',
    time: '5小时前',
    tags: ['Tech'],
    url: 'https://www.google.com/search?q=Nvidia+Q4+earnings+preview'
  },
  {
    id: 'default-4',
    title: '小盘股 ETF (IWM) 可能成为2024年的最大赢家？',
    summary: '随着利率压力的缓解，被低估的小盘股显示出巨大的反弹潜力，多位策略师建议增持相关资产。',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800',
    source: 'Analysis',
    time: '6小时前',
    tags: ['Strategy'],
    url: 'https://www.google.com/search?q=Small+cap+ETF+IWM+outlook'
  }
];

const STATIC_UPDATES = [
  { id: 'static-1', title: '方舟投资 (ARK Invest) 昨日大举加仓 Tesla', source: 'ARK Daily', time: '8小时前', iconUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100', url: 'https://www.google.com/search?q=ARK+Invest+Tesla+buy' },
  { id: 'static-2', title: '高盛：2024年美股展望报告发布', source: 'Goldman Sachs', time: '12小时前', icon: <Calendar size={20} />, url: 'https://www.google.com/search?q=Goldman+Sachs+2024+outlook' },
  { id: 'static-3', title: '摩根大通 CEO 戴蒙警告通胀风险', source: 'JP Morgan', time: '1天前', icon: <Layers size={20} />, url: 'https://www.google.com/search?q=Jamie+Dimon+inflation+warning' },
];

const Home: React.FC = () => {
  const { news: contextNews, lastUpdated, toggleFavorite, isFavorite } = useNews();
  
  // Use context news if available, otherwise default
  const displayNews = contextNews.length > 0 ? contextNews : DEFAULT_NEWS;

  // Use the top 3 crawled items for Recent Updates, or fall back to static data if no crawl yet
  const recentUpdates = contextNews.length > 0 
    ? contextNews.slice(0, 3).map((item, index) => ({
        ...item,
        // Ensure unique ID for list key if somehow duplicate
        id: item.id || `recent-${index}`
      }))
    : STATIC_UPDATES;

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-dark-bg">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-dark-bg to-dark-bg pointer-events-none z-0"></div>

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 py-4 shrink-0 sticky top-0 z-30 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="flex items-center gap-4 flex-1">
           {/* Mobile Menu Button Placeholder */}
           <div className="md:hidden text-white mr-2">☰</div>
           <div className="relative w-full max-w-md hidden sm:block group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              className="block w-full py-2 pl-10 pr-4 text-sm text-white bg-dark-card rounded-full border border-dark-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder-gray-500 transition-all outline-none" 
              placeholder="搜索新闻、代码或基金..." 
            />
          </div>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <button className="hidden md:block bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full hover:scale-105 transition-transform">
            查看高级版
          </button>
          <div className="relative">
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-primary to-purple-400 cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all">
               <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-dark-bg" />
            </div>
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-bg"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 relative z-10">
        <div className="pt-6 pb-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">下午好</h2>
              <p className="text-gray-400 text-sm">
                {lastUpdated 
                  ? `内容更新于 ${lastUpdated.toLocaleTimeString()}`
                  : '市场波动加剧，关注科技板块动向'}
              </p>
            </div>
          </div>

          {/* Indices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {INDICES.map((idx) => (
              <div key={idx.name} className="bg-dark-card border border-dark-border hover:border-white/10 hover:bg-dark-surface transition-all rounded-xl flex items-center h-[88px] cursor-pointer group overflow-hidden relative shadow-lg">
                <div className={`w-1 h-full ${idx.color} absolute left-0 top-0`}></div>
                <div className="flex-1 py-3 px-5 flex flex-col justify-center">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Index</span>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-white text-lg">{idx.name}</span>
                    <span className={`font-bold text-sm ${idx.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>{idx.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-full ${idx.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} flex items-center justify-center mr-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0`}>
                  {idx.isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white cursor-pointer flex items-center gap-2 group">
              为你推荐
              <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={24} />
            </h2>
            <Link to="/all-news" className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider transition-colors">显示全部</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {displayNews.map((news) => {
              const favorited = isFavorite(news.id);
              return (
                <a 
                  key={news.id} 
                  href={news.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-dark-card hover:bg-dark-surface border border-dark-border hover:border-white/10 p-4 rounded-2xl transition-all duration-300 group flex flex-col gap-4 h-full hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 cursor-pointer block relative"
                >
                  <div className="w-full aspect-video rounded-xl overflow-hidden relative shadow-md bg-gray-800">
                    <img 
                      src={news.imageUrl || `https://source.unsplash.com/800x600/?stock,finance,${news.id}`} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    
                    {/* Favorite Button (Replaces ExternalLink) */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); // Stop navigation to article
                        toggleFavorite(news);
                      }}
                      className={`absolute right-3 bottom-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-20 ${
                        favorited 
                          ? 'bg-red-500 text-white opacity-100 translate-y-0' 
                          : 'bg-white/20 text-white backdrop-blur-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-red-500'
                      }`}
                    >
                      <Heart size={14} fill={favorited ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 min-h-0 flex-1">
                    <h3 className="font-bold text-white text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors">{news.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{news.summary}</p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                    <span className={`px-2 py-0.5 rounded border ${news.isTopStory ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-gray-300 border-white/10'}`}>{news.source}</span>
                    <span>• {news.time}</span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Recent Updates Table */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">最近更新</h2>
            </div>
            <div className="flex flex-col bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
              <div className="grid grid-cols-[40px_1fr_100px] gap-4 px-6 py-3 border-b border-dark-border text-xs text-gray-500 font-bold uppercase tracking-wider bg-dark-surface/30">
                <span>#</span>
                <span>标题</span>
                <span className="text-right">时间</span>
              </div>
              {recentUpdates.map((item, idx) => (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[40px_1fr_100px] gap-4 items-center px-6 py-4 hover:bg-dark-surface transition-colors border-b border-dark-border last:border-0"
                >
                  <span className="text-gray-500 text-sm group-hover:text-primary font-medium">{idx + 1}</span>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-dark-surface flex items-center justify-center shrink-0 ring-1 ring-white/10 overflow-hidden">
                      {/* Check for iconUrl property from static data, or fall back to imageUrl/icon from crawled data */}
                      {(item as any).iconUrl ? (
                         <img src={(item as any).iconUrl} className="w-full h-full object-cover" />
                      ) : (item as any).icon ? (
                         <span className="text-gray-400">{(item as any).icon}</span>
                      ) : (
                         <img src={item.imageUrl} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=100'} />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium truncate group-hover:text-primary transition-colors">{item.title}</span>
                      <span className="text-xs text-gray-500 truncate">{item.source}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 text-right font-medium">{item.time}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;