
import React from 'react';
import { SentimentNewsItem } from '../types';
import { MessageSquare, ExternalLink, Smile, Frown, Meh } from 'lucide-react';

interface SentimentCardProps {
  data: SentimentNewsItem[];
  loading?: boolean;
}

const SentimentCard: React.FC<SentimentCardProps> = ({ data, loading }) => {
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center h-48">
         <div className="flex flex-col items-center gap-2 text-gray-400">
           <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
           <span className="text-xs">正在分析新聞情緒...</span>
         </div>
      </div>
    );
  }

  // Calculate Average Sentiment
  const hasData = data && data.length > 0;
  let avgSentiment = 0;
  let sentimentColor = 'text-gray-500';
  let SentimentIcon = Meh;
  let sentimentText = '中立';

  if (hasData) {
    const total = data.reduce((acc, item) => acc + (item.sentiment || 0), 0);
    avgSentiment = total / data.length;

    if (avgSentiment > 0.6) {
        sentimentColor = 'text-red-500'; // Positive in Taiwan stock context is usually Red
        SentimentIcon = Smile;
        sentimentText = '正向樂觀';
    } else if (avgSentiment < 0.4) {
        sentimentColor = 'text-green-600'; // Negative
        SentimentIcon = Frown;
        sentimentText = '負向悲觀';
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
             <MessageSquare className="w-5 h-5 text-indigo-600" />
             AI 新聞情緒分析 (GitHub Open Data)
           </h3>
           <p className="text-xs text-gray-500 mt-1">
             資料來源: tw_news_stocker (今日即時新聞情緒)
           </p>
        </div>
        {hasData && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm ${sentimentColor}`}>
                <SentimentIcon className="w-5 h-5" />
                <span className="font-bold text-sm">{sentimentText}</span>
            </div>
        )}
      </div>

      <div className="p-0">
        {!hasData ? (
          <div className="p-8 text-center text-gray-500">
             <p>今日尚無針對此個股的相關情緒分析資料。</p>
             <p className="text-xs mt-2 text-gray-400">資料來源 GitHub: voidful/tw_news_stocker</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
             {data.map((item, index) => {
               // Determine bar color based on item sentiment
               let barColor = 'bg-gray-300';
               if (item.sentiment > 0.6) barColor = 'bg-red-400';
               else if (item.sentiment < 0.4) barColor = 'bg-green-400';
               
               return (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors group">
                   <a href={item.link} target="_blank" rel="noreferrer" className="block">
                     <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                           <h4 className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 line-clamp-2">
                             {item.title}
                           </h4>
                           <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item.source}</span>
                              <span>{new Date(item.date).toLocaleDateString('zh-TW')}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 min-w-[60px]">
                           <span className="text-xs font-mono text-gray-400">情緒分</span>
                           <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full ${barColor}`} style={{ width: `${(item.sentiment || 0) * 100}%` }}></div>
                           </div>
                           <span className="text-xs font-bold text-gray-600">{(item.sentiment || 0).toFixed(2)}</span>
                        </div>
                     </div>
                   </a>
                </div>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentCard;
