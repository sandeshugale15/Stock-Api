import React, { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketDataPoint } from '../types';

interface MarketChartProps {
  symbol: string;
  basePrice: number;
  isPositive: boolean;
}

const MarketChart: React.FC<MarketChartProps> = ({ symbol, basePrice, isPositive }) => {
  const [data, setData] = useState<MarketDataPoint[]>([]);

  // Generate initial mock intraday data based on the base price
  useEffect(() => {
    const initialData: MarketDataPoint[] = [];
    const now = new Date();
    let currentPrice = basePrice;
    
    // Create 50 points leading up to now
    for (let i = 50; i > 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
      const volatility = basePrice * 0.002; // 0.2% volatility
      const change = (Math.random() - 0.5) * volatility;
      currentPrice += change;
      
      initialData.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: Number(currentPrice.toFixed(2))
      });
    }
    setData(initialData);
  }, [basePrice, symbol]);

  // Simulate real-time ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        if (prevData.length === 0) return prevData;
        
        const lastPrice = prevData[prevData.length - 1].value;
        const volatility = lastPrice * 0.0005; // Smaller volatility for live ticks
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = Number((lastPrice + change).toFixed(2));
        
        const now = new Date();
        const newPoint = {
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: newPrice
        };

        // Keep only last 50 points
        return [...prevData.slice(1), newPoint];
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const color = isPositive ? "#10b981" : "#ef4444"; // Green or Red
  const gradientId = `colorPrice-${symbol}`;

  return (
    <div className="w-full h-64 md:h-96 p-4 glass-panel rounded-xl">
      <h3 className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">Live Performance</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#${gradientId})`} 
            strokeWidth={2}
            isAnimationActive={false} // Disable animation for smoother real-time ticking
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;