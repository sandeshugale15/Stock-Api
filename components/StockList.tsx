import React from 'react';
import { StockSymbol } from '../types';

interface StockListProps {
  stocks: StockSymbol[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

const StockList: React.FC<StockListProps> = ({ stocks, selectedSymbol, onSelect }) => {
  return (
    <div className="glass-panel rounded-xl p-4 h-full overflow-hidden flex flex-col">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 px-2">Watchlist</h3>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {stocks.map((stock) => {
          const isSelected = stock.symbol === selectedSymbol;
          const isPositive = stock.change >= 0;
          
          return (
            <button
              key={stock.symbol}
              onClick={() => onSelect(stock.symbol)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 border ${
                isSelected 
                  ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'bg-slate-800/30 border-transparent hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>{stock.symbol}</span>
                <span className="text-xs text-slate-500 truncate max-w-[100px]">{stock.name}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm text-slate-200">${stock.price.toFixed(2)}</span>
                <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StockList;