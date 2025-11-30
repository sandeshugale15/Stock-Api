import React, { useState, useEffect, useCallback } from 'react';
import MarketChart from './components/MarketChart';
import AnalysisPanel from './components/AnalysisPanel';
import StockList from './components/StockList';
import { getMarketAnalysis } from './services/gemini';
import { StockSymbol, AnalysisResult } from './types';

// Mock initial data
const INITIAL_STOCKS: StockSymbol[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 890.50, change: 12.40, changePercent: 1.41 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 172.75, change: -0.85, changePercent: -0.49 },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 420.10, change: 2.15, changePercent: 0.51 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 173.90, change: 1.20, changePercent: 0.69 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.30, change: -3.20, changePercent: -1.79 },
  { symbol: 'AMZN', name: 'Amazon.com', price: 180.20, change: 0.90, changePercent: 0.50 },
  { symbol: 'META', name: 'Meta Platforms', price: 495.60, change: 5.60, changePercent: 1.14 },
  { symbol: 'AMD', name: 'Advanced Micro', price: 180.10, change: -1.50, changePercent: -0.83 },
];

const App: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [stocks, setStocks] = useState<StockSymbol[]>(INITIAL_STOCKS);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Find the currently selected stock object
  const currentStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];

  // Function to fetch AI analysis
  const fetchAnalysis = useCallback(async (symbol: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await getMarketAnalysis(symbol);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Effect to fetch analysis when selection changes
  useEffect(() => {
    fetchAnalysis(selectedSymbol);
  }, [selectedSymbol, fetchAnalysis]);

  // Effect to simulate live price ticking in the sidebar list
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => prevStocks.map(stock => {
        // Randomly update some stocks to simulate market activity
        if (Math.random() > 0.6) {
          const volatility = stock.price * 0.0003;
          const change = (Math.random() - 0.5) * volatility;
          const newPrice = stock.price + change;
          const newChange = stock.change + change;
          const newPercent = (newChange / (stock.price - stock.change)) * 100;
          
          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newPercent
          };
        }
        return stock;
      }));
    }, 1500); // 1.5s interval for sidebar updates

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const queryUpper = searchQuery.toUpperCase();
    const existing = stocks.find(s => s.symbol === queryUpper);
    
    if (existing) {
      setSelectedSymbol(existing.symbol);
    } else {
      // Create a mock entry for the new search
      const newStock: StockSymbol = {
        symbol: queryUpper,
        name: 'Market Search',
        price: 150.00 + Math.random() * 100,
        change: 0,
        changePercent: 0
      };
      setStocks(prev => [newStock, ...prev]);
      setSelectedSymbol(newStock.symbol);
    }
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-200">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">Gemini<span className="text-blue-500">Pulse</span></h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Market Intelligence</span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative hidden md:block w-96">
            <input
              type="text"
              placeholder="Search ticker (e.g. AMD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder-slate-500 hover:bg-slate-800"
            />
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          <div className="flex items-center gap-4">
             <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-blue-400 transition-colors hidden sm:block">
               Gemini API Docs
             </a>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              MARKET OPEN
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-7rem)]">
          
          {/* Left Sidebar: Stock List */}
          <div className="lg:col-span-3 h-full overflow-hidden flex flex-col">
             <StockList 
               stocks={stocks} 
               selectedSymbol={selectedSymbol} 
               onSelect={setSelectedSymbol} 
             />
          </div>

          {/* Center & Right: Dashboard */}
          <div className="lg:col-span-9 flex flex-col gap-6 h-full overflow-y-auto pb-6 pr-1 custom-scrollbar">
            
            {/* Top Row: Chart & Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Chart Section */}
              <div className="xl:col-span-2">
                 <div className="flex items-baseline justify-between mb-4 px-1">
                    <div>
                      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        {currentStock.symbol}
                        <span className="text-lg font-normal text-slate-400 border-l border-slate-700 pl-3">{currentStock.name}</span>
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-2xl font-mono text-white tracking-tight">${currentStock.price.toFixed(2)}</span>
                        <span className={`flex items-center text-sm font-semibold px-2 py-0.5 rounded ${currentStock.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                           {currentStock.change >= 0 ? '↑' : '↓'} {Math.abs(currentStock.change).toFixed(2)} ({Math.abs(currentStock.changePercent).toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                 </div>
                 <MarketChart 
                   symbol={currentStock.symbol} 
                   basePrice={currentStock.price} 
                   isPositive={currentStock.change >= 0}
                 />
              </div>

              {/* Quick Stats Grid */}
              <div className="xl:col-span-1 grid grid-rows-3 gap-4 h-full min-h-[250px]">
                 <div className="glass-panel p-4 rounded-xl flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Volume</span>
                    <span className="text-xl font-mono text-white">{(Math.random() * 50 + 10).toFixed(1)}M</span>
                    <span className="text-xs text-slate-500 mt-1">Avg: 32.1M</span>
                 </div>
                 <div className="glass-panel p-4 rounded-xl flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Market Cap</span>
                    <span className="text-xl font-mono text-white">{(Math.random() * 2 + 0.5).toFixed(1)}T</span>
                 </div>
                 <div className="glass-panel p-4 rounded-xl flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">P/E Ratio</span>
                    <span className="text-xl font-mono text-white">{(Math.random() * 40 + 15).toFixed(1)}</span>
                 </div>
              </div>

            </div>

            {/* Bottom Row: AI Analysis */}
            <div className="flex-1 min-h-[300px]">
              <AnalysisPanel 
                symbol={currentStock.symbol} 
                analysis={analysis} 
                loading={isAnalyzing} 
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;