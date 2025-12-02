

import React, { useMemo } from 'react';
import { FinMindCombinedData } from '../types';
import { Users, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface InstitutionalCardProps {
  data: FinMindCombinedData[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 shadow-xl rounded-xl text-sm z-50 min-w-[180px]">
        <p className="font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((p: any, index: number) => {
             // Skip if value is undefined
             if (p.value === undefined) return null;
             
             const isPrice = p.name === '收盤價';
             const unit = isPrice ? '元' : '張';
             const value = p.value;
             
             // Add '+' sign for positive numbers if it's not Price
             let displayValue = value.toLocaleString();
             if (!isPrice && value > 0) {
                displayValue = `+${displayValue}`;
             }

             // Determine text color for values: 
             let valueColor = 'text-gray-700';
             if (!isPrice) {
                 if (value > 0) valueColor = 'text-red-600';
                 else if (value < 0) valueColor = 'text-green-600';
             }

             return (
              <div key={index} className="flex justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ background: p.fill || p.stroke }}></span>
                  <span className="text-gray-600 font-medium text-xs">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold font-mono ${valueColor}`}>
                    {displayValue}
                  </span>
                  <span className="text-xs text-gray-400 ml-1 scale-90 inline-block origin-left">{unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const InstitutionalCard: React.FC<InstitutionalCardProps> = ({ data, loading }) => {
  // Process data for Chart: Reverse to get Oldest -> Newest
  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data].reverse().map(item => ({
      date: item.date,
      foreign: Math.round(item.foreignBuy / 1000),
      trust: Math.round(item.investmentTrustBuy / 1000),
      dealer: Math.round(item.dealerBuy / 1000),
      price: item.price
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-64 flex items-center justify-center">
        <div className="text-gray-400 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            載入三大法人數據中...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  const fmt = (num: number) => new Intl.NumberFormat('zh-TW').format(num);
  
  const getColor = (val: number) => {
    if (val > 0) return 'text-red-600';
    if (val < 0) return 'text-green-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
      {/* Table Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            三大法人 & 資券變化 (近10日)
          </h3>
          <p className="text-xs text-gray-500 mt-1">資料來源: FinMind 透過 API 即時抓取</p>
        </div>
        <div className="flex gap-2 text-xs">
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 買超/增加</span>
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 賣超/減少</span>
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm text-right whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <th className="px-3 py-3 text-left font-semibold">日期</th>
              <th className="px-3 py-3 font-semibold">外資</th>
              <th className="px-3 py-3 font-semibold">投信</th>
              <th className="px-3 py-3 font-semibold">自營商</th>
              <th className="px-3 py-3 font-semibold">融資餘額</th>
              <th className="px-3 py-3 font-semibold">融券餘額</th>
              <th className="px-3 py-3 font-semibold">收盤價</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-3 py-3 text-left text-gray-900 font-medium">{row.date}</td>
                <td className={`px-3 py-3 ${getColor(row.foreignBuy)} font-medium`}>{fmt(Math.floor(row.foreignBuy / 1000))}張</td>
                <td className={`px-3 py-3 ${getColor(row.investmentTrustBuy)}`}>{fmt(Math.floor(row.investmentTrustBuy / 1000))}張</td>
                <td className={`px-3 py-3 ${getColor(row.dealerBuy)}`}>{fmt(Math.floor(row.dealerBuy / 1000))}張</td>
                <td className="px-3 py-3 text-gray-700">{fmt(row.marginBalance)}張</td>
                <td className="px-3 py-3 text-gray-700">{fmt(row.shortBalance)}張</td>
                <td className="px-3 py-3 text-indigo-700 font-bold">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      <div className="pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
           <BarChart2 className="w-5 h-5 text-indigo-600" />
           <h4 className="text-base font-bold text-gray-800">籌碼面分析：三大法人買賣超 vs 股價</h4>
           <span className="text-xs text-gray-400">(柱狀圖: 張 / 折線圖: 元)</span>
        </div>
        
        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={0} barCategoryGap="20%">
               {/* 
                  3D Cylindrical Gradients Definition
               */}
               <defs>
                 {/* Foreign: Blue Theme */}
                 <linearGradient id="cylinderForeign" x1="0" y1="0" x2="1" y2="0">
                   <stop offset="0%" stopColor="#1e40af" />   {/* Dark Blue */}
                   <stop offset="50%" stopColor="#60a5fa" />  {/* Light Blue Center */}
                   <stop offset="100%" stopColor="#1e40af" /> {/* Dark Blue */}
                 </linearGradient>

                 {/* Trust: Teal Theme */}
                 <linearGradient id="cylinderTrust" x1="0" y1="0" x2="1" y2="0">
                   <stop offset="0%" stopColor="#0f766e" />   {/* Dark Teal */}
                   <stop offset="50%" stopColor="#2dd4bf" />  {/* Light Teal Center */}
                   <stop offset="100%" stopColor="#0f766e" /> {/* Dark Teal */}
                 </linearGradient>

                 {/* Dealer: Amber/Orange Theme */}
                 <linearGradient id="cylinderDealer" x1="0" y1="0" x2="1" y2="0">
                   <stop offset="0%" stopColor="#b45309" />   {/* Dark Amber */}
                   <stop offset="50%" stopColor="#fbbf24" />  {/* Light Amber Center */}
                   <stop offset="100%" stopColor="#b45309" /> {/* Dark Amber */}
                 </linearGradient>
               </defs>

               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
               <XAxis 
                 dataKey="date" 
                 tick={{ fontSize: 10, fill: '#9ca3af' }} 
                 axisLine={false} 
                 tickLine={false} 
                 padding={{ left: 10, right: 10 }}
               />
               
               <YAxis 
                 yAxisId="left"
                 tick={{ fontSize: 10, fill: '#9ca3af' }} 
                 axisLine={false} 
                 tickLine={false}
                 label={{ value: '買賣超 (千張)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#cbd5e1' }}
               />

               <YAxis 
                 yAxisId="right"
                 orientation="right"
                 tick={{ fontSize: 10, fill: '#f87171' }} 
                 axisLine={false} 
                 tickLine={false}
                 domain={['auto', 'auto']}
                 label={{ value: '股價', angle: 90, position: 'insideRight', fontSize: 10, fill: '#f87171' }}
               />

               <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
               <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

               <Bar 
                 yAxisId="left"
                 dataKey="foreign" 
                 name="外資" 
                 fill="url(#cylinderForeign)" 
                 barSize={12}
                 radius={[3, 3, 0, 0]}
               />
               
               <Bar 
                 yAxisId="left"
                 dataKey="trust" 
                 name="投信" 
                 fill="url(#cylinderTrust)" 
                 barSize={12}
                 radius={[3, 3, 0, 0]}
               />
               
               <Bar 
                 yAxisId="left"
                 dataKey="dealer" 
                 name="自營商" 
                 fill="url(#cylinderDealer)" 
                 barSize={12}
                 radius={[3, 3, 0, 0]}
               />

               {/* 
                  Changed type="monotone" to type="linear" for straight lines as requested 
               */}
               <Line 
                 yAxisId="right"
                 type="linear" 
                 dataKey="price" 
                 name="收盤價" 
                 stroke="#dc2626" 
                 strokeWidth={2}
                 dot={{ r: 3, fill: '#dc2626', strokeWidth: 0 }} 
                 activeDot={{ r: 5 }}
               />
               
             </ComposedChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalCard;
