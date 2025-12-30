import React, { useState } from 'react';
import { Cloud, Rocket, List, Calendar, Search, LogOut, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useNews } from '../context/NewsContext';
import { useNavigate } from 'react-router-dom';
import { NewsItem } from '../types';

const Settings: React.FC = () => {
  const { setNews, setIsLoading } = useNews();
  const navigate = useNavigate();
  
  const [count, setCount] = useState('10'); // Default to smaller batch for speed
  const [timeRange, setTimeRange] = useState('24h');
  const [keywords, setKeywords] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleCrawl = async () => {
    if (isCrawling) return;
    setIsCrawling(true);
    setIsLoading(true);
    setLogs([]);
    addLog("Initializing Gemini AI Agent...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const searchTerm = keywords ? keywords : "US Stock Market Funds, ETFs, and Major Tech Stocks";
      
      // Enhanced prompt to force JSON structure via text instructions instead of Schema
      const prompt = `You are a financial news crawler.
      Task: Find the latest news (last ${timeRange}) about: ${searchTerm}.
      Goal: Select ${count} distinct, high-impact news stories.
      
      Requirements:
      1. Use the googleSearch tool to find real articles.
      2. Return ONLY a valid JSON array. 
      3. Do NOT include any markdown formatting (like \`\`\`json), just the raw JSON string.
      4. CRITICAL: For the "url" field, strictly use the SOURCE URL found in the search grounding. If you cannot find a direct link to the article, leave the "url" field as an empty string "". DO NOT hallucinate or guess URLs.
      
      The JSON objects must follow this structure:
      [
        {
          "title": "string",
          "summary": "string (concise, max 2 sentences)",
          "source": "string (e.g., Bloomberg, CNBC)",
          "time": "string (e.g., '2 hours ago')",
          "tags": ["string", "string"],
          "isTopStory": boolean,
          "url": "string (The direct link, or empty string if unknown)"
        }
      ]
      
      Do not include imageUrl in the JSON unless you are 100% sure of a valid public URL found in the search results.`;

      addLog(`Searching web for: ${searchTerm}...`);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // Removing responseMimeType and responseSchema to prevent XHR/CORS errors with Search tool
        },
      });

      addLog("Parsing search results...");
      
      const rawText = response.text;
      if (!rawText) throw new Error("No data received from Gemini.");

      // Helper to clean markdown code blocks if the model adds them despite instructions
      const cleanJson = rawText.replace(/```json\n?|```/g, '').trim();

      let parsedItems: Omit<NewsItem, 'id' | 'imageUrl'>[] = [];
      try {
        parsedItems = JSON.parse(cleanJson);
      } catch (e) {
        console.error("JSON Parse Error:", e);
        throw new Error("Failed to parse news data from AI response.");
      }
      
      // Post-process to add IDs and placeholder images if missing
      const processedNews: NewsItem[] = parsedItems.map((item, index) => {
        // Safe URL generation: If AI returned empty or invalid URL, fallback to Google Search
        let finalUrl = item.url;
        if (!finalUrl || !finalUrl.startsWith('http') || finalUrl.length < 10) {
           finalUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title + " " + item.source)}`;
        }

        return {
          ...item,
          id: `gen-${Date.now()}-${index}`,
          imageUrl: `https://source.unsplash.com/800x600/?finance,stock,${index}`, // Fallback dynamic image
          url: finalUrl
        };
      });

      addLog(`Successfully retrieved ${processedNews.length} articles.`);
      setNews(processedNews);
      
      setTimeout(() => {
        setIsCrawling(false);
        setIsLoading(false);
        navigate('/'); // Redirect to home to see results
      }, 1500);

    } catch (error) {
      console.error(error);
      addLog(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      // If it's the specific XHR error, give a friendly hint
      if (JSON.stringify(error).includes("error code: 6") || JSON.stringify(error).includes("XHR")) {
         addLog("Network Hint: Please disable AdBlockers or try a different browser if connection fails.");
      }
      setIsCrawling(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-dark-bg">
       <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
       <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="md:hidden flex items-center justify-between p-4 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-white text-lg font-bold">美股基金助手</h1>
        <button className="text-white">☰</button>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col gap-2 mb-10">
          <h2 className="text-white text-4xl font-black tracking-tight">新闻爬取设置</h2>
          <p className="text-gray-400 text-lg font-normal max-w-2xl">
            配置自动抓取规则，定制您的美股基金新闻流，确保不错过任何关键信息。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Fetch Count Section */}
            <section className="bg-dark-card/50 border border-dark-border rounded-3xl p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <List size={24} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">单次抓取数量</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <label className="text-sm text-gray-400">选择预设数量</label>
                <div className="flex flex-wrap gap-3">
                  {['10', '20', '50'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setCount(val)}
                      className={`flex h-10 items-center justify-center px-6 rounded-full border transition-all ${
                        count === val 
                          ? 'bg-primary text-black font-bold border-transparent shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-105' 
                          : 'bg-dark-card border-white/10 text-gray-300 hover:border-primary/50 hover:text-white'
                      }`}
                    >
                      {val} 条
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Time Range Section */}
            <section className="bg-dark-card/50 border border-dark-border rounded-3xl p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">时间范围</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setTimeRange('24h')}
                  className={`cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all ${timeRange === '24h' ? 'bg-primary/5 border-primary' : 'bg-dark-card border-white/10 hover:bg-white/5'}`}
                >
                  <div className="flex flex-col">
                    <span className="text-white font-medium">过去 24 小时</span>
                    <span className="text-xs text-gray-500">适合每日早报</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${timeRange === '24h' ? 'border-primary' : 'border-gray-600'}`}>
                    {timeRange === '24h' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                </div>

                <div 
                  onClick={() => setTimeRange('week')}
                  className={`cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all ${timeRange === 'week' ? 'bg-primary/5 border-primary' : 'bg-dark-card border-white/10 hover:bg-white/5'}`}
                >
                  <div className="flex flex-col">
                    <span className="text-white font-medium">过去一周</span>
                    <span className="text-xs text-gray-500">周报数据分析</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${timeRange === 'week' ? 'border-primary' : 'border-gray-600'}`}>
                     {timeRange === 'week' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                </div>
              </div>
            </section>

             {/* Keywords Section */}
             <section className="bg-dark-card/50 border border-dark-border rounded-3xl p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">爬取关键词</h3>
              </div>
              <div className="flex flex-col gap-4">
                 <label className="text-sm text-gray-400">输入关键词以精准筛选内容</label>
                 <input 
                    type="text" 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="例如: 纳斯达克, 人工智能, 财报..." 
                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  />
                 <p className="text-xs text-gray-500">支持多个关键词，请使用逗号分隔。若留空则抓取全部。</p>
              </div>
            </section>

          </div>

          {/* Right Column: Status & Info */}
          <div className="flex flex-col gap-6">
            
            {/* Logs Window (Only visible when crawling or logs exist) */}
            {(isCrawling || logs.length > 0) && (
              <div className="bg-black/40 rounded-3xl p-6 border border-primary/20 backdrop-blur-md">
                <h4 className="text-primary font-bold mb-4 flex items-center gap-2">
                  <Loader2 size={16} className={isCrawling ? "animate-spin" : ""} /> 
                  运行日志
                </h4>
                <div className="font-mono text-xs space-y-2 h-40 overflow-y-auto text-gray-300">
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                  {isCrawling && <div className="animate-pulse">_</div>}
                </div>
              </div>
            )}

            {/* Data Sources */}
            <div className="bg-dark-card rounded-3xl p-6 border border-dark-border">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <List size={16} className="text-primary"/> 目标数据源
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-900/30 text-indigo-300 text-xs font-medium border border-indigo-500/30">Yahoo Finance</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-900/30 text-blue-300 text-xs font-medium border border-blue-500/30">Bloomberg</span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-900/30 text-red-300 text-xs font-medium border border-red-500/30">CNBC</span>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                Using Gemini Google Search Grounding to retrieve real-time market data.
              </p>
            </div>
            
            {/* System Status */}
             <div className="bg-gradient-to-b from-dark-card to-dark-bg rounded-3xl p-6 border border-dark-border relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <h4 className="text-white font-bold mb-2">System Status</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCrawling ? 'bg-yellow-500' : 'bg-primary'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isCrawling ? 'bg-yellow-500' : 'bg-primary'}`}></span>
                </span>
                <span className={`${isCrawling ? 'text-yellow-500' : 'text-primary'} text-sm font-medium`}>
                  {isCrawling ? 'Processing...' : 'Online'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-[#171026] border border-[#3b2d5e] relative z-10">
          <div className="flex flex-col">
            <p className="text-white font-bold text-lg">准备就绪？</p>
            <p className="text-purple-300 text-sm">将使用 Gemini API 搜索实时新闻。</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              disabled={isCrawling}
              className="flex-1 md:flex-none h-12 px-8 rounded-full border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              保存预设
            </button>
            <button 
              onClick={handleCrawl}
              disabled={isCrawling}
              className={`flex-1 md:flex-none h-12 px-8 rounded-full bg-primary text-black font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 ${isCrawling ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#9333ea]'}`}
            >
              {isCrawling ? <Loader2 className="animate-spin" size={20} /> : <Rocket size={20} />}
              {isCrawling ? '爬取中...' : '立即运行'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;