
import React, { useState } from 'react';
import { LineChart, Trophy, ExternalLink, Activity, BarChart2 } from 'lucide-react';

interface StockChartProps {
  symbol: string; // e.g., "2330"
}

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [activeTab, setActiveTab] = useState<'technical' | 'rank'>('technical');

  // HiStock URLs
  const technicalUrl = `https://histock.tw/stock/${symbol}`;
  const rankUrl = "https://histock.tw/stock/rank.aspx?p=all";

  return (
    <div className="h-[500px] w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4 flex flex-col">
      {/* Header Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('technical')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'technical'
              ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
              : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <LineChart className="w-4 h-4" />
          個股技術分析 ({symbol})
        </button>
        <button
          onClick={() => setActiveTab('rank')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'rank'
              ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
              : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          市場排行與篩選
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 bg-slate-50 relative flex flex-col items-center justify-center text-center">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
           <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
          
          {activeTab === 'technical' ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">HiStock 嗨投資 - 技術線圖</h3>
              <p className="text-gray-500 mb-8">
                查看 {symbol} 的 K 線圖、均線、成交量與完整技術指標。
                <br />
                (由於來源限制，請點擊下方按鈕開啟專業圖表)
              </p>
              
              <a 
                href={technicalUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full"
              >
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5">
                  開啟 {symbol} 技術分析頁面
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <BarChart2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">台股市場排行資訊</h3>
              <p className="text-gray-500 mb-8">
                查看台股上市櫃漲跌幅排行、成交量排行與三大法人買賣超統計。
              </p>
              
              <a 
                href={rankUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full"
              >
                <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5">
                  前往 HiStock 排行榜
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
            </div>
          )}

        </div>

        <div className="mt-8 text-xs text-gray-400">
           資料來源：HiStock 嗨投資 (histock.tw)
        </div>
      </div>
    </div>
  );
};

export default StockChart;
