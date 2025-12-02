
import { InstitutionalData, MarginData, DailyPriceData, FinMindCombinedData } from "../types";

const FINMIND_API_URL = "https://api.finmindtrade.com/api/v4/data";
// User provided token
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNS0xMS0yMyAxMzozNDoyMCIsInVzZXJfaWQiOiJjaGloY2h1bmdqbyIsImlwIjoiMTE4LjE2OC4yMTUuMTk4In0.KzP7-d56UOJAJUDlQ-b3NaVsKe0rv1gsDtHXbnQeJwg";

const getStartDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const fetchFinMindData = async (stockId: string): Promise<FinMindCombinedData[]> => {
  const startDate = getStartDate(20); // Fetch 20 days to ensure we get 10 trading days

  try {
    // 1. Fetch Institutional Investors (三大法人)
    const instRes = await fetch(`${FINMIND_API_URL}?dataset=TaiwanStockInstitutionalInvestorsBuySell&data_id=${stockId}&start_date=${startDate}&token=${API_TOKEN}`);
    const instJson = await instRes.json();
    const instData: InstitutionalData[] = instJson.data || [];

    // 2. Fetch Margin Trading (融資融券)
    const marginRes = await fetch(`${FINMIND_API_URL}?dataset=TaiwanStockMarginPurchaseShortSale&data_id=${stockId}&start_date=${startDate}&token=${API_TOKEN}`);
    const marginJson = await marginRes.json();
    const marginData: MarginData[] = marginJson.data || [];

    // 3. Fetch Price (股價 - 用於顯示與乖離參考)
    const priceRes = await fetch(`${FINMIND_API_URL}?dataset=TaiwanStockPrice&data_id=${stockId}&start_date=${startDate}&token=${API_TOKEN}`);
    const priceJson = await priceRes.json();
    const priceData: DailyPriceData[] = priceJson.data || [];

    // Combine Data by Date
    // Get unique dates from price data (trading days)
    const dates = priceData.map(p => p.date).sort();
    // Keep only last 10 days
    const recentDates = dates.slice(-10);

    const combined: FinMindCombinedData[] = recentDates.map(date => {
      // Filter Institutional Data for this date
      const dayInst = instData.filter(d => d.date === date);
      const foreign = dayInst.find(d => d.name === "Foreign_Investor")?.buy || 0; // Note: FinMind structure might differ, usually it's buy - sell = net, wait. 
      // FinMind API returns 'buy' and 'sell' columns. Net = buy - sell.
      
      const calcNet = (name: string) => {
        const item = dayInst.find(d => d.name === name);
        return item ? (item.buy - item.sell) : 0;
      };

      const foreignNet = calcNet("Foreign_Investor");
      const trustNet = calcNet("Investment_Trust");
      const dealerNet = calcNet("Dealer_Self") + calcNet("Dealer_Hedging"); // Combine Dealer Self & Hedging

      // Filter Margin Data
      const dayMargin = marginData.find(d => d.date === date);
      
      // Filter Price
      const dayPrice = priceData.find(d => d.date === date);

      return {
        date,
        foreignBuy: foreignNet,
        investmentTrustBuy: trustNet,
        dealerBuy: dealerNet,
        marginBalance: dayMargin ? dayMargin.MarginPurchaseTodayBalance : 0,
        shortBalance: dayMargin ? dayMargin.ShortSaleTodayBalance : 0,
        price: dayPrice ? dayPrice.close : 0
      };
    });

    return combined.reverse(); // Newest first

  } catch (error) {
    console.error("Error fetching FinMind data:", error);
    return [];
  }
};
