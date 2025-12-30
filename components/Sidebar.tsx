import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Heart, TrendingUp, Activity, Plus, Library, Wallet, Briefcase, Zap } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive(to)
          ? 'bg-[#1c1a26] text-white border-l-4 border-primary shadow-lg shadow-primary/10'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={isActive(to) ? 'text-primary' : 'text-gray-400 group-hover:text-white'}>
        {icon}
      </span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );

  return (
    <aside className="hidden md:flex w-[280px] flex-col bg-dark-card border-r border-dark-border h-full p-4 gap-6 shrink-0 z-20">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mt-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-900 flex items-center justify-center shadow-lg shadow-primary/20">
          <Wallet className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white text-lg font-bold tracking-tight leading-none">FundNews</h1>
          <span className="text-xs text-primary/80 font-medium">PRO Dashboard</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1">
        <NavLink to="/" icon={<Home size={20} />} label="首页" />
        <NavLink to="/settings" icon={<Settings size={20} />} label="爬取设置" />
        <NavLink to="/favorites" icon={<Heart size={20} />} label="我的收藏" />
      </nav>

      {/* Watchlist Section */}
      <div className="flex-1 flex flex-col pt-4 border-t border-dark-border mt-2">
        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Library size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">你的关注</span>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex gap-2 px-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-dark-surface border border-dark-border text-[10px] font-medium text-gray-300 hover:border-primary/50 cursor-pointer transition-colors">ETF</span>
          <span className="px-3 py-1 rounded-full bg-dark-surface border border-dark-border text-[10px] font-medium text-gray-300 hover:border-primary/50 cursor-pointer transition-colors">Macro</span>
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-1 overflow-y-auto">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-surface cursor-pointer group transition-colors">
            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Zap size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm font-medium truncate">科技龙头 (Tech)</p>
              <p className="text-[10px] text-gray-500 truncate">基金 • 23 篇新闻</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-surface cursor-pointer group transition-colors">
            <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Activity size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm font-medium truncate">医疗健康 (Health)</p>
              <p className="text-[10px] text-gray-500 truncate">板块 • 12 篇新闻</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-surface cursor-pointer group transition-colors">
            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <Briefcase size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm font-medium truncate">ARK Innovation</p>
              <p className="text-[10px] text-gray-500 truncate">凯瑟琳·伍德</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;