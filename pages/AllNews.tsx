import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, ExternalLink, Filter } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NewsItem } from '../types';

// Fallback data similar to Home page to ensure the page isn't empty on fresh load
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

const AllNews: React.FC = () => {
  const { news: contextNews } = useNews();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Combine context news with defaults if context is empty
  const allNews = contextNews.length > 0 ? contextNews : DEFAULT_NEWS;

  // Filter based on search
  const filteredNews = allNews.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-dark-bg text-white overflow-hidden">
      
      {/* Header */}
      <header className="flex-none h-16 flex items-center justify-between px-6 border-b border-dark-border bg-dark-card/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">全部新闻资讯</h1>
        </div>
        
        <div className="text-sm text-gray-400">
          共 {filteredNews.length} 篇文章
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex-none px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full py-2.5 pl-10 pr-4 text-sm text-white bg-dark-card rounded-xl border border-dark-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder-gray-500 transition-all outline-none" 
              placeholder="搜索列表..." 
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
            <Filter size={16} />
            筛选
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNews.map((news) => (
            <a 
              key={news.id} 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-dark-card hover:bg-dark-surface border border-dark-border hover:border-white/10 p-4 rounded-2xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            >
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden relative shadow-md bg-gray-800 mb-4">
                <img 
                  src={news.imageUrl || `https://source.unsplash.com/800x600/?finance,news,${news.id}`} 
                  alt={news.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute right-3 top-3 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10">
                   {news.source}
                </div>
              </div>
              
              <div className="flex flex-col flex-1 gap-2">
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                <span>{news.time}</span>
                <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                  阅读全文 <ExternalLink size={12} />
                </span>
              </div>
            </a>
          ))}
        </div>
        
        {filteredNews.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <Search size={48} className="mb-4 opacity-20" />
            <p>未找到相关新闻</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNews;