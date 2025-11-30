import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisPanelProps {
  symbol: string;
  analysis: AnalysisResult | null;
  loading: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ symbol, analysis, loading }) => {
  return (
    <div className="glass-panel rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Gemini Market Insight
        </h2>
        <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
          Powered by Gemini 2.5
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            <div className="h-20 bg-slate-700 rounded w-full mt-4"></div>
          </div>
        ) : analysis ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="leading-relaxed text-slate-300">
              {analysis.text}
            </p>

            {analysis.sources && analysis.sources.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-700">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sources & Real-time Data</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.sources.map((source, idx) => (
                    source.web?.uri && (
                      <a 
                        key={idx} 
                        href={source.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-xs text-blue-400 border border-slate-700 truncate max-w-[200px]"
                      >
                        <span className="truncate">{source.web.title || new URL(source.web.uri).hostname}</span>
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a stock to generate AI analysis.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;