import React, { useState, useCallback, useMemo } from 'react';
import { fetchStockInfo } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface StockInfoProps {
  content: string;
  onHashtagClick?: (hashtag: string) => void;
}

const StockInfo: React.FC<StockInfoProps> = ({ content, onHashtagClick }) => {
  const [tickerInfo, setTickerInfo] = useState<Record<string, { loading: boolean; info: string | null; error: string | null }>>({});

  const mentionedTickers = useMemo(() => {
    const tickerRegex = /\$([A-Z]{1,5})\b/g;
    const matches = content.match(tickerRegex);
    return matches ? [...new Set(matches.map(t => t.substring(1)))] : [];
  }, [content]);

  const handleTickerClick = useCallback(async (ticker: string) => {
    if (tickerInfo[ticker]?.info || tickerInfo[ticker]?.loading) return;

    setTickerInfo(prev => ({ ...prev, [ticker]: { loading: true, info: null, error: null } }));
    try {
      const info = await fetchStockInfo(ticker);
      setTickerInfo(prev => ({ ...prev, [ticker]: { loading: false, info, error: null } }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '發生未知錯誤';
      setTickerInfo(prev => ({ ...prev, [ticker]: { loading: false, info: null, error: errorMessage } }));
    }
  }, [tickerInfo]);
  
  const renderContentWithTags = () => {
    const tagRegex = /(\$[A-Z]{1,5}\b|#[\w\u4e00-\u9fa5]+)/g;
    const parts = content.split(tagRegex);

    return parts.map((part, index) => {
      if (part.startsWith('$')) {
        const ticker = part.substring(1);
        return (
          <span
            key={index}
            onClick={() => handleTickerClick(ticker)}
            className="text-blue-400 font-bold cursor-pointer hover:underline"
          >
            {part}
          </span>
        );
      }
       if (part.startsWith('#')) {
        const hashtag = part.substring(1);
        return (
          <span
            key={index}
            onClick={() => onHashtagClick?.(hashtag)}
            className="text-green-400 font-bold cursor-pointer hover:underline"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div>
      <div className="whitespace-pre-wrap leading-relaxed">{renderContentWithTags()}</div>
      {mentionedTickers.length > 0 && (
        <div className="mt-6 space-y-4">
          {mentionedTickers.map(ticker => {
            const infoState = tickerInfo[ticker];
            if (!infoState) return null;

            return (
              <div key={ticker} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold text-blue-400 flex items-center">
                  關於 ${ticker} 的 AI 摘要
                </h4>
                {infoState.loading && <div className="py-4"><LoadingSpinner /></div>}
                {infoState.error && <p className="text-red-400 mt-2">{infoState.error}</p>}
                {infoState.info && <p className="text-gray-300 mt-2">{infoState.info}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockInfo;